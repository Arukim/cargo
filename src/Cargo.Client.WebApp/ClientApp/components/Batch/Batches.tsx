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
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            Id
                            </th>
                        <th>
                            Название
                            </th>
                        <th>
                            Файл
                            </th>
                        <th>
                            Действия
                            </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.batches.map(b =>
                        <tr key={b.id}>
                            <th scope="row">{b.id}</th>
                            <td>{b.name}</td>
                            <td>{b.filename}</td>
                            <td>
                                <Link className="btn btn-secondary mx-1" to={`/batches/${b.id}`}> Изменить </Link>
                                <button className="btn btn-warning mx-1" onClick={() => this.props.deleteBatch(b.id)} >
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
                <h1> Список Jobs </h1>
                {this.props.isLoading ? "Loading..." : this.renderBatchesTable()}
            </div>
        );
    }
}

export const Batches = connect(
    (state: ApplicationState) => state.batches,
    BatchesStore.actionCreators
)(BatchesComponent) as typeof BatchesComponent