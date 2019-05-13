import { Action } from 'redux';
export declare type IActionCreatorFactory<TArgs, TPayload = any> = (args?: TArgs) => TPayload;
export declare type IActionCreatorFactoryMap<T> = {
    [K in keyof T]: T[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ? IActionCreatorFactory<TArgs, TPayload> : never;
};
export interface ModuleAction<TPayload, TMeta = any> extends Action<string> {
    payload: TPayload;
    meta?: TMeta;
}
export declare type IActionCreator<TArgs, TPayload, TMeta = any> = (args?: TArgs) => ModuleAction<TPayload, TMeta>;
export declare type ResultOf<TPayload> = TPayload extends Promise<infer TResult> ? Promise<TResult> : void;
export declare type IActionCreatorMap<TAFM extends IActionCreatorFactoryMap<T>, T> = {
    [K in keyof TAFM]: TAFM[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ? IActionCreator<TArgs, TPayload, TArgs> : never;
};
export interface IActionBuilderOptions<TActions> {
    namespace: string;
    actions: IActionCreatorFactoryMap<TActions>;
}
export interface IActionBuilderResult<TAFM extends IActionCreatorFactoryMap<TActions>, TActions = {}> {
    actionCreators: IActionCreatorMap<TAFM, TActions>;
}
export declare function createActionCreators<TA, TAB extends IActionBuilderOptions<TA>>(options: TAB): IActionBuilderResult<TAB["actions"], TA>;
