import { Reducer, AnyAction } from 'redux';
import {
    IActionBuilderResult, IActionCreatorMap, ModuleAction,
    IActionCreatorFactoryMap, IActionCreator
} from './action-builder';
import { getNamespace } from './internal-helpers';



export interface IActionHandler<TState, TPayload, TMeta = any> {
    (state: TState, action: ModuleAction<TPayload, TMeta>): TState;
}

export interface IAsyncActionHandler<TState, TResult, TMeta = any> {
    fulfilled?: (state: TState, action: ModuleAction<TResult, TMeta>) => TState;
    pending?: (state: TState, action: ModuleAction<TMeta, TMeta>) => TState;
    rejected?: (state: TState, action: ModuleAction<Error, TMeta>) => TState;
}


export type IActionHandlers<TState, AC extends IActionCreatorMap<TAFM, A>, TAFM extends IActionCreatorFactoryMap<A>, A = {}> = {

    [K in keyof AC]+?: AC[K] extends IActionCreator<infer TA, infer TP, infer TM> ?
    IActionHandler<TState, TP, TM> : never;
}

export type IActionHandlersFactory<TState, AC extends IActionCreatorMap<TAFM, A>, A = {},
    TAFM extends IActionCreatorFactoryMap<A> = IActionCreatorFactoryMap<A>> = {

        [K in keyof AC]: AC[K] extends IActionCreator<infer TA, infer TP, infer TM> ?
        TP extends Promise<infer TResult> ?
        (handler: IAsyncActionHandler<TState, TResult, TM>) => void :
        AC[K] extends IActionCreator<infer TA, infer TP, infer TM> ?
        (handler: IActionHandler<TState, TP>) => void : never : never;
    }


interface IHandlersFactory<TState, ABR extends IActionBuilderResult<A>, AC = ABR['actionCreators'], A = {}> {
    handlers: IActionHandlersFactory<TState, AC>;
}

/**
 * Creates type-safe reducer for actions and effects creators using the respective handlers.
 * @param ac action creator builder result
 * @param handlers action and effect handlers
 * @param initialState the initial state to be used by the reducer
 */
export function buildReducer<ABR extends IActionBuilderResult<A>, TState = {}, A = {}>(ac: ABR,
    handlersFactory: (options: IHandlersFactory<TState, ABR>) => void,
    initialState?: TState
): Reducer<TState, AnyAction> {

    const actionHandlers = new Map<string, IActionHandler<TState, any>>();

    const namespace = getNamespace(ac.actionCreators);
    const actionHandlerFactories = Object.keys(ac.actionCreators).reduce((prev: any, key) => ({
        ...prev,
        [key]: (a: any) => {
            const isActionHandler = a instanceof Function;
            if (isActionHandler) {
                actionHandlers.set(`${namespace}/${key}`.toUpperCase(), a);
                return;
            }
            Object.keys(a).forEach(stateHandlerKey => {
                actionHandlers.set(`${namespace}/${key}_${stateHandlerKey}`.toUpperCase(), a[stateHandlerKey] as IActionHandler<TState, any>);
            });
        }
    }), {});


    handlersFactory({
        handlers: { ...actionHandlerFactories }
    });



    return (state: TState | undefined, action: any) => {

        const finalState: any = state || initialState;

        const handler = actionHandlers.get(action.type);

        return handler ? handler(finalState, action) : finalState;
    };

}