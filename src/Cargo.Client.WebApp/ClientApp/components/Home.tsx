import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Orders from '../store/Orders';

// At runtime, Redux will merge together...
type OrdersProps =
    Orders.OrdersState        // ... state we've requested from the Redux store
    & typeof Orders.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>; // ... plus incoming routing parameters

class Home extends React.Component<OrdersProps, {}> {
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
                    <th>Подробнее</th>
                </tr>
            </thead>
            <tbody>
                {this.props.orders.map(order =>
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.customer.name}</td>
                        <td>{order.name}</td>
                        <td>
                            <Link to={`/orders/${order.id}`} > Изменить </Link>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>;
    }

    public render() {
        return <div>
            <h1>Cargo</h1>
            <p>Добро пожаловать в систему управления 3d-печатью</p>
            {this.renderOrderTable()}
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.orders, // Selects which state properties are merged into the component's props
    Orders.actionCreators                 // Selects which action creators are merged into the component's props
)(Home) as typeof Home;
