"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var action_builder_1 = require("./action-builder");
var thunk_builder_1 = require("./thunk-builder");
var reducer_builder_1 = require("./reducer-builder");
var dispatchers_1 = require("./dispatchers");
var TaskActions = action_builder_1.createActionCreators({
    namespace: 'CORE/TASKS',
    actions: {
        create: function (args) { return args; },
        createAsync: function (args) { return Promise.resolve(args); },
    }
});
TaskActions.actionCreators.create();
var TaskThunks = thunk_builder_1.createThunkCreators({
    doCreate: function (args) { return function (dispatch, getState) { return Promise.resolve(args); }; },
    doUpdate: function (args) { return function (dispatch, getState) { }; },
});
TaskActions.actionCreators.create();
var reducer = reducer_builder_1.buildReducer(TaskActions, function (o) {
    o.handlers.create(function (s, a) { return s; });
    o.handlers.createAsync({
        fulfilled: function (s, a) { return s; }
    });
}, { tasks: [] });
var a = dispatchers_1.bindActionCreators(TaskActions.actionCreators, (function () { }));
a.create();
var createAsync = dispatchers_1.bindThunkCreator(TaskThunks.doCreate, (function () { }));
createAsync();
var updateAsync = dispatchers_1.bindThunkCreator(TaskThunks.doUpdate, (function () { }));
updateAsync;
var thunks = dispatchers_1.bindThunkCreators(TaskThunks, (function () { }));
thunks.doUpdate();
//# sourceMappingURL=test.js.map