import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Order } from 'ClientApp/models';

// STATE
export interface OrderState {
    isLoading: boolean;
    order?: Order;
}


// ACTIONS
interface RequestOrder {
    type: 'REQUEST_ORDER'
}

interface ReceiveOrder {
    type: 'RECEIVE_ORDER',
    order: Order
}

type KnownAction = RequestOrder | ReceiveOrder;

export const actionCreators = {
    requestOrder: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Orders/${id}`)
            .then(resp => resp.json() as Promise<Order>)
            .then(data => {
                dispatch({ type: 'RECEIVE_ORDER', order: data });
            });
        addTask(fetchTask);
        dispatch({ type: 'REQUEST_ORDER' });
    }
};

const unloadedState: OrderState = {
    isLoading: true
};

export const reducer: Reducer<OrderState> = (state: OrderState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_ORDER':
            return {
                isLoading: true,
                order: state.order
            };
        case 'RECEIVE_ORDER':
            return {
                isLoading: false,
                order: action.order
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};