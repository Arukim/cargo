import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface MagicsState {
    isLoading: boolean;
    isConnected: boolean;
    appCount: number;
    status: MagicsStatus;
}

export interface MagicsStatus {
    modelsCount: number;
    modelsVolume: number;
}

// ACTIONS

interface RequestMagicsStatus {
    type: 'REQUEST_STATUS';
}

interface RequestAppCount {
    type: "REQUEST_APP_COUNT";
}

interface ReceiveAppCount {
    type: "RECEIVE_APP_COUNT";
    appCount: number;
}

interface ReceiveMagicsStatus {
    type: "RECEIVE_STATUS";
    status: MagicsStatus;
}

type KnownAction = RequestMagicsStatus | ReceiveMagicsStatus
    | RequestAppCount | ReceiveAppCount;


export const actionCreators = {
    requestStatus: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        let fetchTask = fetch(`api/Magics/status`)
            .then(response => response.json() as Promise<MagicsStatus>)
            .then(data => {
                dispatch({ type: 'RECEIVE_STATUS', status: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_STATUS' });
    },
    requestAppCount: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch('api/Magics/AppCount')
            .then(resp => resp.json() as Promise<number>)
            .then(data => {
                dispatch({ type: 'RECEIVE_APP_COUNT', appCount: data });
            });
        addTask(fetchTask);
        dispatch({ type: 'REQUEST_APP_COUNT' });
    }
};

const unloadedState: MagicsState = {
    appCount: 0,
    isConnected: false,
    status: {
        modelsCount: 0,
        modelsVolume: 0
    }, isLoading: false
};

export const reducer: Reducer<MagicsState> = (state: MagicsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_STATUS':
            return {
                status: state.status,
                appCount: state.appCount,
                isLoading: true,
                isConnected: state.isConnected
            };
        case 'RECEIVE_STATUS':
            return {
                status: action.status,
                appCount: state.appCount,
                isLoading: false,
                isConnected: state.isConnected
            };
        case 'REQUEST_APP_COUNT':
            return {
                status: state.status,
                appCount: state.appCount,
                isLoading: false,
                isConnected: state.isConnected
            };
        case 'RECEIVE_APP_COUNT':
            return {
                status: state.status,
                appCount: action.appCount,
                isLoading: false,
                isConnected: state.isConnected
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
