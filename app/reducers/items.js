import * as ActionType from 'actions/item'
import { LOADED_ITEMS, LOADED_ITEMS_DETAIL } from 'constants/successType'
import Immutable from 'immutable'

let defaultState = Immutable.fromJS([])

function itemReducer(state = defaultState, action) {
    switch (action.type) {
        case LOADED_ITEMS:
            return Immutable.fromJS(action.response)
        default:
            return state
    }
}

export default itemReducer