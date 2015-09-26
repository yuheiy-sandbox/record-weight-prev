'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import { Router, Route, IndexRoute }  from 'react-router';
import { createHistory }              from 'history';

import Application  from './components/Application';
import Home         from './components/Home';
import Register     from './components/Register';
import Confirm      from './components/Confirm';
import NoMatch      from './components/NoMatch';

const routes = (
  <Route path="/" component={Application}>
    <IndexRoute component={Home} />
    <Route path="register" component={Register} />
    <Route path="confirm" component={Confirm} />
    <Route path="*" component={NoMatch} />
  </Route>
);

ReactDOM.render(
  <Router history={createHistory()} routes={routes} />,
  document.getElementById('app')
);
