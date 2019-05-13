import { createActionCreators } from './action-builder';
import { createThunkCreators } from './thunk-builder';
import { buildReducer } from './reducer-builder';
import { bindActionCreators, bindThunkCreator, bindThunkCreators } from './dispatchers';
var TaskActions = createActionCreators({
    namespace: 'CORE/TASKS',
    actions: {
        create: function (args) { return args; },
        createAsync: function (args) { return Promise.resolve(args); },
    }
});
TaskActions.actionCreators.create();
var TaskThunks = createThunkCreators({
    doCreate: function (args) { return function (dispatch, getState) { return Promise.resolve(args); }; },
    doUpdate: function (args) { return function (dispatch, getState) { }; },
});
TaskActions.actionCreators.create();
var reducer = buildReducer(TaskActions, function (o) {
    o.handlers.create(function (s, a) { return s; });
    o.handlers.createAsync({
        fulfilled: function (s, a) { return s; }
    });
}, { tasks: [] });
var a = bindActionCreators(TaskActions.actionCreators, (function () { }));
a.create();
var createAsync = bindThunkCreator(TaskThunks.doCreate, (function () { }));
createAsync();
var updateAsync = bindThunkCreator(TaskThunks.doUpdate, (function () { }));
updateAsync;
var thunks = bindThunkCreators(TaskThunks, (function () { }));
thunks.doUpdate();
//# sourceMappingURL=test.js.map