import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as MagicsStore from '../store/Magics';

// At runtime, Redux will merge together...
type MagicsProps =
    MagicsStore.MagicsState        // ... state we've requested from the Redux store
    & typeof MagicsStore.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{}>; // ... plus incoming routing parameters

class MagicsComponent extends React.Component<MagicsProps, {}> {
    private timer: number;
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestStatus();
    }

    componentDidMount() {
        this.timer = setInterval(() => this.props.requestStatus(), 1000);
    }

    componentWillUnmout() {
        clearInterval(this.timer)
    }

    public renderState() {
        var status = "";
        switch (this.props.status.state) {
            case "OK":
                status = "Magics: запущен";
                break;
            case "OFFLINE":
                status = "Magics: не запущен";
                break;
            case "MANY":
                status = "Magics: открыто несколько приложений";
                break;
        }

        return (<div className={this.props.status.state == "OK" ? "" : "error"} >
            {status}
        </div>);
    }

    public render() {
        return <div>
            {this.renderState()}
            <div>
                Моделей загружено: {this.props.status.modelsCount}
            </div>
            <div>
                Текущий объём: {this.props.status.modelsVolume} мм2
            </div>
        </div>;
    }
}

export const Magics = connect(
    (state: ApplicationState) => state.magics, // Selects which state properties are merged into the component's props
    MagicsStore.actionCreators                 // Selects which action creators are merged into the component's props
)(MagicsComponent);
