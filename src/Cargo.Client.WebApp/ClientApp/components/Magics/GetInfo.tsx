import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as MagicsStore from '../../store/Magics';

interface LoadPartButtonOwnProps {
    orderParts: number[];
    onUpdated: () => void;
}


type GetInfoButtonState =
    LoadPartButtonOwnProps
    & MagicsStore.MagicsState
    & typeof MagicsStore.actionCreators;

class GetInfoComponent extends React.Component<GetInfoButtonState, {}> {

    onClick() {
        this.props.getInfo(this.props.orderParts, this.props.onUpdated);
    }


    public render() {
        return (
            <button
                className={"btn btn-primary"}
                disabled={!this.props.isAvailable || this.props.isLoading}
                onClick={() => this.onClick()}>
                Обновить информацию
            </button>
        );
    }
}

export const GetInfo = connect(
    (state: ApplicationState, own: LoadPartButtonOwnProps) => Object.assign({}, state.magics, own),
    MagicsStore.actionCreators
)(GetInfoComponent);