# redux-reducer-builder
A easy to use utility to build type safe reducers

## Why?

Writing redux applications in plain JavaScript is bit of a challenge as it would bring lot of assumption about the data types in to the table.

Let's say that If I want to create an action first I would have define the type for it and whenever I wanted to address the action I needed to use that action type separately like the places where we are writing reducers.
Then again we would have to assume on payload data types. The modern IDEs can't give you any suggestions at the development time.

Well you might say that's okay. But think of a situation where a team of many developers working on a huge project where one creates the action creator and write reducers for the same. Some other times some other member of your team made to work on this who might not understand the action's payload right way when he/she is looking at reducer code first time. That team member then have to put significant amount of time in understanding the code and again assume on payload data type.

Assumptions may not be a problem but the same leads to an runtime error is a big problem. By making the actions and reducers type safe not only capturing these errors possible at development time but also improves the productivity of team to write less error prone code.

This library is written to address the above said problems with typescript's type definitions powering the action defintions at the development time. 

## Usage

Creating an action creators

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
    deleteTask: createActionCreator('CREATE-TASK', (args: { taskId: string })=>{
        return args;
    })
}
~~~

Creating an reducer for the above created action
~~~ts
// file: task-action-creator.ts
import { createReducerBuilder } from '@appsflare/redux-reducer-builder';
import { TaskActionCreators } from './task-action-creator';

export const taskReducer = createReducerBuilder<TaskState>()
                            .handleAsyncAction(TaskActionCreators.loadTasks,{
                                pending(state, action){
                                    //here you can access the arguments that was passed to action creator from meta property. Of course with it's type information not last. BONUS right!?
                                    return state;
                                },
                                fulfilled(state, action){
                                    //here you can retrieve the result of async operation from "action.payload.result". Of course your type information is not lost. Double BONUS!!?
                                    return state;
                                },
                                rejected(state, action){
                                    //Oops, something went wrong with the async operation that we started. We might want to store the error show that we could show some userful error message in the user interface. You can access the error object from action like "action.error". Triple BONUS!!!?
                                    return state;
                                }
                            })
                            .handleAction(TaskActionCreators.createTask, (state, action)=>{
                                //here action.payload reflects the type of the data returned by action creator. In this case, it would reflect the type of args argument.
                                return state;
                            })
~~~

> Remember to make use of async action creator and handle async actions you would have to use redux-promise-middleware or other such compatible middlewares.