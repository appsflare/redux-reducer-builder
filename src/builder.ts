import { Reducer, AnyAction } from 'redux';
import {
    IActionHandler, IActionCreatorFactory,
    IAsyncPayload, IMetaAsyncActionCreatorFactory,
    IAsyncActionHandler
} from './types';

import { IActionCreatorBuilderResult, createActionCreatorBuilder, IActionCreators, IEffectCreators } from './action-builder';

export type IActionHandlers<TState, AC extends IActionCreators<A>, A = {}> = {

    [K in keyof AC]+?: AC[K] extends IActionCreatorFactory<infer TD, infer TP> ?
    IActionHandler<TState, TP> : never;
}

export type IEffectHandlers<TState, EF extends IEffectCreators<E>, E = {}> = {

    [K in keyof EF]+?: EF[K] extends IMetaAsyncActionCreatorFactory<infer TR, infer TD, infer TM> ?
    IAsyncActionHandler<TState, IAsyncPayload<TR>, TR, TM> : never;
}


interface AllHandlers<TState, ABR extends IActionCreatorBuilderResult<A, E>, AC = ABR['actionCreators'], EC = ABR['effectCreators'], A = {}, E = {}> {
    actions?: IActionHandlers<TState, AC>;
    effects?: IEffectHandlers<TState, EC>;
}

// const a: IActionHandlers<{}, typeof SampleActions>;
// a.add()

/**
 * Creates type-safe reducer for actions and effects creators using the respective handlers.
 * @param ac action creator builder result
 * @param handlers action and effect handlers
 * @param initialState the initial state to be used by the reducer
 */
export function buildReducer<ABR extends IActionCreatorBuilderResult<A, E>, TState = {}, A = {}, E = {}>(ac: ABR,
    handlers: AllHandlers<TState, ABR>,
    initialState?: TState
): Reducer<TState, AnyAction> {

    const { actions, effects } = handlers;

    const actionHandlers = new Map<string, IActionHandler<TState, any>>();

    if (actions !== undefined) {
        Object.keys(actions).forEach((key) => {
            actionHandlers.set(`${ac.namespace}/${key}`.toUpperCase(), (actions as any)[key]);
        });
    }

    if (effects !== undefined) {
        Object.keys(effects).forEach((key) => {

            const stateHandlers = (effects as any)[key];

            Object.keys(stateHandlers).forEach(stateHandlerKey => {

                actionHandlers.set(`${ac.namespace}/${key}-${stateHandlerKey}`.toUpperCase(), stateHandlers[stateHandlerKey] as IActionHandler<TState, any>);
            });

            actionHandlers.set(`${ac.namespace}/${key}`, (actions as any)[key]);
        });
    }

    return (state: TState | undefined, action: any) => {

        const finalState: any = state || initialState;

        const handler = actionHandlers.get(action.type);

        return handler ? handler(finalState, action) : finalState;
    };

}