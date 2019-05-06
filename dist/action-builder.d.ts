import { IActionCreatorFactory, IMetaAsyncActionCreatorFactory, IAsyncPayload } from './types';
import { ReplaceReturnType } from './helpers';
import { Dispatch } from 'redux';
export declare type IActionPayloadCreator<TData, TPayload> = (data?: TData) => TPayload | undefined;
export interface IAsyncActionPayloadCreator<TResult, TData = any, TMeta = any> {
    (data?: TData): {
        meta?: TMeta;
        payload: IAsyncPayload<TResult>;
    };
}
export declare type IActionCreatorsMap<ACM> = {
    [K in keyof ACM]: ACM[K] extends IActionPayloadCreator<infer TData, infer TPayload> ? IActionPayloadCreator<TData, TPayload> : ACM[K];
};
export declare type IEffectCreatorsMap<ECM> = {
    [K in keyof ECM]: ECM[K] extends IAsyncActionPayloadCreator<infer TResult, infer TData, infer TMeta> ? IAsyncActionPayloadCreator<TResult, TData, TMeta> : ECM[K];
};
interface IActionsCreatorBuilderOptions<TActions, TEffects> {
    namespace: string;
    actions: IActionCreatorsMap<TActions>;
    effects: IEffectCreatorsMap<TEffects>;
}
export declare type IActionCreators<T, TActions = IActionCreatorsMap<T>> = {
    [K in keyof TActions]: TActions[K] extends IActionPayloadCreator<infer TData, infer TPayload> ? IActionCreatorFactory<TPayload, TData> : IActionCreatorFactory<any, any>;
};
export declare type IEffectCreators<T, TEffects = IEffectCreatorsMap<T>> = {
    [K in keyof TEffects]: TEffects[K] extends IAsyncActionPayloadCreator<infer TResult, infer TData, infer TMeta> ? IMetaAsyncActionCreatorFactory<TResult, TData, TMeta> : IMetaAsyncActionCreatorFactory<any, any, any>;
};
export interface IActionCreatorBuilderResult<TActions, TEffects> {
    namespace: string;
    actionCreators: IActionCreators<TActions>;
    effectCreators: IEffectCreators<TEffects>;
}
export declare function createActionCreatorBuilder<TActions, TEffects>(options: IActionsCreatorBuilderOptions<TActions, TEffects>): IActionCreatorBuilderResult<TActions, TEffects>;
export declare type ActionCreators<A extends IActionCreators<T>, T = {}> = {
    [K in keyof A]: ReplaceReturnType<A[K]["create"], void>;
};
export declare type EffectCreators<E extends IEffectCreators<T>, T = {}> = {
    [K in keyof E]: ReplaceReturnType<E[K]["create"], ReturnType<E[K]["create"]>["payload"]>;
};
export declare type AllActionCreators<A extends IActionCreatorBuilderResult<T1, T2>, T1 = {}, T2 = {}> = ActionCreators<A["actionCreators"]> & EffectCreators<A["effectCreators"]>;
export declare function bindDispatcher<TPayload, TData = any>(actionCreatorFactory: IActionCreatorFactory<TPayload, TData>, dispatch: Dispatch): ReplaceReturnType<IActionCreatorFactory<TPayload, TData>["create"], void>;
export declare function bindActionsToDispatcher<TActions>(actionCreatorsFatory: IActionCreators<TActions>, dispatch: Dispatch): ActionCreators<IActionCreators<TActions>>;
export declare function bindEffectsToDispatcher<TActions>(effectCreatorsFatory: IEffectCreators<TActions>, dispatch: Dispatch): EffectCreators<IActionCreators<TActions>>;
export {};
