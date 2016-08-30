import { combineReducers } from 'redux'
import charts from './charts'
import items from './items'
import itemDetail from './itemDetail'

const rootReducer = combineReducers({
  charts,
  items,
  itemDetail
});

export default rootReducer;
