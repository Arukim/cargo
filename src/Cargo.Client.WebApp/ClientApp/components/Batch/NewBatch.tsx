import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import * as MagicsStore from '../../store/Magics';
import * as OrderPartsStore from '../../store/OrderParts';
import * as BatchStore from '../../store/Batch';

interface StoreProps {
    magics: MagicsStore.MagicsState;
    orderParts: OrderPartsStore.OrderPartsState;
    batch: BatchStore.BatchState;
}


type NewBatchProps =
    StoreProps // ... state we've requested from the Redux store
    & typeof OrderPartsStore.actionCreators
    & typeof BatchStore.actionCreators
    & RouteComponentProps<{}>;

interface NewBatchState {
    name: string;
}

class NewBatchComponent extends React.Component<NewBatchProps, NewBatchState>{
    private isInited: boolean;

    constructor(p: NewBatchProps) {
        super(p);
        this.state = {
            name: ""
        };
    }

    componentWillMount() {
        this.isInited = true;
        this.props.startNewBatch();
        this.props.requestOrderParts(this.props.magics.loadedOrderParts);
    }

    componentWillReceiveProps(nextProps: NewBatchProps) {
        if (this.isInited && nextProps.batch.newBatchId != null) {
            this.props.history.push(`/batches/${nextProps.batch.newBatchId}`);
        }
    }

    onSave() {
        var newBatch = {
            name: this.state.name,
            orderPartIds: this.props.magics.loadedOrderParts
        };

        this.props.createBatch(newBatch);
    }

    public render() {
        return (
            <div className="row">
                <h1> Новая партия </h1>
                <div className="col-lg-4">
                    <div className="form-group row">
                        <div className="col-lg-9">
                            <input
                                className="form-control"
                                id="newBatch-name"
                                value={this.state.name}
                                placeholder="Введите название"
                                onChange={(x) => this.setState({ name: x.target.value })}>
                            </input>
                        </div>
                    </div>
                    <div className="form-group row">
                        <button className="btn btn-success" onClick={() => this.onSave()} > Сохранить</button>
                    </div>
                </div>
                <div className="col-lg-12">
                    {this.renderOrderPartsTable()}
                </div>
            </div>
        );
    }

    public renderOrderPartsTable() {
        return (
            <table className="table row">
                <thead>
                    <tr>
                        <th> № </th>
                        <th> Id </th>
                        <th> Заказ </th>
                        <th> Заказчик </th>
                        <th> Деталь </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.orderParts.orderParts.map((op, idx) =>
                        <tr key={op.id}>
                            <td>{idx}</td>
                            <td>{op.id}</td>
                            <td>{op.order.name} </td>
                            <td>{op.order.customer.name} </td>
                            <td>{op.part.name} </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}

export const NewBatch = connect(
    (state: ApplicationState) => ({
        magics: state.magics, orderParts: state.orderParts, batch: state.batch
    }),
    { ...BatchStore.actionCreators, ...OrderPartsStore.actionCreators }
)(NewBatchComponent) as typeof NewBatchComponent;