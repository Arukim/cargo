﻿import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import * as CustomersStore from '../../store/Customers';

type CustomersProps =
    CustomersStore.CustomersState
    & typeof CustomersStore.actionCreators
    & RouteComponentProps<{}>;

class CustomersComponent extends React.Component<CustomersProps, {}> {
    componentWillMount() {
        this.props.requestCustomers();
    }


    private renderCustomersTable() {
        return <table className='table'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Название</th>
                </tr>
            </thead>
            <tbody>
                {this.props.customers.map(cust =>
                    <tr key={cust.id}>
                        <th scope="row">{cust.id}</th>
                        <td><Link to={`customers/${cust.id}`} className="btn btn-secondary">
                            {cust.name}
                        </Link>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>;
    }

    public render() {
        return <div>
            <h1>Заказчики</h1>
            <Link className="btn btn-success" to='/customers/add'> Добавить заказчика </Link>
            {this.renderCustomersTable()}
        </div>
    }
}

export const Customers = connect(
    (state: ApplicationState) => state.customers, // Selects which state properties are merged into the component's props
    CustomersStore.actionCreators                 // Selects which action creators are merged into the component's props
)(CustomersComponent) as typeof CustomersComponent;