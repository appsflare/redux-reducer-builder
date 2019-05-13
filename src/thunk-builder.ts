import { Action, AnyAction } from 'redux';

export interface ThunkDispatch<A extends Action = AnyAction> {
    <T extends A, TR = any>(action: T | IThunk<TR>): TR;
}

export type IThunk<TResult, TState = any> = (dispatch: ThunkDispatch,
    getState: () => TState, ...args: any[]) => TResult;


export type IThunkCreator<TArgs, TResult = void, TState = any> = (args?: TArgs) => IThunk<TResult, TState>;


export type IThunkCreatorMap<T, TState = any> = {
    [K in keyof T]: T[K] extends IThunkCreator<infer TArgs, infer TResult> ?
    IThunkCreator<TArgs, TResult, TState> : never;
};

export type IThunkCreators<TCFM extends IThunkCreatorMap<T, TState>, T, TState = any> = {
    [K in keyof TCFM]: TCFM[K] extends IThunkCreator<infer TArgs, infer TResult> ?
    IThunkCreator<TArgs, TResult, TState> : never;
};

export function createThunkCreators<TState, TCFM extends IThunkCreatorMap<TH, TState>, TH>(thunks: TCFM): TCFM {
    return thunks as any;
}