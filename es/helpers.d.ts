import { IMetaAsyncActionCreator, IAsyncResultPayload } from './types';
import { Dispatch } from 'redux';
export declare function isAsyncAction(action: any): boolean;
export declare function getPendingActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreator<TResult, TData, TMeta>): string;
export declare function getRejectedActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreator<TResult, TData, TMeta>): string;
export declare function getFulFilledActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreator<TResult, TData, TMeta>): string;
/**
 * Dispatches the action created by async action creator definition and returns the resultant promise
 * @param dispatch redux store dispatch method
 * @param actionCreator async action creator definition
 * @param data the payload needed for the action
 */
export declare function dispatchAsync<TResult, TData, TMeta>(dispatch: Dispatch<any>, actionCreator: IMetaAsyncActionCreator<TResult, TData, TMeta>, data?: TData): Promise<IAsyncResultPayload<TResult>>;
