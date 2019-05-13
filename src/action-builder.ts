import { Action } from 'redux';
import { setNamespace } from './internal-helpers';

export type IActionCreatorFactory<TArgs, TPayload = any> = (args?: TArgs) => TPayload;

export type IActionCreatorFactoryMap<T> = {
    [K in keyof T]: T[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ?
    IActionCreatorFactory<TArgs, TPayload> :
    never;
};

export interface ModuleAction<TPayload, TMeta = any> extends Action<string> {
    payload: TPayload;
    meta?: TMeta;
}

export type IActionCreator<TArgs, TPayload, TMeta = any> = (args?: TArgs) => ModuleAction<TPayload, TMeta>;

export type ResultOf<TPayload> = TPayload extends Promise<infer TResult> ? Promise<TResult> : void;


export type IActionCreatorMap<TAFM extends IActionCreatorFactoryMap<T>, T> = {
    [K in keyof TAFM]: TAFM[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ?
    IActionCreator<TArgs, TPayload, TArgs> : never;
};

export interface IActionBuilderOptions<TActions> {
    namespace: string;
    actions: IActionCreatorFactoryMap<TActions>;
}

export interface IActionBuilderResult<TAFM extends IActionCreatorFactoryMap<TActions>, TActions = {}> {
    actionCreators: IActionCreatorMap<TAFM, TActions>;
}

export function createActionCreators<TA, TAB extends IActionBuilderOptions<TA>>(options: TAB):
    IActionBuilderResult<TAB["actions"], TA> {

    const { namespace, actions } = options;

    return Object.keys(actions).reduce((prev: any, actionName: string) => {

        const payloadFactory = (actions as any)[actionName];
        return {
            ...prev,
            [actionName]: (args: any) => ({
                type: `${namespace}/${actionName}`.toUpperCase(),
                meta: args,
                payload: payloadFactory(args)
            })
        };
    }, setNamespace({}, namespace));
}