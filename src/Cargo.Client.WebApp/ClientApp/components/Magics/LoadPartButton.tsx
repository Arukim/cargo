﻿import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as MagicsStore from '../../store/Magics';

interface LoadPartButtonOwnProps {
    orderPartId: number;
    className? : string;
}


type LoadPartButtonProps =
    LoadPartButtonOwnProps
    & MagicsStore.MagicsState
    & typeof MagicsStore.actionCreators;

class LoadPartButtonComponent extends React.Component<LoadPartButtonProps, {}> {

    get isLoaded(): boolean {
        return this.props.loadedOrderParts.some(x => x == this.props.orderPartId);
    }

    onClick() {
        if (!this.isLoaded) {
            this.props.loadOrderPart(this.props.orderPartId);
        } else {
            this.props.unloadOrderPart(this.props.orderPartId);
        }
    }


    public render() {
        return (
            <button
                className={"btn btn-primary " + this.props.className}
                disabled={!this.props.isAvailable}
                onClick={() => this.onClick()}>
                {!this.isLoaded ? "Загрузить" : "Убрать"}
            </button>
        );
    }
}

export const LoadPartButton = connect(
    (state: ApplicationState, own: LoadPartButtonOwnProps) => Object.assign({}, state.magics, own),
    MagicsStore.actionCreators
)(LoadPartButtonComponent);