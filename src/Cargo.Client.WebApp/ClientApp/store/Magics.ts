import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { MagicsStatus } from 'ClientApp/models';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface MagicsState {
    isAvailable: boolean;
    isLoading: boolean;
    appCount: number;
    status: MagicsStatus;
    loadedOrderParts: number[];
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

interface LoadedOrderPart {
    type: "LOADED_ORDERPART";
    status: MagicsStatus;
}

interface UnloadedOrderPart {
    type: "UNLOADED_ORDERPART";
    id: number;
    status: MagicsStatus;
}


type KnownAction = RequestMagicsStatus | ReceiveMagicsStatus
    | RequestAppCount | ReceiveAppCount
    | LoadedOrderPart | UnloadedOrderPart;


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
    },
    loadOrderPart: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Magics/Load/${id}`, {
            method: "POST"
        }).then(resp => resp.json() as Promise<MagicsStatus>)
            .then(data => dispatch({ type: 'LOADED_ORDERPART', status: data }));
        addTask(fetchTask);
    },
    loadOrderParts: (ids: number[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Magics/Load`, {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify(ids)
        }).then(resp => resp.json() as Promise<MagicsStatus>)
            .then(data => dispatch({ type: 'LOADED_ORDERPART', status: data }));
        addTask(fetchTask);
    },
    unloadOrderPart: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Magics/Unload/${id}`, {
            method: "POST"
        }).then(resp => resp.json() as Promise<MagicsStatus>)
            .then(data => dispatch({ type: 'UNLOADED_ORDERPART', id: id, status: data }));
        addTask(fetchTask);
    },
    unloadAll: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Magics/UnloadAll`, {
            method: "POST"
        }).then(resp => resp.json() as Promise<MagicsStatus>)
            .then(data => dispatch({ type: "LOADED_ORDERPART", status: data }));
        addTask(fetchTask);
    }
};

const unloadedState: MagicsState = {
    appCount: 0,
    isLoading: false,
    isAvailable: false,
    status: {
        modelsCount: 0,
        modelsVolume: 0,
        orderParts: []
    },
    loadedOrderParts: []
};

function getAvailability(count: number): boolean {
    return count == 1;
}

export const reducer: Reducer<MagicsState> = (state: MagicsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_STATUS':
            return {
                ...state,
                isLoading: true,
                isAvailable: false
            };
        case 'RECEIVE_STATUS':
            return {
                ...state,
                status: action.status,
                loadedOrderParts: action.status.orderParts,
                isLoading: false,
            };
        case 'REQUEST_APP_COUNT':
            return {
                ...state,
                isAvailable: getAvailability(state.appCount),
                isLoading: false,
            };
        case 'RECEIVE_APP_COUNT':
            return {
                ...state,
                appCount: action.appCount,
                isAvailable: getAvailability(action.appCount),
                isLoading: false,
            };
        case 'LOADED_ORDERPART':
            return {
                ...state,
                status: action.status,
                loadedOrderParts: action.status.orderParts
            };
        case 'UNLOADED_ORDERPART':
            return {
                ...state,
                status: action.status,
                loadedOrderParts: action.status.orderParts
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
