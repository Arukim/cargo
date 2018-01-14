import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import * as BatchStore from '../../store/Batch';
import * as MagicsStore from '../../store/Magics';
import { OrderPart } from '../../models';
import { OrderPartStatusHelper } from '../../logic/statusHelper';

type EditBatchProps =
    BatchStore.BatchState
    & MagicsStore.MagicsState
    & typeof BatchStore.actionCreators
    & typeof MagicsStore.actionCreators
    & RouteComponentProps<{ id: number }>;

class EditBatchComponent extends React.Component<EditBatchProps, {}>{

    get batchId(): number {
        return this.props.match.params.id;
    }

    componentWillMount() {
        this.props.requestBatch(this.batchId);
    }

    renderOpStatus(op: OrderPart) {
        var result = [<label className="mx-1">{OrderPartStatusHelper.get(op.status)}</label>];
        if (op.status == 'InWork') {
            result.push(<button
                className="btn btn-success mx-1"
                onClick={() => this.props.setSuccessfulBatch(op.id, this.batchId)}
            > Принять </button>);

            result.push(<button
                className="btn btn-warning mx-1"
                onClick={() => this.props.setFailed(op.id, this.batchId)}
            > Забраковать </button>);
        }

        return result;
    }

    groupedParts(): Map<string, number[]> {
        let res = this.props.batch.orderParts.reduce<Map<string, number[]>>((acc, val) => {
            let custName = val.order.customer.name;
            let currValue = acc.get(custName);
            if (currValue) {
                currValue.push(val.part.id);
            } else {
                currValue = [val.part.id];
                acc.set(custName, currValue);
            }
            return acc;
        }, new Map<string, number[]>());

        return res;
    }

    renderOrderPartTable() {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            №
                        </th>
                        <th>
                            Id
                        </th>
                        <th>
                            Деталь
                        </th>
                        <th>
                            Заказ
                        </th>
                        <th>
                            Заказчик
                            </th>
                        <th>
                            Статус
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.batch.orderParts.map((op, idx) =>
                        <tr key={op.id}>
                            <th scope="row">{idx}</th>
                            <td>{op.id}</td>
                            <td>{op.part.name}</td>
                            <td>{op.order.name}</td>
                            <td>{op.order.customer.name} </td>
                            <td>
                                {this.renderOpStatus(op)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    renderControls() {
        let res = [<div></div>];
        this.groupedParts().forEach((v, k) => {
            res.push(
                <button className="btn btn-primary mx-1"
                    onClick={() => this.props.loadOrderParts(v)}
                    disabled={!this.props.isAvailable}
                >{k}</button>
            );
        });
        return res;
    }

    render() {
        return (
            <div>
                {this.props.isLoading ? "Loading..." :
                    <div>
                        <h1> Редактирование "Job" {this.props.batch.name} </h1>
                        <div>{this.renderControls()}</div>
                        <label>{this.props.batch.filename}</label>
                        {this.renderOrderPartTable()}
                    </div>
                }
            </div>
        );
    }
}

export const EditBatch = connect(
    (state: ApplicationState) => Object.assign({}, state.magics, state.batch),
    Object.assign({}, BatchStore.actionCreators, MagicsStore.actionCreators)
)(EditBatchComponent) as typeof EditBatchComponent;