import { Reducer, AnyAction } from 'redux';
import { IActionHandler, IActionCreatorFactory, IAsyncPayload, IMetaAsyncActionCreatorFactory, IAsyncActionHandler, ModuleAction, ModuleMetaAction, IAsyncResultPayload, ModuleRejectedMetaAction } from './types';
import { IActionCreatorBuilderResult, IActionCreators, IEffectCreators } from './action-builder';
export declare type GetActionTypes<AC extends IActionCreators<A>, A = {}> = {
    [K in keyof AC]: AC[K] extends IActionCreatorFactory<infer TP, infer TD> ? ModuleAction<TP> : never;
};
export declare type IActionHandlers<TState, AC extends IActionCreators<A>, A = {}> = {
    [K in keyof AC]+?: AC[K] extends IActionCreatorFactory<infer TP, infer TD> ? IActionHandler<TState, TP> : never;
};
export declare type IActionHandlersFactory<TState, AC extends IActionCreators<A>, A = {}> = {
    [K in keyof AC]: AC[K] extends IActionCreatorFactory<infer TP, infer TD> ? (handler: IActionHandler<TState, TP>) => void : never;
};
export declare type IEffectHandlers<TState, EF extends IEffectCreators<E>, E = {}> = {
    [K in keyof EF]+?: EF[K] extends IMetaAsyncActionCreatorFactory<infer TR, infer TD, infer TM> ? IAsyncActionHandler<TState, IAsyncPayload<TR>, TR, TM> : never;
};
export declare type IEffectHandlersFactory<TState, AC extends IActionCreators<A>, A = {}> = {
    [K in keyof AC]: AC[K] extends IMetaAsyncActionCreatorFactory<infer TR, infer TD, infer TM> ? (handler: IAsyncActionHandler<TState, IAsyncPayload<TR>, TR, TM>) => void : never;
};
export declare type GetEffectActionTypes<EF extends IEffectCreators<E>, E = {}> = {
    [K in keyof EF]+?: EF[K] extends IMetaAsyncActionCreatorFactory<infer TR, infer TD, infer TM> ? {
        fulfilled: ModuleMetaAction<IAsyncResultPayload<TR>, TM>;
        pending: ModuleMetaAction<TM, TM>;
        rejected: ModuleRejectedMetaAction<Error, TM>;
    } : never;
};
interface IHandlersFactory<TState, ABR extends IActionCreatorBuilderResult<A, E>, AC = ABR['actionCreators'], EC = ABR['effectCreators'], A = {}, E = {}> {
    handlers: IActionHandlersFactory<TState, AC> & IEffectHandlersFactory<TState, EC>;
}
/**
 * Creates type-safe reducer for actions and effects creators using the respective handlers.
 * @param ac action creator builder result
 * @param handlers action and effect handlers
 * @param initialState the initial state to be used by the reducer
 */
export declare function buildReducer<ABR extends IActionCreatorBuilderResult<A, E>, TState = {}, A = {}, E = {}>(ac: ABR, handlersFactory: (options: IHandlersFactory<TState, ABR>) => void, initialState?: TState): Reducer<TState, AnyAction>;
export {};
