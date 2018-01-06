import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import * as BatchesStore from '../../store/Batches';

type BatchesProps =
    BatchesStore.BatchesState
    & typeof BatchesStore.actionCreators
    & RouteComponentProps<{}>;

class BatchesComponent extends React.Component<BatchesProps, {}> {
    componentWillMount() {
        this.props.requestBatches();
    }

    renderBatchesTable() {
        return (
            <table className="table row">
                <thead>
                    <tr>
                        <th>
                            Id
                            </th>
                        <th>
                            Название
                            </th>
                        <th>
                            Действия
                            </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.batches.map(b =>
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.name}</td>
                            <td>
                                <Link className="btn btn-default" to={`/batches/${b.id}`}> Изменить </Link>
                                <button className="btn btn-warning" onClick={() => this.props.deleteBatch(b.id)} >
                                    Удалить
                                </button>
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
                <h1> Список партий </h1>
                {this.props.isLoading ? "Loading..." : this.renderBatchesTable()}
            </div>
        );
    }
}

export const Batches = connect(
    (state: ApplicationState) => state.batches,
    BatchesStore.actionCreators
)(BatchesComponent) as typeof BatchesComponent