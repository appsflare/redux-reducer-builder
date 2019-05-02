import { Reducer, AnyAction, Action } from 'redux';

export interface PayloadAction<TType extends string, TPayload> extends Action<TType> {
    payload: TPayload;
}
export interface PayloadMetaAction<TType extends string, TPayload, TMeta> extends Action<TType> {
    payload: TPayload;
    meta: TMeta;
}

export interface FluxStandardAction<TType extends string, TPayload = any, TMeta = any> extends Action<TType> {
    payload?: TPayload;
    meta?: TMeta;
    error?: boolean;
}

export function createPayloadAction<TType, TPayload>(type: TType) {
    return (payload: TPayload) => ({ type, payload });
}

export interface ModuleAction<TPayload> extends PayloadAction<string, TPayload> { }
export interface ModuleMetaAction<TPayload, TMeta> extends PayloadMetaAction<string, TPayload, TMeta> { }
export interface ModuleRejectedMetaAction<TPayload, TMeta> extends FluxStandardAction<string, TPayload, TMeta> { }

export interface IActionCreatorFactory<TPayload, TData = any> {
    type: string;
    create(data?: TData): ModuleAction<TPayload>;
}

export interface IAsyncPayload<TResult> {
    (...args: any[]): Promise<IAsyncResultPayload<TResult>>;
}

export interface IMetaAsyncActionCreatorFactory<TResult, TData = any, TMeta = any> {
    type: string;
    create(data?: TData): ModuleMetaAction<IAsyncPayload<TResult>, TMeta>;
}

export interface IAsyncResultPayload<TResult> {
    result: TResult;
}
export type IActionHandler<TState, TPayload> = (state: TState, action: ModuleAction<TPayload>) => TState;

export interface IAsyncActionHandler<TState, TPayload extends IAsyncPayload<TResult>, TResult, TMeta = any> {
    fulfilled?: (state: TState, action: ModuleMetaAction<IAsyncResultPayload<TResult>, TMeta>) => TState;
    pending?: (state: TState, action: ModuleMetaAction<TPayload, TMeta>) => TState;
    rejected?: (state: TState, action: ModuleRejectedMetaAction<Error, TMeta>) => TState;
}