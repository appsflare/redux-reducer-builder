import { IMetaAsyncActionCreator, IAsyncResultPayload } from './types';
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

export function getPendingActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreator<TResult, TData, TMeta>) {
    return `${actionCreatorDef.type}_PENDING`;
}

export function getRejectedActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreator<TResult, TData, TMeta>) {
    return `${actionCreatorDef.type}_REJECTED`;
}

export function getFulFilledActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreator<TResult, TData, TMeta>) {
    return `${actionCreatorDef.type}_FULFILLED`;
}

/**
 * Dispatches the action created by async action creator definition and returns the resultant promise
 * @param dispatch redux store dispatch method
 * @param actionCreator async action creator definition
 * @param data the payload needed for the action
 */
export function dispatchAsync<TResult, TData, TMeta>(dispatch: Dispatch<any>,
    actionCreator: IMetaAsyncActionCreator<TResult, TData, TMeta>,
    data?: TData) {
    const actionResult = dispatch(actionCreator.create(data)) as any;
    return actionResult.then((i: any) => i.value) as Promise<IAsyncResultPayload<TResult>>;
}