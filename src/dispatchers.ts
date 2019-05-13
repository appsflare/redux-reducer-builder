import { IActionCreator, ResultOf, IActionCreatorsFactoryMap, IActionCreatorMap, IThunkCreator, IThunkCreatorsFactoryMap, IThunkCreatorMap } from './action-builder';
import * as Redux from 'redux';

export function bindActionCreator<TArgs, TPayload, TMeta = any>(
    actionCreator: IActionCreator<TArgs, TPayload, TMeta> | IThunkCreator<TArgs, TPayload>, dispatch: Redux.Dispatch): (args?: TArgs) => ResultOf<TPayload> {
    return Redux.bindActionCreators(actionCreator, dispatch) as any
}

export type BindDispatcherType<TArgs, TPayload, TMeta = any> = typeof bindActionCreators;

export type IBoundActionCreatorsMap<TACM extends IActionCreatorMap<TAFM, T>, TAFM extends IActionCreatorsFactoryMap<T>, T> = {
    [K in keyof TACM]: TACM[K] extends IActionCreator<infer TA, infer TP, infer TM> ? (args?: TA) => ResultOf<TP> : never;
}

export type IBoundThunkCreatorsMap<TTCM extends IThunkCreatorMap<TTFM, T>, TTFM extends IThunkCreatorsFactoryMap<T>, T> = {
    [K in keyof TTCM]: TTCM[K] extends IThunkCreator<infer TA, infer TR> ? (args?: TA) => ResultOf<TR> : never;
}

export function bindActionCreators<TAFM extends IActionCreatorsFactoryMap<T>, TACM extends IActionCreatorMap<TAFM, T>, T>(
    actionCreators: TACM, dispatch: Redux.Dispatch): IBoundActionCreatorsMap<TACM, TAFM, T> {

    return Redux.bindActionCreators(actionCreators, dispatch) as any;

}

export function bindThunkCreators<TTFM extends IThunkCreatorsFactoryMap<T>, TFCM extends IThunkCreatorMap<TTFM, T>, T>(
    actionCreators: TFCM, dispatch: Redux.Dispatch): IBoundThunkCreatorsMap<TFCM, TTFM, T> {

    return Redux.bindActionCreators(actionCreators, dispatch) as any;

}