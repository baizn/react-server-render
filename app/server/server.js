import express from 'express'
import path from 'path'

import session from 'express-session'
//import redis from 'connect-redis'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { useRouterHistory, RouterContext, match } from 'react-router'

import { createMemoryHistory, useQueries } from 'history'
import compression from 'compression'
import Promise from 'bluebird'

import serverRoutes from './mockServer'

import configureStore from 'src/store/configureStore'
import createRoutes from 'client/routes'

import { Provider } from 'react-redux'
import config from '../../config'

const { DEFAULT_PORT, DEV_CLIENT_BASE_URL } = config

//let redisStore = redis(session)

let app = express()
let port = process.env.PORT || DEFAULT_PORT

let scriptsUrls
let cssUrls

console.log('NODE_ENV=' + process.env.NODE_ENV)

if ( process.env.NODE_ENV === 'production' ) {
  let refManifest = require('../../dist/rev-manifest.json')
  let jsManifest = require('../../dist/lib_manifest.json')
  var appfest = require('../../dist/assets.json')
  scriptsUrls = [
    `${jsManifest.name}.js`,
    `${appfest.app.js}`
  ]
  cssUrls = `/${refManifest['main.css']}`
} else {
  scriptsUrls = [
    DEV_CLIENT_BASE_URL + '/dev/vendor.js',
    DEV_CLIENT_BASE_URL + '/dev/dev.js',
    DEV_CLIENT_BASE_URL + '/dev/app.js'
  ];
  cssUrls = '/main.css'
}

app.use(session({
  secret: 'keyboardcat',
  resave: false,
  saveUninitialized: true,
  // cookie: {
  //   maxAge: 10*1000
  // }
  //store: new redisStore()
}))

app.use(compression())
app.use(express.static(path.join(__dirname, '../..', 'dist')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(serverRoutes)
// && !req.session.isLogin
app.use((req, res, next)=> {
  let url = req.originalUrl
  if(url !== '/' && !req.session.isLogin) {
    res.redirect('/')
  } else {
    let history = useRouterHistory(useQueries(createMemoryHistory))()
    let store = configureStore()
    let routes = createRoutes(history)
    let location = history.createLocation(req.url)

    match({ routes, location }, (error, redirectLocation, renderProps) => {
      if (redirectLocation) {
        res.redirect(301, redirectLocation.pathname + redirectLocation.search)
      } else if (error) {
        res.status(500).send(error.message)
      } else if (renderProps == null) {
        res.status(404).send('Not found')
      } else {
        debugger
        let reduxPromise = () => {
            let { query, params } = renderProps
            let component = renderProps.components[renderProps.components.length - 1].WrappedComponent       
            let promise = component.fetchData ? 
                component.fetchData({query, params, store, history})
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

        let [ getCurrentUrl, unsubscribe ] = subscribeUrl()
        let reqUrl = location.pathname + location.search

        reduxPromise().then(()=> {
          let initialState = JSON.stringify(store.getState())
          let html = ReactDOMServer.renderToString(
            <Provider store={store}>
              { <RouterContext {...renderProps}/> }
            </Provider>
          );

          if ( getCurrentUrl() === reqUrl ) {
            res.set('Content-Type', 'text/html')
            req.session.isLogin = 'login'
            if(scriptsUrls.length > 2) {
              res.status(200).send(renderFullPage(html, initialState, scriptsUrls, cssUrls))
            } else {
              res.render('index', { html, scriptsUrls, cssUrls, initialState })
            }
          } else {
            res.redirect(302, getCurrentUrl())
          }
          unsubscribe()
        })
        .catch((err)=> {
          unsubscribe()
          next(err)
        })
      }
    })
  }
})

function renderFullPage(renderedContent, initialState, surls, curls) {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="renderer" content="webkit">
        <title>海云数据前端项目</title>
        <meta name="description" content="海云数据前端项目.">
        <meta name="keyword" content="react redux react-router webpack immutable">
        <link rel="stylesheet" href="${curls}"/>
      </head>
      <body>
        <!--[if lt IE 9]>
          <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->
        <div class="top-box" id="container">${renderedContent}</div>
        <script>
          window.__INITIAL_STATE__ = ${initialState}
        </script>
        <script type="text/javascript" charset="utf-8" src="${surls[0]}"></script>
        <script type="text/javascript" charset="utf-8" src="${surls[1]}"></script>
        <script type="text/javascript" charset="utf-8" src="${surls[2]}"></script>
      </body>
    </html>
  `
}

app.use((err, req, res, next)=> {
  console.log(err.stack)
  res.status(500).send('Error 500...')
})

console.log(`Server is listening to port: ${port}`)
app.listen(port)
