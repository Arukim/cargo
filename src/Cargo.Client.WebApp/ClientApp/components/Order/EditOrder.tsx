import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from './../../store';
import { Order } from 'ClientApp/models';
import * as OrderStore from '../../store/Order';

import { LoadPartButton } from '../Magics/LoadPartButton';
import { LoadParts } from '../Magics/LoadParts';

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

    private get uniqueOrderParts(): number[] {
        return Array.from(
            new Map(this.props.order
                .orderParts.map<[number, number]>(x => [x.part.id, x.id])
            ).values());
    }

    public render() {
        return (
            <div className="container-fluid">
                {this.props.isLoading ? <p> Loading... </p> :

                    <div>
                        <h1>Заказ "{this.order.name}"</h1>

                        <div className="col-md-12">
                            <LoadParts orderParts={this.uniqueOrderParts} />
                        </div>

                        <div className="col-md-12">
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
                    <th>Партии </th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {this.order.orderParts.map((op, idx) =>
                    <tr key={idx}>
                        <th scope="row">{op.id}</th>
                        <td>{op.part.name}</td>
                        <td>{op.batchOrderParts
                            .map(x => x.batchId)
                            .map(x => <Link key={x} to={`/batches/${x}`}>{x + " "}</Link>)}</td>
                        <td>
                            {op.successfulBatchId == undefined ? "Не готово" :
                                <Link to={`/batches/${op.successfulBatchId}`} className="btn btn-secondary" >
                                    Готово в партии № {op.successfulBatchId}
                                </Link>
                            }
                        </td>
                        <td>
                            <div>
                                <LoadPartButton className="mx-1" orderPartId={op.id} />
                                <button className="btn btn-warning mx-1"
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

export const EditOrder = connect(
    (state: ApplicationState) => state.order, // Selects which state properties are merged into the component's props
    OrderStore.actionCreators                 // Selects which action creators are merged into the component's props
)(OrderComponent) as typeof OrderComponent;
