import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface MagicsState {
    isLoading: boolean;
    status: MagicsStatus;
}

export interface MagicsStatus {
    isConnected: boolean;
}

// ACTIONS

interface RequestMagicsStatus {
    type: 'REQUEST_STATUS';
}

interface ReceiveMagicsStatus {
    type: "RECEIVE_STATUS";
    status: MagicsStatus;
}

type KnownAction = RequestMagicsStatus | ReceiveMagicsStatus;


export const actionCreators = {
    requestStatus: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        let fetchTask = fetch(`api/Magics`)
            .then(response => response.json() as Promise<MagicsStatus>)
            .then(data => {
                dispatch({ type: 'RECEIVE_STATUS', status: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_STATUS' });
    }
};

const unloadedState: MagicsState = {status: {isConnected: false}, isLoading: false };

export const reducer: Reducer<MagicsState> = (state: MagicsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_STATUS':
            return {
                status: state.status,
                isLoading: true
            };
        case 'RECEIVE_STATUS':
            return {
                status: action.status,
                isLoading: false
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
