import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';

import * as BatchStore from '../../store/Batch';

type EditBatchProps =
    BatchStore.BatchState
    & typeof BatchStore.actionCreators
    & RouteComponentProps<{ id: number }>;

class EditBatchComponent extends React.Component<EditBatchProps, {}>{

    get batchId(): number {
        return this.props.match.params.id;
    }

    componentWillMount() {
        this.props.requestBatch(this.batchId);
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
                            Статус
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.batch.orderParts.map((op, idx) =>
                        <tr key={op.id}>
                            <th scope="row">{idx}</th>
                            <td>{op.id}</td>
                            <td>
                                {op.successfulBatchId == undefined ?
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => this.props.setSuccessfulBatch(op.id, this.batchId)}
                                    > Не готово </button> :
                                    <label>
                                        Готово в {op.successfulBatchId == this.batchId ?
                                            "этой партии" : "партии №" + op.successfulBatchId}
                                    </label>
                                }
                            </td>
                        </tr>
                            )}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <div>
                        <h1> Редактирование партии {this.batchId} </h1>
                        {this.props.isLoading ? "Loading..." :
                            <div>
                                <label>{this.props.batch.filename}</label>
                                {this.renderOrderPartTable()}
                            </div>
                        }
                    </div>
                    );
    }
}

export const EditBatch = connect(
    (state: ApplicationState) => state.batch,
    BatchStore.actionCreators
)(EditBatchComponent) as typeof EditBatchComponent;