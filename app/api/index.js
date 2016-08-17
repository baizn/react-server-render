import superAgent from 'superagent'
import Promise, { using } from 'bluebird'
import assign from 'object-assign'
import _ from 'lodash'
import { CALL_API, CHAIN_API, API_BASE_URL } from 'config'
import { camelizeKeys } from 'humps'
import { LOADED_ITEMS, LOADED_ITEMS_DETAIL, LOADED_ITEM_USER } from 'constants/successType'

export default ( { dispatch, getState }) => next => action => {
    if(action[CALL_API]) {
        return dispatch({
            [CHAIN_API]: [
                () => action
            ]
        })
    }

    let deferred = Promise.defer()

    if(!action[CHAIN_API]) {
        return next(action)
    }

    let promiseCreators = action[CHAIN_API].map( apiActionCreator => {
        return createRequestPromise(apiActionCreator, next, getState, dispatch)
    })

    let promiseResolve = promiseCreators.reduce( (promise, creator) => {
        return promise.then(body => {
            return creator(body)
        })
    }, Promise.resolve())

    promiseResolve.finally( () => {
        deferred.resolve()
    }).catch( () => {})

    return deferred.promise
}

function actionWith(action, obj) {
    let otherObj = assign({}, action, obj)
    delete otherObj[CALL_API]
    return otherObj
}

function createRequestPromise(apiActionCreator, next, getState, dispatch) {
    return (preBody) => {
        let apiAction = apiActionCreator(preBody)
        let deferred = Promise.defer()
        let params = extractParams(apiAction[CALL_API])

        superAgent[params.method](params.url)
            .send(params.body)
            .query(params.query)
            .end( (err, res) => {
                if(err) {
                    if(params.errorType) {
                        dispatch(actionWith(apiAction, {
                            type: params.errorType,
                            error: err
                        }))
                    }

                    if(_.isFunction(params.afterError)) {
                        params.afterError(getState)
                    }
                    deferred.reject()
                } else {
                    let resBody = camelizeKeys(res.body)
                    dispatch(actionWith(apiAction, {
                        type: params.successType,
                        response: resBody
                    }))

                    if(_.isFunction(params.afterSuccess)) {
                        params.afterSuccess({ getState })
                    }
                    deferred.resolve(resBody)
                }
            })
        return deferred.promise 
    }
}

function extractParams(callApi) {
    let {
        method,
        query,
        path,
        body,
        successType,
        errorType,
        afterSuccess,
        afterError
    } = callApi

    let url = `${API_BASE_URL}${path}`

    return {
        method,
        query,
        url,
        body,
        successType,
        errorType,
        afterSuccess,
        afterError
    }
}
