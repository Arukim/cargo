import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Customer } from 'ClientApp/models';

export interface CustomerAddState {
    isLoading: boolean;
    id?: number;
}

export interface CreateCustomer {
    type: 'CREATE_CUSTOMER';
}

export interface CreatedCustomer {
    type: 'CREATED_CUSTOMER';
    id: number;
}

type KnownAction = CreateCustomer | CreatedCustomer;

export const actionCreators = {
    addCustomer: (cust: Customer): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Customers`, {
            method: "POST",
            headers: new Headers({ 'content-type': 'application/json' }),
            body: JSON.stringify(cust)
        }).then(resp => resp.json() as Promise<number>)
            .then(data => dispatch({ type: 'CREATED_CUSTOMER', id: data }));

        addTask(fetchTask);
        dispatch({ type: 'CREATE_CUSTOMER' });
    }
};

const unloadedState: CustomerAddState = {
    isLoading: false
};

export const reducer: Reducer<CustomerAddState> = (state: CustomerAddState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'CREATE_CUSTOMER':
            return {
                isLoading: true
            };
        case 'CREATED_CUSTOMER':
            return {
                isLoading: false,
                id: action.id
            };
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}