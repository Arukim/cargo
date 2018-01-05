import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from './../../store';
import { Order } from 'ClientApp/models';
import * as OrderStore from '../../store/Order';

import { AddOrderPart } from './AddOrderPart';
import { CreatePart } from './CreatePart';

import { LoadPartButton } from '../Magics/LoadPartButton';

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
            <div className="row">
                {this.props.isLoading ? <p> Loading... </p> :

                    <div>
                        <h1>Заказ {this.order.name}</h1>

                        <div className="col-xs-4">
                            <AddOrderPart
                                customerId={this.order.customer.id}
                                onAddOrderPart={(partId, count) =>
                                    this.props.addOrderPart(this.order.id, partId, count)}
                            />
                        </div>
                        <div className="col-xs-4">
                            <CreatePart
                                customerId={this.order.customer.id}
                            />
                        </div>
                        <div className="col-lg-12">
                            {this.renderOrderParts()}
                        </div>
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
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {this.order.orderParts.map((op, idx) =>
                    <tr key={idx}>
                        <td>{op.id}</td>
                        <td>{op.part.name}</td>
                        <td>
                            <div className="btn-group">
                                <LoadPartButton orderPartId={op.id} />
                                <button className="btn btn-warning"
                                    onClick={() => this.props.removeOrderParts(this.order.id, [op.id])}>
                                    Удалить
                                    </button>
                            </div>
                        </td>
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
