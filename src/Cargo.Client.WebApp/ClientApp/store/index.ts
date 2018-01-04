import * as WeatherForecasts from './WeatherForecasts';
import * as Counter from './Counter';
import * as Orders from './Orders';
import * as Order from './Order';
import * as Magics from './Magics';
import * as Customer from './Customer';

// The top-level state object
export interface ApplicationState {
    counter: Counter.CounterState;
    weatherForecasts: WeatherForecasts.WeatherForecastsState;
    orders: Orders.OrdersState;
    order: Order.OrderState;
    magics: Magics.MagicsState;
    customer: Customer.CustomerState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    counter: Counter.reducer,
    weatherForecasts: WeatherForecasts.reducer,
    orders: Orders.reducer,
    order: Order.reducer,
    magics: Magics.reducer,
    customer: Customer.reducer,
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
