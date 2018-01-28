import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import * as EditCustomerStore from '../../store/CustomerEdit';
import { Customer, CreateOrderModel, FileEntity } from '../../models';

type AddOrderProps =
    EditCustomerStore.CustomerEditState
    & typeof EditCustomerStore.actionCreators
    & RouteComponentProps<{ id: number }>;

interface AddOrderState {
    name: string;
    files: FileEntity[];
}

class AddOrderComponent extends React.Component<AddOrderProps, AddOrderState>
{
    constructor(p: AddOrderProps) {
        super(p);
        this.state = {
            name: "",
            files: []
        };
    }


    componentWillMount() {
        this.props.requestCustomer(this.customerId);
    }

    componentWillReceiveProps(nextProps: AddOrderProps) {
        if (nextProps.newOrderId != null) {
            this.props.history.push(`/orders/${nextProps.newOrderId}`);
        }
    }

    get customerId(): number {
        return this.props.match.params.id;
    }

    onFilesSelected() {
        let elem = document.getElementById("addOrder-files") as any;
        let fileList = elem.files as FileList;
        let files = [];
        for (let i = 0; i < fileList.length; i++) {
            files.push({ file: fileList.item(i), count: 1 });
        }
        elem.value = null;

        this.setState({ files: [...this.state.files, ...files] });
    }

    onSave() {
        var orderModel = {
            name: this.state.name,
            files: this.state.files
        };
        this.props.createOrder(orderModel);
    }

    onRemove(fe: FileEntity) {
        this.setState({ files: this.state.files.filter(x => x != fe) });
    }

    onCountChange(id: number, val: number) {
        let files = this.state.files;
        files[id].count = val;
        this.setState({ files: files });
    }


    public render() {
        return (
            <div>
                {(this.props.isLoading && (this.props.customer != undefined)) ? "Loading..." :
                    <div>
                        <div>
                            <legend>Новый заказ для {this.props.customer.name} </legend>
                        </div>
                        <div className="form col-xl-4">
                            <div className="form-group row">
                                <label htmlFor="addOrder-name" className="col-sm-3 col-form-label">
                                    Название
                            </label>
                                <div className="col-sm-9">
                                    <input
                                        className="form-control"
                                        id="addOrder-name"
                                        value={this.state.name}
                                        onChange={(e) => this.setState({ name: e.target.value })}>
                                    </input>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label htmlFor="createPart-name" className="col-sm-3 col-form-label">
                                    Файлы модели
                            </label>
                                <div className="col-sm-9">
                                    <input
                                        className="form-control"
                                        id="addOrder-files"
                                        type="file" name="file"
                                        multiple
                                        accept=".stl"
                                        defaultValue="Pick model file"
                                        onChange={() => this.onFilesSelected()}
                                    ></input>
                                </div>
                            </div>
                            {this.renderFiles()}
                            <button
                                className="btn btn-success"
                                onClick={() => this.onSave()}
                                disabled={this.state.name.length == 0} >
                                Создать
                            </button>
                        </div>
                    </div>
                }
            </div>
        );
    }
    renderFiles() {
        return (
            <table className='table'>
                <thead>
                    <tr>
                        <th> № </th>
                        <th> Файл </th>
                        <th> </th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.files.map((x, idx) =>
                        <tr key={idx}>
                            <th scope="row">
                                {idx+1}
                            </th>
                            <td scope="row">
                                {x.file.name}
                            </td>
                            <td className="form-inline">
                                <div className="form-group mx-1">
                                    <input type="number"
                                        className="form-control"
                                        value={x.count}
                                        onChange={(e) => this.onCountChange(idx, +e.target.value)}>
                                    </input>
                                </div>
                                <div className="form-group">
                                    <button 
                                        className="btn btn-warning"
                                        onClick={() => this.onRemove(x)} >
                                    Удалить</button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>);
    }
}

export const AddOrder = connect(
    (state: ApplicationState) => state.customerEdit,
    EditCustomerStore.actionCreators
)(AddOrderComponent) as typeof AddOrderComponent;