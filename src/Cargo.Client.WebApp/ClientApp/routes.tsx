import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './components/Home';
import FetchData from './components/FetchData';
import Counter from './components/Counter';
import Order from './components/Order';
import { NewBatch } from './components/Batch/NewBatch';
import { EditBatch } from './components/Batch/EditBatch';

export const routes = <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/counter' component={Counter} />
    <Route path='/fetchdata/:startDateIndex?' component={FetchData} />
    <Route path='/orders/:id' component={Order} />
    <Route strict exact path='/batches/new' component={NewBatch} />
    <Route strict exact path='/batches/:id(\\d+)' component={EditBatch} />
</Layout>;
