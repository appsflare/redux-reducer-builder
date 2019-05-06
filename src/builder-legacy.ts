import { Reducer, AnyAction, Action } from 'redux';
import {
    IActionHandler, IActionCreatorFactory,
    IAsyncPayload, IMetaAsyncActionCreatorFactory,
    IAsyncActionHandler, IReducerBuilder
} from './types';
import { getPendingActionType, getFulFilledActionType, getRejectedActionType } from './helpers';


/** 
 * Create a new instance of reduce builder
 * @type TSTate defines type of state
*/
export function createReducerBuilder<TState>() {

    const actionHandlers = new Map<string, IActionHandler<TState, any>>();
    return {

        /**
         * registers a function as handler to run as reducer method once an action mathcing given action creator is dispatched
         * @param actionCreator the action creator definition
         * @param handler the handler that would be called when the action is dispatched
         */
        handleAction<TPayload>(actionCreator: IActionCreatorFactory<TPayload>, handler: IActionHandler<TState, TPayload>) {
            actionHandlers.set(actionCreator.type, handler);
            return this;
        },
        /**
         * registers a function as handler to run as a reducer method once one of the actions matching given action creators is dispatched
         * @param actionCreators array of action creator definitions
         * @param handler the handler that would be called when the action matching given action creator's definition is dispatched
         */
        handleActions<TPayload>(actionCreators: IActionCreatorFactory<TPayload>[], handler: IActionHandler<TState, TPayload>) {
            actionCreators.forEach(a => this.handleAction(a, handler));
            return this;
        },
        /**
         * Registers async action handlers of the given async action creator definition.
         * @param actionCreator an async action creator definition
         * @param stateHandlers state handlers to handler three states of an asynchronous action namely pending, fulfilled and rejected
         */
        handleAsyncAction<TPayload extends IAsyncPayload<TResult>, TResult, TData = any, TMeta = any>(
            actionCreator: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>,
            stateHandlers: Partial<IAsyncActionHandler<TState, TPayload, TResult, TMeta>>) {
            if (stateHandlers.pending) {
                actionHandlers.set(getPendingActionType(actionCreator), stateHandlers.pending as IActionHandler<TState, any>);
            }

            if (stateHandlers.fulfilled) {
                actionHandlers.set(getFulFilledActionType(actionCreator), stateHandlers.fulfilled as IActionHandler<TState, any>);
            }

            if (stateHandlers.rejected) {
                actionHandlers.set(getRejectedActionType(actionCreator), stateHandlers.rejected as IActionHandler<TState, any>);
            }

            return this;
        },
        /**
         * Registers async action handlers of the given async action creator definitions.
         * @param actionCreators an array of async action creator definitions
         * @param stateHandlers state handlers to handler three states of an asynchronous action namely pending, fulfilled and rejected
         */
        handleAsyncActions<TPayload extends IAsyncPayload<TResult>, TResult, TData = any, TMeta = any>(
            actionCreators: IMetaAsyncActionCreatorFactory<TResult, TData, TMeta>[],
            stateHandlers: Partial<IAsyncActionHandler<TState, TPayload, TResult, TMeta>>) {

            actionCreators.forEach(a => this.handleAsyncAction(a, stateHandlers));

            return this;
        },

        /**
         * Composes a reducer method with registered action handlers
         * @param initialState the initial state of the reducer. This is useful when redux dispatches @init action to initialize with default state
         */
        build(initialState: TState): Reducer<TState, Action> {
            return (state: TState | undefined, action: any) => {

                const finalState: any = state || initialState;

                const handler = actionHandlers.get(action.type);

                return handler ? handler(finalState, action) : finalState;
            };
        }
    } as IReducerBuilder<TState>;
}