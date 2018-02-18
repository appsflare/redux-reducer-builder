import { Reducer } from 'redux';
import { PayloadAction, PayloadMetaAction, FluxStandardAction } from 'react-redux-typescript';
export interface ModuleAction<TPayload> extends PayloadAction<string, TPayload> {
}
export interface ModuleMetaAction<TPayload, TMeta> extends PayloadMetaAction<string, TPayload, TMeta> {
}
export interface ModuleRejectedMetaAction<TPayload, TMeta> extends FluxStandardAction<string, TPayload, TMeta> {
}
export interface IActionCreator<TPayload, TData = any> {
    type: string;
    create(data?: TData): ModuleAction<TPayload>;
}
export interface IMetaAsyncActionCreator<TResult, TData = any, TMeta = any> {
    type: string;
    create(data?: TData): ModuleMetaAction<IAsyncPayload<TResult>, TMeta>;
}
export interface IAsyncPayload<TResult, TData = any> {
    promise: Promise<IAsyncResultPayload<TResult>> | ((...args: any[]) => Promise<IAsyncResultPayload<TResult>>);
    data?: TData;
}
export interface IAsyncResultPayload<TResult> {
    result: TResult;
}
export declare type IActionHandler<TState, TPayload> = (state: TState, action: ModuleAction<TPayload>) => TState;
export interface IAsyncActionHandler<TState, TPayload extends IAsyncPayload<TResult, TData>, TResult, TData = any, TMeta = any> {
    fulfilled(state: TState, action: ModuleMetaAction<IAsyncResultPayload<TResult>, TMeta>): TState;
    pending(state: TState, action: ModuleMetaAction<TPayload, TMeta>): TState;
    rejected(state: TState, action: ModuleRejectedMetaAction<Error, TMeta>): TState;
}
/**
 * Creates an type safe action creator
 * @param type type of the action
 * @param payloadFactory a factory method to create payload for the action
 */
export declare function createActionCreator<TPayload, TData>(type: string, payloadFactory: (data?: TData) => TPayload): IActionCreator<TPayload, TData>;
/**
 * Creates an type safe asynchronous action creator
 * @param type type of the action
 * @param payloadFactory a factory method to create payload for the action
 */
export declare function createAsyncActionCreator<TResult, TData = any, TMeta = any>(type: string, payloadFactory: (data?: TData) => {
    meta?: TMeta;
    payload: IAsyncPayload<TResult, TData>;
}): IMetaAsyncActionCreator<TResult, TData, TMeta>;
/**
 * Create a new instance of reduce builder
 * @type TSTate defines type of state
*/
export declare function createReducerBuilder<TState>(): {
    handleAction<TPayload>(actionCreator: IActionCreator<TPayload, any>, handler: IActionHandler<TState, TPayload>): any;
    handleActions<TPayload>(actionCreators: IActionCreator<TPayload, any>[], handler: IActionHandler<TState, TPayload>): any;
    handleAsyncAction<TPayload extends IAsyncPayload<TResult, TData>, TResult, TData = any, TMeta = any>(actionCreator: IMetaAsyncActionCreator<TResult, TData, TMeta>, stateHandlers: Partial<IAsyncActionHandler<TState, TPayload, TResult, TData, TMeta>>): any;
    handleAsyncActions<TPayload extends IAsyncPayload<TResult, TData>, TResult, TData = any, TMeta = any>(actionCreators: IMetaAsyncActionCreator<TResult, TData, TMeta>[], stateHandlers: Partial<IAsyncActionHandler<TState, TPayload, TResult, TData, TMeta>>): any;
    build(initialState?: TState | undefined): Reducer<TState>;
};
