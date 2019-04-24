"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isAsyncAction(action) {
    var payload = action.payload;
    return (!!payload
        && !!payload.promise
        && (payload.promise.then instanceof Function
            || payload.promise instanceof Function));
}
exports.isAsyncAction = isAsyncAction;
function getPendingActionType(actionCreatorDef) {
    return actionCreatorDef.type + "_PENDING";
}
exports.getPendingActionType = getPendingActionType;
function getRejectedActionType(actionCreatorDef) {
    return actionCreatorDef.type + "_REJECTED";
}
exports.getRejectedActionType = getRejectedActionType;
function getFulFilledActionType(actionCreatorDef) {
    return actionCreatorDef.type + "_FULFILLED";
}
exports.getFulFilledActionType = getFulFilledActionType;
/**
 * Dispatches the action created by async action creator definition and returns the resultant promise
 * @param dispatch redux store dispatch method
 * @param actionCreator async action creator definition
 * @param data the payload needed for the action
 */
function dispatchAsync(dispatch, actionCreator, data) {
    var actionResult = dispatch(actionCreator.create(data));
    return actionResult.then(function (i) { return i.value; });
}
exports.dispatchAsync = dispatchAsync;
//# sourceMappingURL=helpers.js.map