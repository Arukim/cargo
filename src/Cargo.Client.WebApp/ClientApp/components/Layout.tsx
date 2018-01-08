import * as React from 'react';
import { NavMenu } from './NavMenu';
import { Magics } from "./Magics/Magics";
import { ApplicationState } from '../store';


export class Layout extends React.Component<{}, {}> {
    public render() {
        return <div className=''>

            <header>
                <NavMenu />
            </header>
            <div className='container-fluid'>
                <div className=''>
                    <div className=''>
                        <Magics />
                    </div>
                    <div className=''>
                        {this.props.children}
                    </div>
                </div>
            </div>
        </div>;
    }
}
