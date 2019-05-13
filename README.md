# redux-reducer-builder
![Total Downloads](https://img.shields.io/npm/dt/@appsflare/redux-reducer-builder.svg)

A easy to use utility to build type safe reducers


## Why?

Writing redux applications in plain JavaScript is bit of a challenge as it would bring lot of assumptions about the data types in to the table.

Let's say that If I wanted to create an action, first I would have to define the type for it and whenever I wanted to address the action, I would have to use that action type separately like the places where we are writing reducers.
Then again we would have to assume on payload data types. Even the modern IDEs can't give you any type suggestions at the development time.

Well you might say that's okay. But think of a situation where a team of many developers working on a huge project where one creates the action creator and write reducers for the same. Some other times, some other member of your team made to work on this who might not understand the action's payload right way when he/she is looking at reducer code first time. That team member then have to put significant amount of time in understanding the code and again assume on payload data type.

Assumptions may not be a problem but if the same leads to an runtime error is a big problem.
So, By making the actions and reducers type safe,

1. Errors could be captured at development time.
2. Easier and faster to write actions and reducers
3. Refactoring and source code navigation is a breeze
4. Less error prone code at runtime

This library is written to address the above said problems with typescript's type definitions powering the action defintions at the development time. 

## Install

```sh
npm install @appsflare/redux-reducer-builder
```
## Usage 
Creating action creators, 
~~~ts
// file: task-actions.ts
import { createActionCreators } from '@appsflare/redux-reducer-builder';

export const TaskActions = createActionCreators({
    namespace: 'CORE/TASKS',
    actions: {

        addTask: (args?: { title: string }) => args,
        updateTask: (args?: { id: string, title: string }) => args,
        removeTask: (args?: { id: string }) => args,
        loadTasksAsync: () => Promise.resolve(JSON.parse(localStorage.getItem('tasks') || '[]') as Array<{ id: string; title: string; }>)
        
        // remove: (args?: { id: string }) => args,
    },
});
~~~

Note: In the above sample effects represent asynchronous actions.


Creating an reducer for the above created actions and effects.

Take a look at the **buildReducer** method below and the parameters passed to it.
First parameter is the action creators definitions itself and the second is a factory method that adds handlers for actions. When the action returns a promise of an asynchronous operation, a handler for it takes methods with the name of promise states. 

Three states of asynchronous operation is nothing but possible promise states, they are,

1. pending
2. fulfilled
3. rejected 

So here we just have to create an object containing methods matching the above mentioned states like,

~~~ts
{
    pending(state, action){
        ...
    },
    fulfilled(state, action){
        ...
    },
    rejected(state, action){
        ...
    }
}
~~~

In each of those handler method, you can access the arguments that was passed to action creator as argumenta and of course with it's type information not lost. BONUS right!?

As soon as the asynchronous operation is completed our promise representing the operation would be resolved with a value. The same value can be accessed from action parameter of fulfilled state handler like **"action.payload.result"**.

Of course with the type information of result. Double BONUS right!!?

When the Oops moment occurs during the asynchronous operation that is when it fails our promise representing that operation would be rejcted with a reason for failure.

> Remember to make use of effects and to handle actions of an effect you would have to use **redux-promise-middleware** or other such compatible middlewares.

The same error can be accessed from action parameter of rejected state handler like **"action.error"**.

Again our type information here also not lost. Triple BONUS!!!?

Okay then what about a normal action like our **TaskActions.actionCreators.addTask**, does it also work?

Yes!!. The **"action.payload"** would reflect the value returned by the payload factory method of action creator definition.

In this case, **"action.payload"** reflects the type of args parameter of **Tasks.actionCreators.addTask** action creator.

~~~ts
// file: task-reducer.ts
import { buildReducer } from '@appsflare/redux-reducer-builder';
import { TaskActions } from './task-actions';

export const taskReducer = buildReducer(TaskActions, o => {
    o.handlers.addTask((state, action) => {
        return {
            tasks: state.tasks.concat({ id: Date.now().toString(), ...action.payload })
        };
    });
    o.handlers.updateTask((state, action) => {
        const taskIndex = state.tasks.findIndex(i => i.id == a.payload.id);
        if (!taskIndex) {
            return state;
        }
        const tasks = [...state.tasks];
        tasks[taskIndex] = { id: action.payload.id, title: action.payload.title }

        return {
            tasks
        };
    });
    o.handlers.removeTask((state, action) => {
        return {
            tasks: state.tasks.filter(i => i.id !== action.payload.id)
        };
    });
    o.handlers.loadTasksAsync({
        fulfilled(state, action) {
            return { tasks: action.payload.result };
        }
    });
}, initialState);
~~~

## Thunks

If you are using "redux-thunk" middleware you would this feature very useful. Redux Reducer Builder offers a very tight type definition support for actions, thunks and reducers.

```ts
const TaskThunks = createThunkCreators({
    doCreate: (args?: { name: string }) => (dispatch, getState) => Promise.resolve(args!),
    doUpdate: (args?: { name: string }) => (dispatch, getState) => { },
});
```

Thunks provide access to current state of the store and gives you freedom to dispatch any actions of your choice. You can dispatch thunks as you dispatch actions. The only difference is that you cannot have a reducer for thunks.