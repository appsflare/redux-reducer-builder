import { IMetaAsyncActionCreator } from './types';

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

export function getResolvedActionType<TResult = any, TData = any, TMeta = any>(actionCreatorDef: IMetaAsyncActionCreator<TResult, TData, TMeta>) {
    return `${actionCreatorDef.type}_RESOLVED`;
}