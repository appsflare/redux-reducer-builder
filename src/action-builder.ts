import { Action, AnyAction, Dispatch } from 'redux';

export interface ThunkDispatch<A extends Action = AnyAction> {
    <T extends A, TR = any>(action: T | IThunk<TR>): TR;
}

export interface IThunk<TResult, TContext = any> {
    (this: TContext, dispatch: ThunkDispatch, getState: Function, ...args: any[]): TResult;
}


export type IActionCreatorFactory<TArgs, TPayload = any> = (args?: TArgs) => TPayload;
export type IThunkCreatorFactory<TArgs, TResult, TContext = any> = (this: TContext, sargs?: TArgs) => IThunk<TResult>;

export type IActionCreatorsFactoryMap<T> = {
    [K in keyof T]: T[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ?
    IActionCreatorFactory<TArgs, TPayload> :
    never;
};

export type IThunkCreatorsFactoryMap<T, TContext = any> = {
    [K in keyof T]: T[K] extends IThunkCreatorFactory<infer TArgs, infer TResult> ?
    IThunkCreatorFactory<TArgs, TResult, TContext> : never;
};

export interface ModuleAction<TPayload, TMeta = any> extends Action<string> {
    payload: TPayload;
    meta?: TMeta;
}

export type IActionCreator<TArgs, TPayload, TMeta = any> = (args?: TArgs) => ModuleAction<TPayload, TMeta>;

export type ResultOf<TPayload> = TPayload extends Promise<infer TResult> ? Promise<TResult> : void;

export type IThunkCreator<TArgs, TResult = void, TContext = any> = (args?: TArgs) => IThunk<Promise<TResult>, TContext>;

export type IActionCreatorMap<TAFM extends IActionCreatorsFactoryMap<T>, T> = {
    [K in keyof TAFM]: TAFM[K] extends IActionCreatorFactory<infer TArgs, infer TPayload> ?
    IActionCreator<TArgs, TPayload, TArgs> : never;
};

export type IThunkCreatorMap<TAFM extends IThunkCreatorsFactoryMap<T, TContext>, T, TContext = any> = {
    [K in keyof TAFM]: TAFM[K] extends IThunkCreatorFactory<infer TArgs, infer TResult> ?
    IThunkCreator<TArgs, TResult, TContext> : never;
};

export interface IActionBuilderOptions<TActions, TThunks> {
    namespace: string;
    actions: IActionCreatorsFactoryMap<TActions>;
    thunks: IThunkCreatorsFactoryMap<TThunks>;
}

export interface IActionBuilderResult<TAFM extends IActionCreatorsFactoryMap<TActions>,
    TTFM extends IThunkCreatorsFactoryMap<TThunks>, TActions = {}, TThunks = {}> {
    namespace: string;
    actionCreators: IActionCreatorMap<TAFM, TActions>;
    thunkCreators: IThunkCreatorMap<TTFM, TThunks, this["actionCreators"]>;
}

export function createActionBuilder<TA, TH, TAB extends IActionBuilderOptions<TA, TH>>(options: TAB):
    IActionBuilderResult<TAB['actions'], TAB['thunks'], TA, TH> {

    const { namespace, actions, thunks } = options;

    const actionCreators = Object.keys(actions).reduce((prev: any, actionName: string) => {

        const payloadFactory = (actions as any)[actionName];
        return {
            ...prev,
            [actionName]: (args: any) => ({
                type: `${namespace}/${actionName}`.toUpperCase(),
                meta: args,
                payload: payloadFactory(args)
            })
        };
    }, {}) as any;

    const thunkCreators = Object.keys(thunks).reduce((prev: any, thunkName: string) => {

        const thunkFactory = (thunks as any)[thunkName];
        return {
            ...prev,
            [thunkName]: ((args: any) => thunkFactory(args)).bind(actionCreators)
        };
    }, {}) as any;

    return { namespace, actionCreators, thunkCreators };
}