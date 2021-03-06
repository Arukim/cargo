﻿import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as MagicsStore from '../../store/Magics';

interface LoadPartButtonOwnProps {
	orderParts: number[];
	text?: string;
}


type LoadPartsButtonState =
    LoadPartButtonOwnProps
    & MagicsStore.MagicsState
    & typeof MagicsStore.actionCreators;

class LoadPartsComponent extends React.Component<LoadPartsButtonState, {}> {

    onClick() {
        this.props.loadOrderParts(this.props.orderParts);
    }


    public render() {
        return (
            <button
                className={"btn btn-primary"}
                disabled={!this.props.isAvailable}
				onClick={() => this.onClick()}>
				{this.props.text || "Просмотр моделей"}
            </button>
        );
    }
}

export const LoadParts = connect(
    (state: ApplicationState, own: LoadPartButtonOwnProps) => Object.assign({}, state.magics, own),
    MagicsStore.actionCreators
)(LoadPartsComponent);