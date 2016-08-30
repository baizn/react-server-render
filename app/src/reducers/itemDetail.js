
import _ from 'lodash'
import Immutable from 'immutable'
import actionType from '../constants/actionType'
const { LOADED_ITEMS_DETAIL, LOADED_ITEM_USER } = actionType

let defaultState = Immutable.fromJS({
  user: {}
})

export default function(state = defaultState, action) {
  switch(action.type) {
    case LOADED_ITEMS_DETAIL:
      return state.merge(action.response)

    case LOADED_ITEM_USER:
      return state.merge({ user: action.response })

    default:
      return state
  }
}
