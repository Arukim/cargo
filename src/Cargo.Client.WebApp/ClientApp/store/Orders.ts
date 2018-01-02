import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface OrdersState {
    isLoading: boolean;
    orders: Order[];
}

export interface Order {
    id: string;
    name: string;
    ordersParts: OrderPart[];
}

export interface OrderPart {
    id: string;
    name: string;
}

// ACTIONS

interface RequestOrdersAction {
    type: 'REQUEST_ORDERS';
}

interface ReceiveOrdersAction {
    type: "RECEIVE_ORDERS";
    orders: Order[];
}

type KnownAction = RequestOrdersAction | ReceiveOrdersAction;


export const actionCreators = {
    requestOrders: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        let fetchTask = fetch(`api/Orders`)
            .then(response => response.json() as Promise<Order[]>)
            .then(data => {
                dispatch({ type: 'RECEIVE_ORDERS', orders: data });
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_ORDERS' });
    }
};

const unloadedState: OrdersState = { orders: [], isLoading: false };

export const reducer: Reducer<OrdersState> = (state: OrdersState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_ORDERS':
            return {
                orders: state.orders,
                isLoading: true
            };
        case 'RECEIVE_ORDERS':
            return {
                orders: action.orders,
                isLoading: false
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
