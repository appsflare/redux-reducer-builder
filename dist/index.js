"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_typescript_1 = require("react-redux-typescript");
/**
 * Creates an type safe action creator
 * @param type type of the action
 * @param payloadFactory a factory method to create payload for the action
 */
function createActionCreator(type, payloadFactory) {
    return {
        type: type,
        create: function (data) { return react_redux_typescript_1.createPayloadAction(type)(payloadFactory(data)); }
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
            return __assign({}, react_redux_typescript_1.createPayloadAction(type)(actionPart.payload), { meta: actionPart.meta });
        }
    };
}
exports.createAsyncActionCreator = createAsyncActionCreator;
/**
 * Create a new instance of reduce builder
 * @type TSTate defines type of state
*/
function createReducerBuilder() {
    var actionHandlers = new Map();
    return {
        /**
         * registers a function as handler to run as reducer method once an action mathcing given action creator is dispatched
         * @param actionCreator the action creator definition
         * @param handler the handler that would be called when the action is dispatched
         */
        handleAction: function (actionCreator, handler) {
            actionHandlers.set(actionCreator.type, handler);
            return this;
        },
        /**
         * registers a function as handler to run as a reducer method once one of the actions matching given action creators is dispatched
         * @param actionCreators array of action creator definitions
         * @param handler the handler that would be called when the action matching given action creator's definition is dispatched
         */
        handleActions: function (actionCreators, handler) {
            var _this = this;
            actionCreators.forEach(function (a) { return _this.handleAction(a, handler); });
            return this;
        },
        /**
         * Registers async action handlers of the given async action creator definition.
         * @param actionCreator an async action creator definition
         * @param stateHandlers state handlers to handler three states of an asynchronous action namely pending, fulfilled and rejected
         */
        handleAsyncAction: function (actionCreator, stateHandlers) {
            if (stateHandlers.pending) {
                actionHandlers.set(actionCreator.type + "_PENDING", stateHandlers.pending);
            }
            if (stateHandlers.fulfilled) {
                actionHandlers.set(actionCreator.type + "_FULFILLED", stateHandlers.fulfilled);
            }
            if (stateHandlers.rejected) {
                actionHandlers.set(actionCreator.type + "_REJECTED", stateHandlers.rejected);
            }
            return this;
        },
        /**
         * Registers async action handlers of the given async action creator definitions.
         * @param actionCreators an array of async action creator definitions
         * @param stateHandlers state handlers to handler three states of an asynchronous action namely pending, fulfilled and rejected
         */
        handleAsyncActions: function (actionCreators, stateHandlers) {
            var _this = this;
            actionCreators.forEach(function (a) { return _this.handleAsyncAction(a, stateHandlers); });
            return this;
        },
        /**
         * Composes a reducer method with registered action handlers
         * @param initialState the initial state of the reducer. This is useful when redux dispatches @init action to initialize with default state
         */
        build: function (initialState) {
            return function (state, action) {
                var finalState = state || initialState;
                var handler = actionHandlers.get(action.type);
                return handler ? handler(finalState, action) : finalState;
            };
        }
    };
}
exports.createReducerBuilder = createReducerBuilder;
//# sourceMappingURL=index.js.map