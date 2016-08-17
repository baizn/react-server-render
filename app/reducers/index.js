import { combineReducers } from 'redux'
import items from 'reducers/items'
import itemDetail from 'reducers/itemDetail'

const rootReducer = combineReducers({
    items, itemDetail
})

export default rootReducer