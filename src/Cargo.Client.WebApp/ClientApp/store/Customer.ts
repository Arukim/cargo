import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Customer } from 'ClientApp/models';

// STATE
export interface CustomerState {
    isLoading: boolean;
    customer?: Customer;
}


// ACTIONS
interface RequestCustomer {
    type: 'REQUEST_CUSTOMER'
}

interface ReceiveCustomer {
    type: 'RECEIVE_CUSTOMER',
    customer: Customer
}

type KnownAction = RequestCustomer | ReceiveCustomer;

export const actionCreators = {
    requestCustomer: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Customers/${id}`)
            .then(resp => resp.json() as Promise<Customer>)
            .then(data => {
                dispatch({ type: 'RECEIVE_CUSTOMER', customer: data });
            });
        addTask(fetchTask);
        dispatch({ type: 'REQUEST_CUSTOMER' });
    }
};

const unloadedState: CustomerState = {
    isLoading: true
};

export const reducer: Reducer<CustomerState> = (state: CustomerState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_CUSTOMER':
            return {
                isLoading: true,
                customer: state.customer
            };
        case 'RECEIVE_CUSTOMER':
            return {
                isLoading: false,
                customer: action.customer
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};