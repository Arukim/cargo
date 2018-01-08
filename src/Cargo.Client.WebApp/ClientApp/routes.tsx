import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import Order from './components/Order';
import { NewBatch } from './components/Batch/NewBatch';
import { EditBatch } from './components/Batch/EditBatch';
import { Batches } from './components/Batch/Batches';
import { Customers } from './components/Customer/Customers';
import { AddCustomer } from './components/Customer/AddCustomer';
import { EditCustomer } from './components/Customer/EditCustomer';
import { AddOrder } from './components/Customer/AddOrder';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/counter' component={Counter} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
    <Route path='/orders/:id' component={Order} />
    <Route strict exact path='/batches' component={Batches} />
    <Route strict exact path='/batches/new' component={NewBatch} />
    <Route strict exact path='/batches/:id(\\d+)' component={EditBatch} />
    <Route strict exact path='/customers' component={Customers} />
    <Route strict exact path='/customers/add' component={AddCustomer} />
    <Route strict exact path='/customers/:id(\\d+)' component={EditCustomer} />
    <Route strict exact path='/customers/:id(\\d+)/orders/add' component={AddOrder} />
</Layout>;
