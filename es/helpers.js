export function isAsyncAction(action) {
    var payload = action.payload;
    return (!!payload
        && !!payload.promise
        && (payload.promise.then instanceof Function
            || payload.promise instanceof Function));
}
export function getPendingActionType(actionCreatorDef) {
    return actionCreatorDef.type + "_PENDING";
}
export function getRejectedActionType(actionCreatorDef) {
    return actionCreatorDef.type + "_REJECTED";
}
export function getFulFilledActionType(actionCreatorDef) {
    return actionCreatorDef.type + "_FULFILLED";
}
/**
 * Dispatches the action created by async action creator definition and returns the resultant promise
 * @param dispatch redux store dispatch method
 * @param actionCreator async action creator definition
 * @param data the payload needed for the action
 */
export function dispatchAsync(dispatch, actionCreator, data) {
    var actionResult = dispatch(actionCreator.create(data));
    return actionResult.then(function (i) { return i.value; });
}
/**
   * Produces a new object from the given object by prepending a value before every property name
   * @param {Object} obj any object
   * @param {String} key value to prepend every property of the given object
   */
export function prependKeys(obj, key) {
    if (key === void 0) { key = ''; }
    return Object.keys(obj).reduce(function (prev, curr) {
        prev["" + key + curr] = obj[curr];
        return prev;
    }, {});
}
//# sourceMappingURL=helpers.js.map