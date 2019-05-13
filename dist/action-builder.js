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
var internal_helpers_1 = require("./internal-helpers");
function createActionCreators(options) {
    var namespace = options.namespace, actions = options.actions;
    return Object.keys(actions).reduce(function (prev, actionName) {
        var _a;
        var payloadFactory = actions[actionName];
        return __assign({}, prev, (_a = {}, _a[actionName] = function (args) { return ({
            type: (namespace + "/" + actionName).toUpperCase(),
            meta: args,
            payload: payloadFactory(args)
        }); }, _a));
    }, internal_helpers_1.setNamespace({}, namespace));
}
exports.createActionCreators = createActionCreators;
//# sourceMappingURL=action-builder.js.map