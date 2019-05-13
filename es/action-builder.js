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
export function createActionBuilder(options) {
    var namespace = options.namespace, actions = options.actions, thunks = options.thunks;
    var actionCreators = Object.keys(actions).reduce(function (prev, actionName) {
        var _a;
        var payloadFactory = actions[actionName];
        return __assign({}, prev, (_a = {}, _a[actionName] = function (args) { return ({
            type: (namespace + "/" + actionName).toUpperCase(),
            meta: args,
            payload: payloadFactory(args)
        }); }, _a));
    }, {});
    var thunkCreators = Object.keys(thunks).reduce(function (prev, thunkName) {
        var _a;
        var thunkFactory = thunks[thunkName];
        return __assign({}, prev, (_a = {}, _a[thunkName] = function (args) { return thunkFactory(args); }, _a));
    }, {});
    return { namespace: namespace, actionCreators: actionCreators, thunkCreators: thunkCreators };
}
//# sourceMappingURL=action-builder.js.map