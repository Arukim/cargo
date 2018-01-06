import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Batch } from '../models';

export interface BatchesState {
    isLoading: boolean;
    batches: Batch[];
}

interface RequestBatches {
    type: 'REQUEST_BATCHES';
}

interface ReceiveBatches {
    type: 'RECEIVE_BATCHES';
    batches: Batch[];
}

interface DeleteBatch {
    type: 'DELETE_BATCH';
    id: number;
}

type KnownAction = RequestBatches | ReceiveBatches
    | DeleteBatch ;

export const actionCreators = {
    requestBatches: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Batches`)
            .then(resp => resp.json() as Promise<Batch[]>)
            .then(data => dispatch({
                type: 'RECEIVE_BATCHES', batches: data
            }));

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_BATCHES' });
    },
    deleteBatch: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Batches/${id}`,
            { method: "DELETE" })
            .then(resp => resp.json() as Promise<void>);

        addTask(fetchTask);
        dispatch({ type: 'DELETE_BATCH', id: id });
    }
}

const unloadedState: BatchesState = {
    isLoading: true,
    batches: []
};

export const reducer: Reducer<BatchesState> = (state: BatchesState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_BATCHES':
            return {
                ...state,
                isLoading: true
            };
        case 'RECEIVE_BATCHES':
            return {
                ...state,
                isLoading: false,
                batches: action.batches
            };
        case 'DELETE_BATCH':
            return {
                ...state,
                batches: state.batches.filter(x => x.id != action.id)
            }
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}