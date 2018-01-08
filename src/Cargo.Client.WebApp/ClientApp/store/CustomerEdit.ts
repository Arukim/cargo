import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Customer, CreateOrderModel } from 'ClientApp/models';

export interface CustomerEditState {
    isLoading: boolean;
    customer: Customer;
    newOrderId?: number;
}

export interface RequestCustomer {
    type: 'REQUEST_EDIT_CUSTOMER';
}

export interface ReceivedCustomer {
    type: 'RECEIVED_EDIT_CUSTOMER';
    customer: Customer;
}

export interface CreateOrder {
    type: 'CREATE_ORDER';
}

export interface CreatedOrder {
    type: 'CREATED_ORDER';
    id: number;
}

type KnownAction = RequestCustomer | ReceivedCustomer
    | CreateOrder | CreatedOrder;

export const actionCreators = {
    requestCustomer: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Customers/${id}`)
            .then(resp => resp.json() as Promise<Customer>)
            .then(data => {
                dispatch({ type: 'RECEIVED_EDIT_CUSTOMER', customer: data });
            });

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_EDIT_CUSTOMER' });
    },
    createOrder: (order: CreateOrderModel): AppThunkAction<KnownAction> => (dispatch, getState) => {
        var data = new FormData();
        data.append("name", order.name);
        for (let i = 0; i < order.files.length; i++) {
            data.append("files", order.files[i].file);
            data.append("count", "" + order.files[i].count);
        }
        let fetchTask = fetch(`api/Customers/${getState().customerEdit.customer.id}/orders`, {
            method: "POST",
            body: data
        }).then(resp => resp.json() as Promise<number>)
            .then(data => dispatch({ type: 'CREATED_ORDER', id: data }));

        addTask(fetchTask);
        dispatch({ type: 'CREATE_ORDER' });
    }
};

const unloadedState: CustomerEditState = {
    isLoading: true,
    customer: Object.assign({})
};

export const reducer: Reducer<CustomerEditState> = (state: CustomerEditState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_EDIT_CUSTOMER':
            return {
                ...state,
                newOrderId: undefined,
                isLoading: true
            };
        case 'RECEIVED_EDIT_CUSTOMER':
            return {
                isLoading: false,
                customer: action.customer
            };
        case 'CREATE_ORDER':
            return {
                ...state,
                isLoading: true,
            };
        case 'CREATED_ORDER':
            return {
                ...state,
                isLoading: false,
                newOrderId: action.id
            };
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}