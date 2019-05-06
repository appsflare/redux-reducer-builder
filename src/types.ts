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
export interface IActionHandler<TState, TPayload> {
    (state: TState, action: ModuleAction<TPayload>): TState;
}

export interface IAsyncActionHandler<TState, TPayload extends IAsyncPayload<TResult>, TResult, TMeta = any> {
    fulfilled?: (state: TState, action: ModuleMetaAction<IAsyncResultPayload<TResult>, TMeta>) => TState;
    pending?: (state: TState, action: ModuleMetaAction<TPayload, TMeta>) => TState;
    rejected?: (state: TState, action: ModuleRejectedMetaAction<Error, TMeta>) => TState;
}

export interface IReducerBuilder<TState> {
    /**
     * registers a function as handler to run as reducer method once an action mathcing given action creator is dispatched
     * @param actionCreator the action creator definition
     * @param handler the handler that would be called when the action is dispatched
     */
    handleAction<TPayload>(actionCreator: IActionCreatorFactory<TPayload>, handler: IActionHandler<TState, TPayload>): IReducerBuilder<TState>;
    /**
     * registers a function as handler to run as a reducer method once one of the actions matching given action creators is dispatched
     * @param actionCreators array of action creator definitions
     * @param handler the handler that would be called when the action matching given action creator's definition is dispatched
     */
    handleActions<TPayload>(actionCreators: IActionCreatorFactory<TPayload>[], handler: IActionHandler<TState, TPayload>): IReducerBuilder<TState>;
    /**
     * Registers async action handlers of the given async action creator definition.
     * @param actionCreator an async action creator definition
     * @param stateHandlers state handlers to handler three states of an asynchronous action namely pending, fulfilled and rejected
     */
    handleAsyncAction<TPayload extends IAsyncPayload<TResult>, TResult, TData = any, TMeta = any>(actionCreator: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>,
        stateHandlers: Partial<IAsyncActionHandler<TState, TPayload, TResult, TMeta>>): IReducerBuilder<TState>;
    /**
     * Registers async action handlers of the given async action creator definitions.
     * @param actionCreators an array of async action creator definitions
     * @param stateHandlers state handlers to handler three states of an asynchronous action namely pending, fulfilled and rejected
     */
    handleAsyncActions<TPayload extends IAsyncPayload<TResult>, TResult, TData = any, TMeta = any>(actionCreators: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>[],
        stateHandlers: Partial<IAsyncActionHandler<TState, TPayload, TResult, TMeta>>): IReducerBuilder<TState>;
    /**
     * Composes a reducer method with registered action handlers
     * @param initialState the initial state of the reducer. This is useful when redux dispatches @init action to initialize with default state
     */
    build(initialState?: TState): Reducer<TState>;
}