import { Action, AnyAction } from 'redux';
export interface ThunkDispatch<A extends Action = AnyAction> {
    <T extends A, TR = any>(action: T | IThunk<TR>): TR;
}
export declare type IThunk<TResult, TState = any> = (dispatch: ThunkDispatch, getState: () => TState, ...args: any[]) => TResult;
export declare type IThunkCreator<TArgs, TResult = void, TState = any> = (args?: TArgs) => IThunk<TResult, TState>;
export declare type IThunkCreatorMap<T, TState = any> = {
    [K in keyof T]: T[K] extends IThunkCreator<infer TArgs, infer TResult> ? IThunkCreator<TArgs, TResult, TState> : never;
};
export declare type IThunkCreators<TCFM extends IThunkCreatorMap<T, TState>, T, TState = any> = {
    [K in keyof TCFM]: TCFM[K] extends IThunkCreator<infer TArgs, infer TResult> ? IThunkCreator<TArgs, TResult, TState> : never;
};
export declare function createThunksBuilder<TState, TCFM extends IThunkCreatorMap<TH, TState>, TH>(thunks: TCFM): TCFM;
