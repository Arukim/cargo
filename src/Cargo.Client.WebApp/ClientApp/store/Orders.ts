import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Order } from 'ClientApp/models';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface OrdersState {
    isLoading: boolean;
    orders: Order[];
}

// ACTIONS

interface RequestOrdersAction {
    type: 'REQUEST_ORDERS';
}

interface ReceiveOrdersAction {
    type: "RECEIVE_ORDERS";
    orders: Order[];
}

interface DeletedOrder {
    type: "DELETED_ORDER";
    id: number;
}

type KnownAction = RequestOrdersAction | ReceiveOrdersAction
    | DeletedOrder;


export const actionCreators = {
    requestOrders: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        // Only load data if it's something we don't already have (and are not already loading)
        let fetchTask = fetch(`api/Orders`)
            .then(response => response.json() as Promise<Order[]>)
            .then(data => dispatch({ type: 'RECEIVE_ORDERS', orders: data }));

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
        dispatch({ type: 'REQUEST_ORDERS' });
    },
    deleteOrder: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Orders/${id}`, { method: "DELETE" })
            .then(() => dispatch({ type: 'DELETED_ORDER', id: id }));
        addTask(fetchTask);
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
        case 'DELETED_ORDER':
            return {
                ...state,
                orders: state.orders.filter(x => x.id != action.id)
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
