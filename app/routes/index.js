import React from 'react'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import configureStore from 'store/configureStore'

import App from 'containers/app'
import DefaultContainer from 'containers/defaultContainer'
import Item from 'containers/item'
import ItemContainer from 'containers/itemContainer'

export default function (history) {
    return (
        <Router history={history}>
            <Route path='/' component={App}>
                <IndexRoute component={DefaultContainer} />
                <Route path='items' component={ItemContainer} />
                <Route path='items/:id' component={Item} />
            </Route>
        </Router>
    )
}