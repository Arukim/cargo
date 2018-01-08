import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'ClientApp/store';
import * as CustomerStore from '../../store/Customer';
import { Customer } from '../../models';

interface CreatePartComponentOwnProps {
    customerId: number;
}

interface CreatePartComponentState {
    name: string;
}

type CreatePartComponentProps = typeof CustomerStore.actionCreators
    & CreatePartComponentOwnProps;

class CreatePartComponent extends React.Component<CreatePartComponentProps, CreatePartComponentState>{
    constructor(p: CreatePartComponentProps) {
        super(p);
        this.state = {
            name: ""
        };
    }
    fileChooser: HTMLFormElement;

    onFileChange(e: FileList | null) {
        let files = e as FileList;
        new FileReader();
    }

    uploadFile() {
        const formData = new FormData(this.fileChooser);
        fetch(`api/customers/${this.props.customerId}/CreatePart`, {
            method: 'POST',
            body: formData
        }).then(x => {
            this.props.requestCustomer(this.props.customerId);
            this.fileChooser.reset();
            this.setState({ name: "" });
        });
    }

    render() {
        return (
            <div>
                <legend> Создать модель </legend>
                <form formEncType="multipart/form-data"
                    ref={(e) => this.fileChooser = e as HTMLFormElement}>
                    <div className="form-group row">
                        <label htmlFor="createPart-name" className="col-sm-3 col-form-label">
                            Название
                            </label>
                        <div className="col-sm-9">
                            <input
                                id="createPart-name"
                                className="form-control"
                                placeholder="Название, опционально"
                                value={this.state.name}
                                onChange={(e) => this.setState({ name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label htmlFor="createPart-name" className="col-sm-3 col-form-label">
                            Файл модели
                            </label>
                        <div className="col-sm-9">
                            <input
                                className="form-control"
                                type="file" name="file"
                                accept=".stl"
                                defaultValue="Pick model file"
                            ></input>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-12">
                            <input
                                className="btn btn-success"
                                type="button" value="Создать" onClick={() => this.uploadFile()}></input>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export const CreatePart = connect(
    (state: ApplicationState, own: CreatePartComponentOwnProps) => Object.assign({}, own),
    CustomerStore.actionCreators                // Selects which action creators are merged into the component's props
)(CreatePartComponent);