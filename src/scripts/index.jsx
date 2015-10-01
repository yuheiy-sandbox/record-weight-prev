'use strict';

import React                          from 'react';
import ReactDOM                       from 'react-dom';
import { Router, Route, IndexRoute }  from 'react-router';
import { createHistory }              from 'history';

import App      from './components/App';
import Home     from './components/Home';
import Register from './components/Register';
import Result   from './components/Result';
import NoMatch  from './components/NoMatch';

const production = location.hostname !== 'localhost';

if (production) {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  window.ga('create', 'UA-58638423-5', 'auto');
}

const handleUpdate = () => {
  window.scrollTo(0, 0);

  if (production) {
    ga('send', 'pageview', location.pathname);
  }
};

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} />
    <Route path="register" component={Register} />
    <Route path="result" component={Result} />
    <Route path="*" component={NoMatch} />
  </Route>
);

ReactDOM.render(
  <Router history={createHistory()} routes={routes} onUpdate={handleUpdate} />,
  document.getElementById('app')
);
