import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import * as EditCustomerStore from '../../store/CustomerEdit';
import { Customer } from '../../models';

type EditCustomerProps =
    EditCustomerStore.CustomerEditState
    & typeof EditCustomerStore.actionCreators
    & RouteComponentProps<{ id: number }>;

class EditCustomerComponent extends React.Component<EditCustomerProps, {}>
{
    componentWillMount() {
        this.props.requestCustomer(this.customerId);
    }

    get customerId(): number {
        return this.props.match.params.id;
    }

    public render() {
        return (
            <div>
                {(this.props.isLoading && (this.props.customer != undefined)) ? "Loading..." :
                    <div>
                        <legend>Заказчик {this.props.customer.name} </legend>
                        <Link className="btn btn-success"
                            to={`/customers/${this.customerId}/orders/add`}>
                            Новый заказ
                        </Link>
                    </div>
                }
            </div>
        );
    }
}

export const EditCustomer = connect(
    (state: ApplicationState) => state.customerEdit,
    EditCustomerStore.actionCreators
)(EditCustomerComponent) as typeof EditCustomerComponent;