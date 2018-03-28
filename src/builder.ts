import { Reducer } from 'redux';
import {
    IActionHandler, IActionCreator,
    IAsyncPayload, IMetaAsyncActionCreator,
    IAsyncActionHandler, ModuleAction, IReducerBuilder
} from './types';


/** 
 * Create a new instance of reduce builder
 * @type TSTate defines type of state
*/
export function createReducerBuilder<TState>() {

    var actionHandlers = new Map<string, IActionHandler<TState, any>>();
    return {

        /**
         * registers a function as handler to run as reducer method once an action mathcing given action creator is dispatched
         * @param actionCreator the action creator definition
         * @param handler the handler that would be called when the action is dispatched
         */
        handleAction<TPayload>(actionCreator: IActionCreator<TPayload>, handler: IActionHandler<TState, TPayload>) {
            actionHandlers.set(actionCreator.type, handler);
            return this;
        },
        /**
         * registers a function as handler to run as a reducer method once one of the actions matching given action creators is dispatched
         * @param actionCreators array of action creator definitions
         * @param handler the handler that would be called when the action matching given action creator's definition is dispatched
         */
        handleActions<TPayload>(actionCreators: IActionCreator<TPayload>[], handler: IActionHandler<TState, TPayload>) {
            actionCreators.forEach(a => this.handleAction(a, handler));
            return this;
        },
        /**
         * Registers async action handlers of the given async action creator definition.
         * @param actionCreator an async action creator definition
         * @param stateHandlers state handlers to handler three states of an asynchronous action namely pending, fulfilled and rejected
         */
        handleAsyncAction<TPayload extends IAsyncPayload<TResult, TData>, TResult, TData = any, TMeta = any>(
            actionCreator: IMetaAsyncActionCreator<TResult, TData, TMeta>,
            stateHandlers: Partial<IAsyncActionHandler<TState, TPayload, TResult, TData, TMeta>>) {
            if (stateHandlers.pending) { actionHandlers.set(`${actionCreator.type}_PENDING`, stateHandlers.pending as IActionHandler<TState, any>); }

            if (stateHandlers.fulfilled) { actionHandlers.set(`${actionCreator.type}_FULFILLED`, stateHandlers.fulfilled as IActionHandler<TState, any>); }

            if (stateHandlers.rejected) { actionHandlers.set(`${actionCreator.type}_REJECTED`, stateHandlers.rejected); }

            return this;
        },
        /**
         * Registers async action handlers of the given async action creator definitions.
         * @param actionCreators an array of async action creator definitions
         * @param stateHandlers state handlers to handler three states of an asynchronous action namely pending, fulfilled and rejected
         */
        handleAsyncActions<TPayload extends IAsyncPayload<TResult, TData>, TResult, TData = any, TMeta = any>(
            actionCreators: IMetaAsyncActionCreator<TResult, TData, TMeta>[],
            stateHandlers: Partial<IAsyncActionHandler<TState, TPayload, TResult, TData, TMeta>>) {

            actionCreators.forEach(a => this.handleAsyncAction(a, stateHandlers));

            return this;
        },

        /**
         * Composes a reducer method with registered action handlers
         * @param initialState the initial state of the reducer. This is useful when redux dispatches @init action to initialize with default state
         */
        build(initialState?: TState): Reducer<TState> {
            return (state: TState, action: any | ModuleAction<any>) => {

                const finalState = state || initialState;
                const handler = actionHandlers.get(action.type);

                return handler ? handler(finalState, action) : finalState;
            };
        }
    } as IReducerBuilder<TState>;
}