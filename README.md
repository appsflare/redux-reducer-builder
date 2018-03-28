# redux-reducer-builder
![Total Downloads](https://img.shields.io/npm/dt/@appsflare/redux-reducer-builder.svg)

A easy to use utility to build type safe reducers


## Why?

Writing redux applications in plain JavaScript is bit of a challenge as it would bring lot of assumptions about the data types in to the table.

Let's say that If I wanted to create an action, first I would have to define the type for it and whenever I wanted to address the action, I would have to use that action type separately like the places where we are writing reducers.
Then again we would have to assume on payload data types. The modern IDEs can't give you any suggestions at the development time.

Well you might say that's okay. But think of a situation where a team of many developers working on a huge project where one creates the action creator and write reducers for the same. Some other times, some other member of your team made to work on this who might not understand the action's payload right way when he/she is looking at reducer code first time. That team member then have to put significant amount of time in understanding the code and again assume on payload data type.

Assumptions may not be a problem but if the same leads to an runtime error is a big problem.
So, By making the actions and reducers type safe,

1. Errors could be captured at development time.
2. Easier and faster to write actions and reducers
3. Refactoring is a breeze
4. Less error prone code at runtime

This library is written to address the above said problems with typescript's type definitions powering the action defintions at the development time. 

## Usage

Creating an action creator

```sh
npm install @appsflare/redux-reducer-builder
```

~~~ts
// file: task-action-creator.ts
import { createActionCreator } from '@appsflare/redux-reducer-builder';

export const TaskActionCreators = {
    loadTasks: createAsyncActionCreator('LOAD-TASKS', (args: { take: number; skip: number )=>{
        return {
            //save args as meta data for later use
            meta: args,
            payload:{
                promise:()=>{
                    //launch an asynchronous operation like calling an web api.
                    return Promise.resolve([]);
                }
            }
        }
    })
    createTask: createActionCreator('CREATE-TASK', (args: { task: {id: string; title:string;} })=>{
        return args;
    }),
    deleteTask: createActionCreator('DELETE-TASK', (args: { taskId: string })=>{
        return args;
    })
}
~~~

Creating an reducer for the above created actions.

Take a look at the **handleAsyncAction** method below and the parameters passed to it.
First parameter is the action creator definition itself and the second is an object containing handlers for 3 different states of an asynchronous operation.

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

In each of those handler method, you can access the arguments that was passed to action creator from meta property.
Of course with it's type information not lost. BONUS right!?

As soon as the asynchronous operation is completed our promise representing the operation would be resolved with a value. The same value can be accessed from action parameter of fulfilled state handler like **"action.payload.result"**.

Of course with the type information of result. Double BONUS right!!?

When the Oops moment occurs during the asynchronous operation that is when it fails our promise representing would be rejcted with a reason for failure.

> Remember to make use of async action creator and handle async actions you would have to use **redux-promise-middleware** or other such compatible middlewares.

The same error can be accessed from action parameter of rejected state handler like **"action.error"**.

Again our type information here also not lost. Triple BONUS!!!?

Okay then what about a normal action like our **TaskActionCreators.createTask**, does it also work?

Yes it would. The **"action.payload"** would reflect the value returned by the payload factory method of action creator definition.

In this case, **"action.payload"** reflects the type of args parameter of **TaskActionCreators.createTask** action creator.

~~~ts
// file: task-action-creator.ts
import { createReducerBuilder } from '@appsflare/redux-reducer-builder';
import { TaskActionCreators } from './task-action-creator';

export const taskReducer = createReducerBuilder<TaskState>()
                            .handleAsyncAction(TaskActionCreators.loadTasks,{
                                pending(state, action){                               
                                    return state;
                                },
                                fulfilled(state, action){
                                    return state;
                                },
                                rejected(state, action){                               
                                    return state;
                                }
                            })
                            .handleAction(TaskActionCreators.createTask, (state, action)=>{
                              
                                return state;
                            })
                            .build({
                                //initial state, but it is optional
                            });
~~~
