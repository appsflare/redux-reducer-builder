import { Action, AnyAction } from 'redux';
export interface ThunkDispatch<A extends Action = AnyAction> {
    <T extends A, TR = any>(action: T | IThunk<TR>): TR;
}
export interface IThunk<TResult> {
    (dispatch: ThunkDispatch, getState: Function, ...args: any[]): TResult;
}
export declare type IActionCreatorFactoryComposite<TArgs, TPayload = any, TResult = any> = (args?: TArgs) => TPayload | IThunk<TResult>;
export declare type IActionCreatorFactory<TArgs, TPayload = any> = (args?: TArgs) => TPayload;
export declare type IThunkCreatorFactory<TArgs, TResult> = (args?: TArgs) => IThunk<TResult>;
export declare type IActionCreatorsFactoryMap<T> = {
    [K in keyof T]: T[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ? IActionCreatorFactory<TArgs, TPayload> : never;
};
export declare type IThunkCreatorsFactoryMap<T> = {
    [K in keyof T]: T[K] extends IThunkCreatorFactory<infer TArgs, infer TResult> ? IThunkCreatorFactory<TArgs, TResult> : never;
};
export interface ModuleAction<TPayload, TMeta = any> extends Action<string> {
    payload: TPayload;
    meta?: TMeta;
}
export declare type IActionCreator<TArgs, TPayload, TMeta = any> = (args?: TArgs) => ModuleAction<TPayload, TMeta>;
export declare type ResultOf<TPayload> = TPayload extends Promise<infer TResult> ? Promise<TResult> : void;
export declare type IThunkCreator<TArgs, TResult = void> = (args?: TArgs) => IThunk<Promise<TResult>>;
export declare type IActionCreatorMap<TAFM extends IActionCreatorsFactoryMap<T>, T> = {
    [K in keyof TAFM]: TAFM[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ? IActionCreator<TArgs, TPayload, TArgs> : never;
};
export declare type IThunkCreatorMap<TAFM extends IThunkCreatorsFactoryMap<T>, T> = {
    [K in keyof TAFM]: TAFM[K] extends IThunkCreatorFactory<infer TArgs, infer TResult> ? IThunkCreator<TArgs, TResult> : never;
};
export interface IActionBuilderOptions<TActions, TThunks> {
    namespace: string;
    actions: IActionCreatorsFactoryMap<TActions>;
    thunks: IThunkCreatorsFactoryMap<TThunks>;
}
export interface IActionBuilderResult<TAFM extends IActionCreatorsFactoryMap<TActions>, TTFM extends IThunkCreatorsFactoryMap<TThunks>, TActions = {}, TThunks = {}> {
    namespace: string;
    actionCreators: IActionCreatorMap<TAFM, TActions>;
    thunkCreators: IThunkCreatorMap<TTFM, TThunks>;
}
export declare function createActionBuilder<TA, TH, TAB extends IActionBuilderOptions<TA, TH>>(options: TAB): IActionBuilderResult<TAB['actions'], TAB['thunks'], TA, TH>;
