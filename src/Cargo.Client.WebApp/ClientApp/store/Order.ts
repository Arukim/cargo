import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { Order, OrderPart } from 'ClientApp/models';

// STATE
export interface OrderState {
    isLoading: boolean;
    order: Order;
}


// ACTIONS
interface RequestOrder {
    type: 'REQUEST_ORDER'
}

interface ReceiveOrder {
    type: 'RECEIVE_ORDER',
    order: Order
}

interface AddOrderParts {
    type: 'ADD_ORDERPARTS'
}

interface AddedOrderParts {
    type: 'ADDED_ORDERPARTS',
    orderParts: OrderPart[]
}

type KnownAction = RequestOrder | ReceiveOrder
    | AddOrderParts | AddedOrderParts;

export const actionCreators = {
    requestOrder: (id: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Orders/${id}`)
            .then(resp => resp.json() as Promise<Order>)
            .then(data => {
                dispatch({ type: 'RECEIVE_ORDER', order: data });
            });
        addTask(fetchTask);
        dispatch({ type: 'REQUEST_ORDER' });
    },
    addOrderPart: (orderId: number, partId: number, count: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/Orders/${orderId}/AddOrderParts/${partId}/${count}`,
            {
                method: "POST"
            })
            .then(resp => resp.json() as Promise<OrderPart[]>)
            .then(data => {
                dispatch({ type: 'ADDED_ORDERPARTS', orderParts: data });
            });
        addTask(fetchTask);
        dispatch({
            type: 'ADD_ORDERPARTS'            
        });
    }
};

const unloadedState: OrderState = {
    isLoading: true,
    order: Object.assign({})
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
        case 'ADD_ORDERPARTS':
            return state;
        case 'ADDED_ORDERPARTS':
            return {
                ...state,
                order: {
                    ...state.order,
                    orderParts: [...state.order.orderParts, ...action.orderParts]
                }
            };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};