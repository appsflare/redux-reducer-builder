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
var types_1 = require("./types");
/**
 * Creates an type safe action creator
 * @param type type of the action
 * @param payloadFactory a factory method to create payload for the action
 */
function createActionCreator(type, payloadFactory) {
    return {
        type: type,
        create: function (data) { return types_1.createPayloadAction(type)(payloadFactory(data)); }
    };
}
exports.createActionCreator = createActionCreator;
/**
* Creates an type safe asynchronous action creator
* @param type type of the action
* @param payloadFactory a factory method to create payload for the action
*/
function createAsyncActionCreator(type, payloadFactory) {
    return {
        type: type,
        create: function (data) {
            var actionPart = payloadFactory(data);
            return __assign({}, types_1.createPayloadAction(type)(actionPart.payload), { meta: actionPart.meta });
        }
    };
}
exports.createAsyncActionCreator = createAsyncActionCreator;
//# sourceMappingURL=action-creators.js.map