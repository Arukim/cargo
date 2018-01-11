import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as MagicsStore from '../../store/Magics';

// At runtime, Redux will merge together...
type MagicsProps =
    MagicsStore.MagicsState        // ... state we've requested from the Redux store
    & typeof MagicsStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>; // ... plus incoming routing parameters

class MagicsComponent extends React.Component<MagicsProps, {}> {
    private timer: number;
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestAppCount();
    }

    componentDidMount() {
        this.timer = setInterval(() => this.props.requestAppCount(), 1000);
    }

    componentWillUnmout() {
        clearInterval(this.timer)
    }

    public renderState() {
        var status = "";
        switch (this.props.appCount) {
            case 1:
                status = "Magics: запущен";
                break;
            case 0:
                status = "Magics: не запущен";
                break;
            default:
                status = "Magics: открыто несколько приложений";
                break;
        }

        return status;
    }

    public render() {
        return (
            <div className="container-fluid">
                <div className="row justify-content-between">
                    <div className="form-inline col mt-3">
                        <div className="mr-2">
                            <b> Статус: </b>
                        </div>
                        <label className={"form-control mx-1 " + (this.props.appCount == 1 ? "label-success" : "label-warning")}>
                            {this.renderState()}
                        </label>
                        <label className="form-control mx-1 label-info">
                            Моделей загружено: {this.props.status.modelsCount}
                        </label>
                        <label className="form-control mx-1 label-info">
                            Текущий объём: {this.props.status.modelsVolume} мм2
                        </label>
                    </div>
                    <div className="form-inline col-xl-5 align-self-end mt-3">
                        <div className="mr-2">
                            <b> Действия: </b>
                        </div>
                        <button
                            className="btn btn-primary mx-1"
                            disabled={!this.props.isAvailable}
                            onClick={() => this.props.requestStatus()} > Обновить </button>
                        <button
                            className="btn btn-success mx-1"
                            disabled={!this.props.isAvailable}
                            onClick={() => this.props.loadAll()} > Импорт всего </button>
                        <button className="btn btn-warning mx-1"
                            disabled={!this.props.isAvailable}
                            onClick={() => this.props.unloadAll()}> Очистить сцену </button>

                        <Link className="btn btn-success mx-1" to={`/batches/new`} >
                            Создать Job
                    </Link>
                    </div>
                </div >
                <hr />
            </div >
        );
    }
}

export const Magics = connect(
    (state: ApplicationState) => state.magics, // Selects which state properties are merged into the component's props
    MagicsStore.actionCreators                 // Selects which action creators are merged into the component's props
)(MagicsComponent);
