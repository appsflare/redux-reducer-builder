import { createActionCreators } from './action-builder';
import { createThunkCreators } from './thunk-builder';
import { buildReducer } from './reducer-builder';
import { bindActionCreators, bindActionCreator, bindThunkCreator, bindThunkCreators } from './dispatchers';


const TaskActions = createActionCreators({
    namespace: 'CORE/TASKS',
    actions: {
        create: (args?: { name: string }) => args,
        createAsync: (args?: { name: string }) => Promise.resolve(args),
    }
});

TaskActions.actionCreators.create()

const TaskThunks = createThunkCreators({
    doCreate: (args?: { name: string }) => (dispatch, getState) => Promise.resolve(args!),
    doUpdate: (args?: { name: string }) => (dispatch, getState) => { },
});

TaskActions.actionCreators.create();

const reducer = buildReducer(TaskActions, o => {
    o.handlers.create((s, a) => s);
    o.handlers.createAsync({
        fulfilled: (s, a) => s
    });
}, { tasks: [] });



const a = bindActionCreators(TaskActions.actionCreators, (() => { }) as any);
a.create()

const createAsync = bindThunkCreator(TaskThunks.doCreate, (() => { }) as any);
createAsync()

const updateAsync = bindThunkCreator(TaskThunks.doUpdate, (() => { }) as any);
updateAsync;

const thunks = bindThunkCreators(TaskThunks, (() => { }) as any);

thunks.doUpdate()