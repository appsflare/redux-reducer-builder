import { IActionCreatorFactory, IAsyncPayload, IMetaAsyncActionCreatorFactory } from './types';
/**
 * Creates an type safe action creator
 * @param type type of the action
 * @param payloadFactory a factory method to create payload for the action
 */
export declare function createActionCreator<TPayload, TData>(type: string, payloadFactory: (data?: TData) => TPayload): IActionCreatorFactory<TPayload, TData>;
export declare type IActionCreatorType = typeof createActionCreator;
/**
* Creates an type safe asynchronous action creator
* @param type type of the action
* @param payloadFactory a factory method to create payload for the action
*/
export declare function createAsyncActionCreator<TResult, TData = any, TMeta = any>(type: string, payloadFactory: (data?: TData) => {
    meta?: TMeta;
    payload: IAsyncPayload<TResult>;
}): IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>;
