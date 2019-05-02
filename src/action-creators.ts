import { IActionCreatorFactory, createPayloadAction, IAsyncPayload, IMetaAsyncActionCreatorFactory } from './types';



/**
 * Creates an type safe action creator
 * @param type type of the action
 * @param payloadFactory a factory method to create payload for the action
 */
export function createActionCreator<TPayload, TData>(type: string, payloadFactory: (data?: TData) => TPayload): IActionCreatorFactory<TPayload, TData> {
    return {
        type,
        create: (data?: TData) => createPayloadAction<string, TPayload>(type)(payloadFactory(data))
    };
}

export type IActionCreatorType = typeof createActionCreator;

/**
* Creates an type safe asynchronous action creator
* @param type type of the action
* @param payloadFactory a factory method to create payload for the action
*/
export function createAsyncActionCreator<TResult, TData = any, TMeta = any>(type: string, payloadFactory: (data?: TData) => {
    meta?: TMeta;
    payload: IAsyncPayload<TResult>;
}): IMetaAsyncActionCreatorFactory<TResult, TData, TMeta> {
    return {
        type,
        create(data?: TData) {
            const actionPart = payloadFactory(data);
            return {
                ...createPayloadAction<string, IAsyncPayload<TResult>>(type)(actionPart.payload),
                meta: actionPart.meta as TMeta
            };
        }
    };
}



