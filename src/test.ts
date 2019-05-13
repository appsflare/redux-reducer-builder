import { createActionBuilder } from './action-builder';
import { buildReducer } from './reducer-builder';
import { bindActionCreators } from './dispatchers';


const TaskActions = createActionBuilder({
    namespace: 'CORE/TASKS',
    actions: {
        create: (args?: { name: string }) => args,
        createAsync: (args?: { name: string }) => Promise.resolve(args),
    },
    thunks: {
        doCreate: (args?: { name: string }) => function (dispatch) {
            this
            dispatch({ type: '', payload: args })
        },
    }
});

TaskActions.actionCreators.create();
TaskActions.thunkCreators.doCreate();

const reducer = buildReducer(TaskActions, o => {
    o.handlers.create((s, a) => s);
    o.handlers.createAsync({
        fulfilled: (s, a) => s
    });
}, { tasks: [] });



const a = bindActionCreators(TaskActions.actionCreators, () => { } as any);
a.create()