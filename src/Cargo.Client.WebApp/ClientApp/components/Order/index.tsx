import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from './../../store';
import { Order } from 'ClientApp/models';
import * as OrderStore from '../../store/Order';

import { AddOrderPart } from './addOrderPart';

// At runtime, Redux will merge together...
type OrdersProps =
    OrderStore.OrderState        // ... state we've requested from the Redux store
    & typeof OrderStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ id: number }>; // ... plus incoming routing parameters

class OrderComponent extends React.Component<OrdersProps, {}> {

    private get order(): Order {
        return this.props.order as Order;
    }

    componentWillMount() {
        this.props.requestOrder(this.props.match.params.id);
    }

    public render() {
        return (
            <div>
                {this.props.isLoading ? <p> Loading... </p> :

                    <div>
                        <h1>Заказ {this.order.name}</h1>
                        <p>Редактирование заказа</p>

                        <div>
                            <p> Добавить новую деталь </p>
                            <AddOrderPart
                                customerId={this.order.customer.id}
                                onAddOrderPart={(partId) =>
                                    this.props.addOrderPart(this.order.id, partId, 2)}
                            />
                        </div>
                        {this.renderOrderParts()}
                    </div>
                }
            </div>);
    }


    private renderOrderParts() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Название модели</th>
                </tr>
            </thead>
            <tbody>
                {this.order.orderParts.map((op,idx) =>
                    <tr key={idx}>
                        <td>{op.id}</td>
                        <td>{op.part.name}</td>
                    </tr>
                )}
            </tbody>
        </table>;
    }
}

export default connect(
    (state: ApplicationState) => state.order, // Selects which state properties are merged into the component's props
    OrderStore.actionCreators                 // Selects which action creators are merged into the component's props
)(OrderComponent) as typeof OrderComponent;
