import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as OrdersStore from '../../store/Orders';
import { OrderStatusHelper } from '../../logic/statusHelper';

// At runtime, Redux will merge together...
type OrdersProps =
    OrdersStore.OrdersState        // ... state we've requested from the Redux store
    & typeof OrdersStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>; // ... plus incoming routing parameters

class OrdersComponent extends React.Component<OrdersProps, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestOrders();
    }


    private renderOrderTable() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Заказчик</th>
                    <th>Заказ</th>
                    <th>Статус</th>
                    <th>Подробнее</th>
                </tr>
            </thead>
            <tbody>
                {this.props.orders.map(order =>
                    <tr key={order.id}>
                        <th scope="row">{order.id}</th>
                        <td>{order.customer.name}</td>
                        <td>{order.name}</td>
                        <td>{OrderStatusHelper.get(order.status)}</td>
                        <td>
                            <Link className="btn btn-secondary mx-1" to={`/orders/${order.id}`} > Изменить </Link>
                            <button className="btn btn-warning mx-1"
                                onClick={() => this.props.deleteOrder(order.id)}>
                                Удалить
                            </button>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>;
    }

    public render() {
        return <div>
            <h1>Заказы</h1>
            {this.renderOrderTable()}
        </div>;
    }
}

export const Orders = connect(
    (state: ApplicationState) => state.orders, // Selects which state properties are merged into the component's props
    OrdersStore.actionCreators                 // Selects which action creators are merged into the component's props
)(OrdersComponent) as typeof OrdersComponent;
