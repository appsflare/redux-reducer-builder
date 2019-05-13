import { IActionCreator, ResultOf, IActionCreatorFactoryMap, IActionCreatorMap } from './action-builder';
import { IThunkCreator, IThunkCreatorMap } from './thunk-builder';
import * as Redux from 'redux';
export declare function bindActionCreator<TArgs, TPayload, TMeta = any>(actionCreator: IActionCreator<TArgs, TPayload, TMeta> | IThunkCreator<TArgs, TPayload>, dispatch: Redux.Dispatch): (args?: TArgs) => ResultOf<TPayload>;
export declare function bindThunkCreator<TArgs, TResult>(thunkCreator: IThunkCreator<TArgs, TResult>, dispatch: Redux.Dispatch): (args?: TArgs) => ResultOf<TResult>;
export declare type BindDispatcherType<TArgs, TPayload, TMeta = any> = typeof bindActionCreators;
export declare type IBoundActionCreatorMap<TACM extends IActionCreatorMap<TAFM, T>, TAFM extends IActionCreatorFactoryMap<T>, T> = {
    [K in keyof TACM]: TACM[K] extends IActionCreator<infer TA, infer TP, infer TM> ? (args?: TA) => ResultOf<TP> : never;
};
export declare type IBoundThunkCreatorMap<TTCM extends IThunkCreatorMap<TTFM, T>, TTFM extends IThunkCreatorMap<T>, T> = {
    [K in keyof TTCM]: TTCM[K] extends IThunkCreator<infer TA, infer TR> ? (args?: TA) => ResultOf<TR> : never;
};
export declare function bindActionCreators<TAFM extends IActionCreatorFactoryMap<T>, TACM extends IActionCreatorMap<TAFM, T>, T>(actionCreators: TACM, dispatch: Redux.Dispatch): IBoundActionCreatorMap<TACM, TAFM, T>;
export declare function bindThunkCreators<TTFM extends IThunkCreatorMap<T>, TFCM extends IThunkCreatorMap<TTFM, T>, T>(actionCreators: TFCM, dispatch: Redux.Dispatch): IBoundThunkCreatorMap<TFCM, TTFM, T>;
