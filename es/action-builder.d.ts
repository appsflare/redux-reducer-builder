import { Action } from 'redux';
export declare type IActionCreatorFactory<TArgs, TPayload = any> = (args?: TArgs) => TPayload;
export declare type IActionCreatorsFactoryMap<T> = {
    [K in keyof T]: T[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ? IActionCreatorFactory<TArgs, TPayload> : never;
};
export interface ModuleAction<TPayload, TMeta = any> extends Action<string> {
    payload: TPayload;
    meta?: TMeta;
}
export declare type IActionCreator<TArgs, TPayload, TMeta = any> = (args?: TArgs) => ModuleAction<TPayload, TMeta>;
export declare type ResultOf<TPayload> = TPayload extends Promise<infer TResult> ? Promise<TResult> : void;
export declare type IActionCreatorMap<TAFM extends IActionCreatorsFactoryMap<T>, T> = {
    [K in keyof TAFM]: TAFM[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ? IActionCreator<TArgs, TPayload, TArgs> : never;
};
export interface IActionBuilderOptions<TActions> {
    namespace: string;
    actions: IActionCreatorsFactoryMap<TActions>;
}
export interface IActionBuilderResult<TAFM extends IActionCreatorsFactoryMap<TActions>, TActions = {}> {
    actionCreators: IActionCreatorMap<TAFM, TActions>;
}
export declare function createActionsBuilder<TA, TAB extends IActionBuilderOptions<TA>>(options: TAB): IActionBuilderResult<TAB["actions"], TA>;
