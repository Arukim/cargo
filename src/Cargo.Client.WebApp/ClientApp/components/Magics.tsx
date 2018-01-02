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
    componentWillMount() {
        // This method runs when the component is first added to the page
        this.props.requestStatus();
    }

    public render() {
        return <div>
            {this.props.isLoading ?
                null :
                !this.props.status.isConnected ?
                    <div>
                        <div>Magics не запущен</div>
                        <button onClick={x => this.props.requestStatus()} > Обновить </button>
                    </div>

                    : <div> Magics работает </div>
            }
        </div>;
    }
}

export const Magics = connect(
    (state: ApplicationState) => state.magics, // Selects which state properties are merged into the component's props
    MagicsStore.actionCreators                 // Selects which action creators are merged into the component's props
)(MagicsComponent);
