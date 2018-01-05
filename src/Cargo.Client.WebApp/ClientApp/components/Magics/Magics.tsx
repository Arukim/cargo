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
            <div style={{ marginTop: "10px" }}>
                <div className="form-inline">
                    <b> Статус: </b>
                    <label className={"form-control " + (this.props.appCount == 1 ? "label-success" : "label-warning")}>
                        {this.renderState()}
                    </label>
                    <label className="form-control label-info">
                        Моделей загружено: {this.props.status.modelsCount}
                    </label>
                    <label className="form-control label-info">
                        Текущий объём: {this.props.status.modelsVolume} мм2
                </label>
                </div>
                <div className="form-inline">
                    
                    <button
                        className="btn btn-primary"
                        disabled={!this.props.isAvailable}
                        onClick={() => this.props.requestStatus()} > Обновить </button>
                    <Link className="btn btn-success" to={`/batches/new`} > 
                        Завершить
                    </Link>
                </div>
            </div>
        );
    }
}

export const Magics = connect(
    (state: ApplicationState) => state.magics, // Selects which state properties are merged into the component's props
    MagicsStore.actionCreators                 // Selects which action creators are merged into the component's props
)(MagicsComponent);
