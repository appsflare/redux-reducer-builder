var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/**
 * Creates type-safe reducer for actions and effects creators using the respective handlers.
 * @param ac action creator builder result
 * @param handlers action and effect handlers
 * @param initialState the initial state to be used by the reducer
 */
export function buildReducer(ac, handlersFactory, initialState) {
    var actionHandlers = new Map();
    var actionHandlerFactories = Object.keys(ac.actionCreators).reduce(function (prev, key) {
        var _a;
        return (__assign({}, prev, (_a = {}, _a[key] = function (a) {
            var isActionHandler = a instanceof Function;
            if (isActionHandler) {
                actionHandlers.set((ac.namespace + "/" + key).toUpperCase(), a);
                return;
            }
            Object.keys(a).forEach(function (stateHandlerKey) {
                actionHandlers.set((ac.namespace + "/" + key + "-" + stateHandlerKey).toUpperCase(), a[stateHandlerKey]);
            });
        }, _a)));
    }, {});
    var effectHandlerFactories = Object.keys(ac.effectCreators).reduce(function (prev, key) {
        var _a;
        return (__assign({}, prev, (_a = {}, _a[key] = function (a) {
            actionHandlers.set((ac.namespace + "/" + key).toUpperCase(), a);
        }, _a)));
    }, {});
    handlersFactory({
        handlers: __assign({}, actionHandlerFactories, effectHandlerFactories)
    });
    return function (state, action) {
        var finalState = state || initialState;
        var handler = actionHandlers.get(action.type);
        return handler ? handler(finalState, action) : finalState;
    };
}
//# sourceMappingURL=builder.js.map