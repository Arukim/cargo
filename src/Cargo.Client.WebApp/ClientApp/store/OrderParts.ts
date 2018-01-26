import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { OrderPartQueryResponse } from 'ClientApp/models';

export interface OrderPartsState {
    isLoading: boolean;
	orderParts: OrderPartQueryResponse[];
}

// Actions

interface RequestOrderParts {
    type: 'REQUEST_ORDERPARTS';
}

interface ReceiveOrderParts {
    type: 'RECEIVE_ORDERPARTS';
	orderParts: OrderPartQueryResponse[];
}

type KnownAction = RequestOrderParts | ReceiveOrderParts;

export const actionCreators = {
    requestOrderParts: (values: number[]): AppThunkAction<KnownAction> => (dispatch, getState) => {
        let fetchTask = fetch(`api/OrderParts/Query`,
            {
                method: "POST",
                body: JSON.stringify({ orderPartIds: values }),
                headers: new Headers({ 'content-type': 'application/json' })
            })
			.then(response => response.json() as Promise<OrderPartQueryResponse[]>)
            .then(data => dispatch({ type: 'RECEIVE_ORDERPARTS', orderParts: data }));

        addTask(fetchTask);
        dispatch({ type: 'REQUEST_ORDERPARTS' });
    }
};

const unloadedState: OrderPartsState = { isLoading: false, orderParts: [] };

export const reducer: Reducer<OrderPartsState> = (state: OrderPartsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_ORDERPARTS':
            return {
                orderParts: [],
                isLoading: true
            };
        case 'RECEIVE_ORDERPARTS':
            return {
                orderParts: action.orderParts,
                isLoading: false
            };
        default:
            const exhaustiveCheck: never = action;
    }
    return state || unloadedState;
}