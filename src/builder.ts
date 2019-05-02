import { Reducer, Action, AnyAction } from 'redux';
import {
    IActionHandler, IActionCreatorFactory,
    IAsyncPayload, IMetaAsyncActionCreatorFactory,
    IAsyncActionHandler, IReducerBuilder
} from './types';
import { getPendingActionType, getFulFilledActionType, getRejectedActionType, Nullable } from './helpers';

import { IActionCreatorBuilderResult, ActionCreators, AllActionCreators, IActionPayloadCreator, IAsyncActionPayloadCreator, createActionCreatorBuilder, EffectCreators, IActionCreators, IEffectCreators } from './action-builder';


const SampleActions = createActionCreatorBuilder({
    namespace: 'CORE/CONTROLS',
    actions: {

        setActiveControlId: (data?: { controlId?: string; }) => data,

        add: (args?: { name: string }) => args,
        // remove: (args?: { id: string }) => args,
    },
    effects: {

        addControl: (data?: { type: string; settings: any; }) => ({
            meta: data,
            payload: async () => {
                return { data, result: data };
            }

        }),
        addAsync: (args?: { name: string }) => ({
            meta: args,
            payload: () => Promise.resolve({ result: true })
        }),

    }
});


SampleActions.actionCreators.setActiveControlId.create()
SampleActions.effectCreators.addControl.create()


export type IActionHandlers<TState, AC extends IActionCreators<A>, A = {}> = {

    [K in keyof AC]+?: AC[K] extends IActionCreatorFactory<infer TD, infer TP> ?
    IActionHandler<TState, TP> : never;
}

export type IEffectHandlers<TState, EF extends IEffectCreators<E>, E = {}> = {

    [K in keyof EF]+?: EF[K] extends IMetaAsyncActionCreatorFactory<infer TR, infer TD, infer TM> ?
    IAsyncActionHandler<TState, IAsyncPayload<TR>, TR, TM> : never;
}


interface AllHandlers<TState, ABR extends IActionCreatorBuilderResult<A, E>, AC = ABR['actionCreators'], EC = ABR['effectCreators'], A = {}, E = {}> {
    actions?: IActionHandlers<TState, AC>;
    effects?: IEffectHandlers<TState, EC>;
}

// const a: IActionHandlers<{}, typeof SampleActions>;
// a.add()

export function buildReducer<ABR extends IActionCreatorBuilderResult<A, E>, TState = {}, A = {}, E = {}>(ac: ABR,
    handlers: AllHandlers<TState, ABR>,
    initialState?: TState
) {



    return function (state?: TState, action: AnyAction) {

    };

}

buildReducer(SampleActions, {
    actions: {

        add: (state, action) => state,
        // setActiveControlId: (state, action) => state
    },
    effects: {
        addAsync: {
            pending: (state, action) => state
        }
    }
    //setActiveControlId: (state, action) => state

}, { email: '' });


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