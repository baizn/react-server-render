
import Immutable from 'immutable'
import actionType  from '../constants/actionType'
const { LOADED_ITEMS } = actionType

let defaultState = Immutable.fromJS([])
export default function (state = defaultState, action) {
  switch(action.type) {
    case LOADED_ITEMS:
      return Immutable.fromJS(action.response)
    default:
      return state
  }
}
