import { Reducer, AnyAction } from 'redux';
import { IActionBuilderResult, IActionCreatorMap, ModuleAction, IActionCreatorFactoryMap, IActionCreator } from './action-builder';
export interface IActionHandler<TState, TPayload, TMeta = any> {
    (state: TState, action: ModuleAction<TPayload, TMeta>): TState;
}
export interface IAsyncActionHandler<TState, TResult, TMeta = any> {
    fulfilled?: (state: TState, action: ModuleAction<TResult, TMeta>) => TState;
    pending?: (state: TState, action: ModuleAction<TMeta, TMeta>) => TState;
    rejected?: (state: TState, action: ModuleAction<Error, TMeta>) => TState;
}
export declare type IActionHandlers<TState, AC extends IActionCreatorMap<TAFM, A>, TAFM extends IActionCreatorFactoryMap<A>, A = {}> = {
    [K in keyof AC]+?: AC[K] extends IActionCreator<infer TA, infer TP, infer TM> ? IActionHandler<TState, TP, TM> : never;
};
export declare type IActionHandlersFactory<TState, AC extends IActionCreatorMap<TAFM, A>, A = {}, TAFM extends IActionCreatorFactoryMap<A> = IActionCreatorFactoryMap<A>> = {
    [K in keyof AC]: AC[K] extends IActionCreator<infer TA, infer TP, infer TM> ? TP extends Promise<infer TResult> ? (handler: IAsyncActionHandler<TState, TResult, TM>) => void : AC[K] extends IActionCreator<infer TA, infer TP, infer TM> ? (handler: IActionHandler<TState, TP>) => void : never : never;
};
interface IHandlersFactory<TState, ABR extends IActionBuilderResult<A>, AC = ABR['actionCreators'], A = {}> {
    handlers: IActionHandlersFactory<TState, AC>;
}
/**
 * Creates type-safe reducer for actions and effects creators using the respective handlers.
 * @param ac action creator builder result
 * @param handlers action and effect handlers
 * @param initialState the initial state to be used by the reducer
 */
export declare function buildReducer<ABR extends IActionBuilderResult<A>, TState = {}, A = {}>(ac: ABR, handlersFactory: (options: IHandlersFactory<TState, ABR>) => void, initialState?: TState): Reducer<TState, AnyAction>;
export {};
