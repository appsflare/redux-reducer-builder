import { IMetaAsyncActionCreatorFactory, IAsyncResultPayload } from './types';
import { Dispatch } from 'redux';
export declare function isAsyncAction(action: any): boolean;
export declare function getPendingActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>): string;
export declare function getRejectedActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>): string;
export declare function getFulFilledActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>): string;
/**
 * Dispatches the action created by async action creator definition and returns the resultant promise
 * @param dispatch redux store dispatch method
 * @param actionCreator async action creator definition
 * @param data the payload needed for the action
 */
export declare function dispatchAsync<TResult, TData, TMeta>(dispatch: Dispatch<any>, actionCreator: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>, data?: TData): Promise<IAsyncResultPayload<TResult>>;
/**
   * Produces a new object from the given object by prepending a value before every property name
   * @param {Object} obj any object
   * @param {String} key value to prepend every property of the given object
   */
export declare function prependKeys<O extends Object>(obj: O, key?: string): O;
export declare type ArgumentTypes<T> = T extends (...args: infer U) => infer R ? U : never;
export declare type ReplaceReturnType<T, TNewReturn> = (...a: ArgumentTypes<T>) => TNewReturn;
export declare type Nullable<T> = {
    [K in keyof T]+?: T[K];
};
