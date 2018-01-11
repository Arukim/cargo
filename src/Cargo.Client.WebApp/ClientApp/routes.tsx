import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import { Orders, EditOrder } from './components/Order';
import { NewBatch, EditBatch, Batches } from './components/Batch';
import {
    Customers, AddCustomer,
    EditCustomer, AddOrder
} from './components/Customer';

export const routes = <Layout>
    <Route exact path='/' component={Customers} />
    <Route path='/counter' component={Counter} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
    <Route exact path='/orders/:id' component={EditOrder} />
    <Route exact path='/orders' component={Orders}/>
    <Route strict exact path='/batches' component={Batches} />
    <Route strict exact path='/batches/new' component={NewBatch} />
    <Route strict exact path='/batches/:id(\\d+)' component={EditBatch} />
    <Route strict exact path='/customers' component={Customers} />
    <Route strict exact path='/customers/add' component={AddCustomer} />
    <Route strict exact path='/customers/:id(\\d+)' component={EditCustomer} />
    <Route strict exact path='/customers/:id(\\d+)/orders/add' component={AddOrder} />
</Layout>;
