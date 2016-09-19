import React from 'react';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute } from 'react-router';
import configureStore from 'src/store/configureStore';

import Home from 'src/containers/home';
import DefaultIndex from 'src/containers/default';
import List from 'src/containers/list';
import Item from 'src/containers/item';

export default function(history) {
  return (
    <Router history={history}>
      <Route path="/" component={Home}>
        <Route path="list" component={List} />
        <Route path="item/:id" component={Item} />
        <IndexRoute component={DefaultIndex} />
      </Route>
    </Router>
  );
};
