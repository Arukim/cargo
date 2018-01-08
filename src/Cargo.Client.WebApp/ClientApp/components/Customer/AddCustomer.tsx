import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import * as AddCustomerStore from '../../store/CustomerAdd';
import { Customer } from '../../models';

type AddCustomerProps =
    AddCustomerStore.CustomerAddState
    & typeof AddCustomerStore.actionCreators
    & RouteComponentProps<{}>;

interface AddCustomerState {
    name: string;
}

class AddCustomerComponent extends React.Component<AddCustomerProps, AddCustomerState>{
    constructor(p: AddCustomerProps) {
        super(p);
        this.state = {
            name: ""
        };
    }

    public render() {
        return (
            <div>
                <legend>Новый заказчик </legend>
                <div className="col-md-4">
                    <div className="form-group row">
                        <label htmlFor="addCustomer-name"
                            className="col-sm-3">Название </label>
                        <div className="col-sm-9">
                            <input id="addCustomer-name" className="form-control"
                                value={this.state.name}
                                onChange={(e) => this.setState({ name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <button className="btn btn-success"
                            disabled={this.state.name.length == 0} >
                            Добавить </button>
                    </div>
                </div>
            </div>
        );
    }
}

export const AddCustomer = connect(
    (state: ApplicationState) => state.customerAdd,
    AddCustomerStore.actionCreators
)(AddCustomerComponent) as typeof AddCustomerComponent;