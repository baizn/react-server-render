import _ from 'lodash'
import Immutable from 'immutable'
import actionType from '../constants/actionType'
const { LOAD_CHART } = actionType

let initialState = Immutable.fromJS({})

export default function (state = initialState, action) {
    switch(action.type) {
        case LOAD_CHART:
            return Immutable.fromJS(action.response)
        default:
            return state
    }
}