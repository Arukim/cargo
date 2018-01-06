import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { NewBatch, Batch } from '../models';

export interface BatchState {
    newBatchId?: number; // used on NewBatch
    // Used on EditBatch
    isLoading: boolean;
    batch: Batch;
}

interface RequestBatch {
    type: 'REQUEST_BATCH'
}

interface ReceiveBatch {
    type: 'RECEIVE_BATCH',
    batch: Batch
}

interface StartNewBatch {
    type: "START_NEWBATCH"
}

interface CreatedBatch {
    type: "CREATED_BATCH";
    id: number;
}

type KnownAction = CreatedBatch | StartNewBatch
    | RequestBatch | ReceiveBatch;

export const actionCreators = {
    startNewBatch: (): AppThunkAction<KnownAction> => (dispath, getState) => {
        dispath({ type: 'START_NEWBATCH' });
    },
    createBatch: (newBatch: NewBatch): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Batches`, {
            method: "POST",
            body: JSON.stringify(newBatch),
            headers: new Headers({ 'content-type': 'application/json' })
        }).then(resp => resp.json() as Promise<number>)
            .then(data => dispatch({ type: 'CREATED_BATCH', id: data }));

        addTask(fetchTask);
    },
    requestBatch: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Batches/${id}`)
            .then(resp => resp.json() as Promise<Batch>)
            .then(data => dispatch({ type: 'RECEIVE_BATCH', batch: data }));

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_BATCH' });
    }
}

const unloadedState: BatchState = {
    isLoading: true,
    batch: Object.assign({})
};

export const reducer: Reducer<BatchState> = (state: BatchState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'START_NEWBATCH':
            return {
                ...state,
                newBatchId: undefined
            };
        case 'CREATED_BATCH':
            return {
                ...state,
                newBatchId: action.id
            };
        case 'REQUEST_BATCH':
            return {
                ...state,
                isLoading: true
            };
        case 'RECEIVE_BATCH':
            return {
                ...state,
                isLoading: false,
                batch: action.batch
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
}