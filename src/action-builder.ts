import { createActionCreator, createAsyncActionCreator } from './action-creators';
import { IActionCreatorFactory, IMetaAsyncActionCreatorFactory, IAsyncPayload } from './types';
import { ReplaceReturnType } from './helpers';
import { Dispatch, Action } from 'redux';
// import { ReplaceReturnType } from './helpers';

export type IActionPayloadCreator<TData, TPayload> = (data?: TData) => TPayload | undefined;


export interface IAsyncActionPayloadCreator<TResult, TData = any, TMeta = any> {

    (data?: TData): {
        meta?: TMeta;
        payload: IAsyncPayload<TResult>;
    };

}

export type IActionCreatorsMap<ACM> = {
    [K in keyof ACM]: ACM[K] extends IActionPayloadCreator<infer TData, infer TPayload> ?
    IActionPayloadCreator<TData, TPayload> : ACM[K];
};

export type IEffectCreatorsMap<ECM> = {
    [K in keyof ECM]: ECM[K] extends IAsyncActionPayloadCreator<infer TResult, infer TData, infer TMeta> ?
    IAsyncActionPayloadCreator<TResult, TData, TMeta> : ECM[K];
}


interface IActionsCreatorBuilderOptions<TActions, TEffects> {
    namespace: string;
    actions: IActionCreatorsMap<TActions>;
    effects: IEffectCreatorsMap<TEffects>;
}


export type IActionCreators<T, TActions = IActionCreatorsMap<T>> = {
    [K in keyof TActions]: TActions[K] extends IActionPayloadCreator<infer TData, infer TPayload> ?
    IActionCreatorFactory<TPayload, TData> : IActionCreatorFactory<any, any>;
};


const actions = {
    add: (args: { name: string }) => args,
    remove: (args: { id: string }) => args,
};

type TypeOfActions = typeof actions;


function createActionCreators<TAPF>(namespace: string, actions: IActionCreatorsMap<TAPF>): IActionCreators<TAPF> {
    if (namespace === undefined || actions === undefined) {
        throw new Error('namespaces/actions cannot be undefined');
    }

    const actionKeys = Object.keys(actions);

    return actionKeys.reduce((prev: any, key: string) => ({
        ...prev,
        [key]: createActionCreator(`${namespace}/${key}`.toUpperCase(), (actions as any)[key])

    }), {});
}


export type IEffectCreators<T, TEffects = IEffectCreatorsMap<T>> = {
    [K in keyof TEffects]: TEffects[K] extends IAsyncActionPayloadCreator<infer TResult, infer TData, infer TMeta> ?
    IMetaAsyncActionCreatorFactory<TResult, TData, TMeta> : IMetaAsyncActionCreatorFactory<any, any, any>;
};



function createEffectCreators<TEffects>(namespace: string, effects: IEffectCreatorsMap<TEffects>): IEffectCreators<TEffects> {
    if (namespace === undefined || effects === undefined) {
        throw new Error('namespaces/effects cannot be undefined');
    }

    const effectKeys = Object.keys(effects);

    return effectKeys.reduce((prev: any, key: string) => {

        const payloadFactory = (effects as any)[key];
        return {
            ...prev,
            [key]: createAsyncActionCreator(`${namespace}/${key}`.toUpperCase(), (data?: any) => ({
                meta: data,
                payload: {
                    promise: payloadFactory()
                }
            }) as any)
        };

    }, {});
};

export interface IActionCreatorBuilderResult<TActions, TEffects> {
    namespace: string;
    actionCreators: IActionCreators<TActions>;
    effectCreators: IEffectCreators<TEffects>;
}

export function createActionCreatorBuilder<TActions, TEffects>
    (options: IActionsCreatorBuilderOptions<TActions, TEffects>): IActionCreatorBuilderResult<TActions, TEffects> {


    const actionCreators = createActionCreators(options.namespace, options.actions);
    const effectCreators = createEffectCreators(options.namespace, options.effects);

    return {
        namespace: options.namespace,
        actionCreators,
        effectCreators
    };

}


export type ActionCreators<A extends IActionCreators<T>, T = {}> = {
    [K in keyof A]: ReplaceReturnType<A[K]["create"], void>;
};
export type EffectCreators<E extends IEffectCreators<T>, T = {}> = {
    [K in keyof E]: ReplaceReturnType<E[K]["create"], ReturnType<E[K]["create"]>["payload"]>;
};

export type AllActionCreators<A extends IActionCreatorBuilderResult<T1, T2>, T1 = {}, T2 = {}> = ActionCreators<A["actionCreators"]> & EffectCreators<A["effectCreators"]>;



export function bindDispatcher<TPayload, TData = any>(actionCreatorFactory: IActionCreatorFactory<TPayload, TData>,
    dispatch: Dispatch): ReplaceReturnType<IActionCreatorFactory<TPayload, TData>["create"], void> {
    return (args: any) => dispatch(actionCreatorFactory.create(args));
}

export function bindEffectDispatcher<TResult, TData = any, TMeta = any>(
    actionCreatorFactory: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>,
    dispatch: Dispatch): ReplaceReturnType<IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>["create"], void> {
    return (args: any) => dispatch(actionCreatorFactory.create(args));
}

export function bindActionsToDispatcher<TActions>(actionCreatorsFatory: IActionCreators<TActions>,
    dispatch: Dispatch): ActionCreators<IActionCreators<TActions>> {

    return Object.keys(actionCreatorsFatory).reduce((prev: any, key: string) => ({
        ...prev,
        [key]: bindDispatcher((actionCreatorsFatory as any)[key], dispatch)
    })) as any;
}

export function bindEffectsToDispatcher<TEffects>(effectCreatorsFatory: IEffectCreators<TEffects>,
    dispatch: Dispatch): EffectCreators<IEffectCreators<TEffects>> {

    return Object.keys(effectCreatorsFatory).reduce((prev: any, key: string) => ({
        ...prev,
        [key]: bindEffectDispatcher((effectCreatorsFatory as any)[key], dispatch)
    })) as any;

}