"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var action_creators_1 = require("./action-creators");
var actions = {
    add: function (args) { return args; },
    remove: function (args) { return args; },
};
function createActionCreators(namespace, actions) {
    if (namespace === undefined || actions === undefined) {
        throw new Error('namespaces/actions cannot be undefined');
    }
    var actionKeys = Object.keys(actions);
    return actionKeys.reduce(function (prev, key) {
        var _a;
        return (__assign({}, prev, (_a = {}, _a[key] = action_creators_1.createActionCreator((namespace + "/" + key).toUpperCase(), actions[key]), _a)));
    }, {});
}
function createEffectCreators(namespace, effects) {
    if (namespace === undefined || effects === undefined) {
        throw new Error('namespaces/effects cannot be undefined');
    }
    var effectKeys = Object.keys(effects);
    return effectKeys.reduce(function (prev, key) {
        var _a;
        var payloadFactory = effects[key];
        return __assign({}, prev, (_a = {}, _a[key] = action_creators_1.createAsyncActionCreator((namespace + "/" + key).toUpperCase(), function (data) { return ({
            meta: data,
            payload: {
                promise: payloadFactory
            }
        }); }), _a));
    }, {});
}
;
function createActionCreatorBuilder(options) {
    var actionCreators = createActionCreators(options.namespace, options.actions);
    var effectCreators = createEffectCreators(options.namespace, options.effects);
    return {
        namespace: options.namespace,
        actionCreators: actionCreators,
        effectCreators: effectCreators
    };
}
exports.createActionCreatorBuilder = createActionCreatorBuilder;
function bindDispatcher(actionCreatorFactory, dispatch) {
    return function (args) { return dispatch(actionCreatorFactory.create(args)); };
}
exports.bindDispatcher = bindDispatcher;
function bindActionsToDispatcher(actionCreatorsFatory, dispatch) {
    return Object.keys(actionCreatorsFatory).reduce(function (prev, key) {
        var _a;
        return (__assign({}, prev, (_a = {}, _a[key] = bindDispatcher(actionCreatorsFatory[key], dispatch), _a)));
    });
}
exports.bindActionsToDispatcher = bindActionsToDispatcher;
function bindEffectsToDispatcher(effectCreatorsFatory, dispatch) {
    return Object.keys(effectCreatorsFatory).reduce(function (prev, key) {
        var _a;
        return (__assign({}, prev, (_a = {}, _a[key] = bindDispatcher(effectCreatorsFatory[key], dispatch), _a)));
    });
}
exports.bindEffectsToDispatcher = bindEffectsToDispatcher;
//# sourceMappingURL=action-builder.js.map