import { Reducer, AnyAction } from 'redux';
import {
    IActionHandler, IActionCreatorFactory,
    IAsyncPayload, IMetaAsyncActionCreatorFactory,
    IAsyncActionHandler,
    ModuleAction,
    ModuleMetaAction,
    IAsyncResultPayload,
    ModuleRejectedMetaAction
} from './types';

import { IActionCreatorBuilderResult, createActionCreatorBuilder, IActionCreators, IEffectCreators, bindActionsToDispatcher } from './action-builder';

export type GetActionTypes<AC extends IActionCreators<A>, A = {}> = {
    [K in keyof AC]: AC[K] extends IActionCreatorFactory<infer TP, infer TD> ? ModuleAction<TP> : never;
}
export type IActionHandlers<TState, AC extends IActionCreators<A>, A = {}> = {

    [K in keyof AC]+?: AC[K] extends IActionCreatorFactory<infer TP, infer TD> ?
    IActionHandler<TState, TP> : never;
}

export type IActionHandlersFactory<TState, AC extends IActionCreators<A>, A = {}> = {

    [K in keyof AC]: AC[K] extends IActionCreatorFactory<infer TP, infer TD> ?
    (handler: IActionHandler<TState, TP>) => void : never;
}


export type IEffectHandlers<TState, EF extends IEffectCreators<E>, E = {}> = {

    [K in keyof EF]+?: EF[K] extends IMetaAsyncActionCreatorFactory<infer TR, infer TD, infer TM> ?
    IAsyncActionHandler<TState, IAsyncPayload<TR>, TR, TM> : never;
}

export type IEffectHandlersFactory<TState, AC extends IActionCreators<A>, A = {}> = {

    [K in keyof AC]: AC[K] extends IMetaAsyncActionCreatorFactory<infer TR, infer TD, infer TM> ?
    (handler: IAsyncActionHandler<TState, IAsyncPayload<TR>, TR, TM>) => void : never;
}

export type GetEffectActionTypes<EF extends IEffectCreators<E>, E = {}> = {

    [K in keyof EF]+?: EF[K] extends IMetaAsyncActionCreatorFactory<infer TR, infer TD, infer TM> ?
    {
        fulfilled: ModuleMetaAction<IAsyncResultPayload<TR>, TM>;
        pending: ModuleMetaAction<TM, TM>;
        rejected: ModuleRejectedMetaAction<Error, TM>;
    } : never;
}

interface IHandlersFactory<TState, ABR extends IActionCreatorBuilderResult<A, E>, AC = ABR['actionCreators'], EC = ABR['effectCreators'], A = {}, E = {}> {
    handlers: IActionHandlersFactory<TState, AC> & IEffectHandlersFactory<TState, EC>;
}

/**
 * Creates type-safe reducer for actions and effects creators using the respective handlers.
 * @param ac action creator builder result
 * @param handlers action and effect handlers
 * @param initialState the initial state to be used by the reducer
 */
export function buildReducer<ABR extends IActionCreatorBuilderResult<A, E>, TState = {}, A = {}, E = {}>(ac: ABR,
    handlersFactory: (options: IHandlersFactory<TState, ABR>) => void,
    initialState?: TState
): Reducer<TState, AnyAction> {

    const actionHandlers = new Map<string, IActionHandler<TState, any>>();

    const actionHandlerFactories = Object.keys(ac.actionCreators).reduce((prev: any, key) => ({
        ...prev,
        [key]: (a: any) => {
            const isActionHandler = a instanceof Function;
            if (isActionHandler) {
                actionHandlers.set(`${ac.namespace}/${key}`.toUpperCase(), a);
                return;
            }
            Object.keys(a).forEach(stateHandlerKey => {
                actionHandlers.set(`${ac.namespace}/${key}-${stateHandlerKey}`.toUpperCase(), a[stateHandlerKey] as IActionHandler<TState, any>);
            });
        }
    }), {});

    const effectHandlerFactories = Object.keys(ac.effectCreators).reduce((prev: any, key) => ({
        ...prev,
        [key]: (a: any) => {
            actionHandlers.set(`${ac.namespace}/${key}`.toUpperCase(), a);
        }
    }), {});

    handlersFactory({
        handlers: { ...actionHandlerFactories, ...effectHandlerFactories }
    });



    return (state: TState | undefined, action: any) => {

        const finalState: any = state || initialState;

        const handler = actionHandlers.get(action.type);

        return handler ? handler(finalState, action) : finalState;
    };

}