import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';

export class NavMenu extends React.Component<{}, {}> {
    public render() {
        return (
            <div className='navbar navbar-toggleable-sm navbar-inverse bg-inverse'>
                <div className='navbar-header'>
                    <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>Cargo</Link>
                </div>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to={'/customers'} activeClassName='active' className="nav-link">
                                <span className='glyphicon glyphicon-user'></span> Заказчики
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to={'/orders'} activeClassName='active' className="nav-link">
                                <span className='glyphicon glyphicon-home'></span> Заказы
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to={'/batches'} activeClassName='active' className="nav-link">
                                <span className='glyphicon glyphicon-th-list'></span> Jobs
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
