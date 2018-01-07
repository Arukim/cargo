import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Customer } from 'ClientApp/models';

export interface CustomersState {
    isLoading: boolean;
    customers: Customer[];
}

interface RequestCustomers {
    type: 'REQUEST_CUSTOMERS';
}

interface ReceiveCustomers {
    type: 'RECEIVE_CUSTOMERS';
    customers: Customer[];
}

type KnownAction = RequestCustomers | ReceiveCustomers;

export const actionCreators = {
    requestCustomers: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Customers`)
            .then(resp => resp.json() as Promise<Customer[]>)
            .then(data => dispatch({ type: 'RECEIVE_CUSTOMERS', customers: data }));
        addTask(fetchTask);
        dispatch({ type: 'REQUEST_CUSTOMERS' });
    }
}

const unloadedState: CustomersState = {
    isLoading: false,
    customers: []
};

export const reducer: Reducer<CustomersState> = (state: CustomersState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CUSTOMERS':
            return {
                ...state,
                isLoading: true
            };
        case 'RECEIVE_CUSTOMERS':
            return {
                ...state,
                isLoading: true,
                customers: action.customers
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
}