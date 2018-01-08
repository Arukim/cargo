import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import { Customer, Part } from '../../models';
import * as CustomerStore from '../../store/CustomerEdit';

interface AddOrderPartOwnProps {
    customerId: number;
    onAddOrderPart: (partId: number, count: number) => void;
}

interface AddOrderPartState {
    selectedPart: number;
    count: number;
}

// At runtime, Redux will merge together...
type AddOrderProps =
    CustomerStore.CustomerEditState // ... state we've requested from the Redux store
    & typeof CustomerStore.actionCreators
    & AddOrderPartOwnProps;     // ... plus action creators we've requested

class AddOrderPartComponent extends React.Component<AddOrderProps, AddOrderPartState> {

    constructor(p: AddOrderProps) {
        super(p);
        this.state = {
            selectedPart: -1,
            count: 1
        };
    }

    private get customer(): Customer {
        return this.props.customer as Customer;
    }

    componentWillMount() {
        this.props.requestCustomer(this.props.customerId);
    }

    componentWillReceiveProps(nextProps: AddOrderProps) {
        if (this.state.selectedPart == -1 && nextProps.customer != undefined) {
            this.setState({ selectedPart: nextProps.customer.parts[0].id });
        }
    }

    onAdd() {
        var part = this.customer.parts.find(p => p.id == this.state.selectedPart) as Part;
        this.props.onAddOrderPart(part.id, this.state.count);
    }

    render() {
        return (
            <div>
                {this.props.isLoading ? <p> Loading... </p> :
                    <div>
                        <legend> Добавить модель </legend>
                        <div className="form-group row">
                            <label htmlFor="addOrderPart-partSelect" className="col-sm-3 col-form-label">
                                Модель
                            </label>
                            <div className="col-sm-9">
                                <select
                                    className="form-control"
                                    id="addOrderPart-partSelect"
                                    value={this.state.selectedPart}
                                    onChange={(x) => this.setState({ selectedPart: +x.target.value })}>
                                    {this.customer.parts.map((p, idx) =>
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor="addOrderPart-count" className="col-sm-3 col-form-label">
                                Количество
                            </label>
                            <div className="col-sm-9">
                                <input type="number"
                                    className="form-control"
                                    id="addOrderPart-count"
                                    min={1}
                                    value={this.state.count}
                                    onChange={x => this.setState({ count: +x.target.value })}
                                ></input>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-sm-12">
                                <button
                                    className="btn btn-success"
                                    onClick={() => this.onAdd()}> Добавить </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export const AddOrderPart = connect(
    (state: ApplicationState, own: AddOrderPartOwnProps) => Object.assign({}, state.customerEdit, own), // Selects which state properties are merged into the component's props
    CustomerStore.actionCreators                // Selects which action creators are merged into the component's props
)(AddOrderPartComponent);