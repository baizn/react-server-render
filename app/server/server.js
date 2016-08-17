import express from 'express'
import path from 'path'
import React from 'react'
import ReactDomServer from 'react-dom/server'
import { useRouteHistory, RouterContext, match } from 'react-router'
import { createMemoryHistory, useQueries } from 'hisotry'
import compression from 'compression'
import Promise from 'bluebird'

import configureStore from 'store/configureStore'
import feRoutes from 'routes/index'

import { Provider } from 'react-redux'

let app = express()
let port = process.env.PORT || 3000
let scriptsUrls;
let cssUrls;

if(process.env.NODE_ENV === 'production') {
    let assets = require('../../dist/webpack-assets.json')
    let refMainCss = require('../../dist/rev-mainfest.json')

    scriptsUrls = [
        `/${assets.vendor.js}`,
        `/${assets.app.js}`
    ]
    cssUrls = `/${refMainCss['main.css']}`
} else {
    scriptsUrls = [
        'http://location:3000/static/vendor.js',
        'http://location:3000/static/dev.js',
        'http://location:3000/static/app.js'
    ]
    cssUrls = '/main.css'
}

app.use(compression())
app.use(express.static(path.join(__dirname, '../..', 'dist')))
app.set('views', path.join(__dirname, 'page'))
app.set('view engine', 'ejs')

//call api
app.get('/api/items', (req, res) => {
    let { items } = require('./mock_api')
    res.send(items)
})

app.use( (req, res, next) => {
    let hisotry = useRouteHistory(useQueries(createMemoryHistory))()
    let store = configureStore()
    let routes = feRoutes(hisotry)
    let location = hisotry.createLocation(req.url)

    match({routes, location}, (err, redirectLocation, renderProps) => {
        if(redirectLocation) {
            res.redirect(301, redirectLocation.pathname + redirectLocation.search)
        } else if(err) {
            res.status(500).send(err.message)
        } else if(renderProps == null) {
            res.status(404).send('Not Found')
        } else {
            let reduxPromise = () => {
                let { query, params } = renderProps
                let component = renderProps.components[renderProps.components.length - 1].WrappedComponent
                let promise = component.fetchData ? 
                    component.fetchData({query, params, store, hisotry})
                    :
                    Promise.resolve()
                
                return promise
            }

            let subscribeUrl = () => {
                let currentUrl = location.pathname + location.search
                let unsubscribe = history.listen( (newLocation) => {
                    if(newLocation.action === 'PUSH') {
                        currentUrl = newLocation.pathname + newLocation.search
                    }
                })

                return [
                    () => currentUrl,
                    unsubscribe
                ]
            }

            let [ currentUrl, unsubscribe ] = subscribeUrl()
            let reqUrl = location.pathname + location.search
             reduxPromise().then( () => {
                let initialState = encodeURI(JSON.stringify(store.getState()))
                let html = ReactDomServer.renderToString(
                    <Provider store={store}>
                        {
                            <RouterContext {...renderProps} />
                        }
                    </Provider>
                )

                if(currentUrl() === reqUrl) {
                    res.render('index', { html, scriptsUrls, cssUrls, initialState })
                } else {
                    res.redirect(302, currentUrl())
                }

                unsubscribe()
             }).catch( err => {
                 unsubscribe()
                 next(err)
             })
        }
    })
})

app.use((err, req, res, next) => {
    res.status(500).send('err:' + err.stack)
})

app.listen(port, function(err) {
    if(err) return
    console.log('Server is listening to port:' + port)
})