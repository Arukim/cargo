import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from './../../store';
import { Order, Part } from 'ClientApp/models';
import * as OrderStore from '../../store/Order';

import { LoadPartButton } from '../Magics/LoadPartButton';
import { LoadParts } from '../Magics/LoadParts';
import { GetInfo } from '../Magics/GetInfo';

import { OrderStatusHelper, OrderPartStatusHelper } from '../../logic/statusHelper';

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
        this.refresh();
    }

    private get uniqueOrderParts(): number[] {
        return Array.from(
            new Map(this.props.order
                .orderParts.map<[number, number]>(x => [x.part.id, x.id])
            ).values());
    }

    refresh() {
        this.props.requestOrder(this.props.match.params.id);
    }

    public render() {
        return (
            <div className="container-fluid">
                {this.props.isLoading ? <p> Loading... </p> :

                    <div>
                        <h1>Заказ "{this.order.name}"</h1>

                        <div className="col-md-12 form-inline my-3">
                            <div className="mx-1">
                                <select value={this.props.order.status}
                                    className="form-control"
                                    onChange={x => this.props.updateStatus(this.order.id, x.target.value, () => this.refresh())}>
                                    {Array.from(OrderStatusHelper).map(x =>
                                        <option key={x[0]} value={x[0]}>{x[1]}</option>
                                    )}
                                </select>
                            </div>
                            <div className="mx-1">
                                <LoadParts orderParts={this.uniqueOrderParts} />
                            </div>
                            <div className="mx-1">
                                <GetInfo orderParts={this.uniqueOrderParts}
                                    onUpdated={() => this.props.requestOrder(this.props.match.params.id)}
                                />
                            </div>
                        </div>

                        <div className="col-md-12">
                        </div>

                        <div className="col-md-12">
                            {this.renderOrderParts()}
                        </div>
                    </div>
                }
            </div>);
    }

    private renderPartInfo(part: Part) {
        var p = part.partInfo;

        let toCm = (x: number) => (x / 10).toFixed(1);
        let toCm3 = (x: number) => (x / 1000).toFixed(3);

        return [<td>
            {toCm(p.x)} x {toCm(p.y)} x {toCm(p.z)}
        </td>,
        <td>
            {p.volume < 0 ? <b> {toCm3(p.volume)} </b> : <span> {toCm3(p.volume)} </span>}
        </td>];
    }


    private renderOrderParts() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Название модели</th>
                    <th>Габариты, см</th>
                    <th>Объем, см3</th>
                    <th>Jobs </th>
                    <th>Статус</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                {this.order.orderParts.map((op, idx) =>
                    <tr key={idx}>
                        <th scope="row">{op.id}</th>
                        <td>{op.part.name}</td>
                        {this.renderPartInfo(op.part)}
                        <td>{op.batchOrderParts
                            .map(x => x.batchId)
                            .map(x => <Link key={x} to={`/batches/${x}`}>{x + " "}</Link>)}</td>
                        <td>
                            {OrderPartStatusHelper.get(op.status)}
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
