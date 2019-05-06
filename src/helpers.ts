import { IMetaAsyncActionCreatorFactory, IAsyncResultPayload } from './types';
import { Dispatch } from 'redux';

export function isAsyncAction(action: any) {
    const { payload } = action;
    return (!!payload
        && !!payload.promise
        && (
            payload.promise.then instanceof Function
            || payload.promise instanceof Function)
    );
}

export function getPendingActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>) {
    return `${actionCreatorDef.type}_PENDING`;
}

export function getRejectedActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>) {
    return `${actionCreatorDef.type}_REJECTED`;
}

export function getFulFilledActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>) {
    return `${actionCreatorDef.type}_FULFILLED`;
}

/**
 * Dispatches the action created by async action creator definition and returns the resultant promise
 * @param dispatch redux store dispatch method
 * @param actionCreator async action creator definition
 * @param data the payload needed for the action
 */
export function dispatchAsync<TResult, TData, TMeta>(dispatch: Dispatch<any>,
    actionCreator: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>,
    data?: TData) {
    const actionResult = dispatch(actionCreator.create(data)) as any;
    return actionResult.then((i: any) => i.value) as Promise<IAsyncResultPayload<TResult>>;
}

/**
   * Produces a new object from the given object by prepending a value before every property name
   * @param {Object} obj any object
   * @param {String} key value to prepend every property of the given object
   */
export function prependKeys<O extends Object>(obj: O, key = '') {
    return Object.keys(obj).reduce((prev: any, curr) => {
        prev[`${key}${curr}`] = (obj as any)[curr];
        return prev;
    }, {}) as O;
}

export type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U : never;
export type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;

export type Nullable<T> = { [K in keyof T]+?: T[K]; };