import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import { Customer } from '../../models';
import * as CustomerStore from '../../store/Customer';

interface AddOrderPartOwnProps {
    customerId: number;
}

interface AddOrderPartState {
    selectedPart: number;
}

// At runtime, Redux will merge together...
type AddOrderProps =
    CustomerStore.CustomerState // ... state we've requested from the Redux store
    & typeof CustomerStore.actionCreators
    & AddOrderPartOwnProps;     // ... plus action creators we've requested

class AddOrderPartComponent extends React.Component<AddOrderProps, AddOrderPartState> {

    constructor(p: AddOrderProps) {
        super(p);
        this.state = {
            selectedPart: -1
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

    render() {
        return (
            <div>
                {this.props.isLoading ? <p> Loading... </p> :
                    <div>
                        <div>
                            <select value={this.state.selectedPart} onChange={(x) => this.setState({ selectedPart: +x.target.value })}>
                                {this.customer.parts.map(p =>
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <button> Добавить </button>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export const AddOrderPart = connect(
    (state: ApplicationState, own: AddOrderPartOwnProps) => Object.assign({}, state.customer, own), // Selects which state properties are merged into the component's props
    CustomerStore.actionCreators                // Selects which action creators are merged into the component's props
)(AddOrderPartComponent);