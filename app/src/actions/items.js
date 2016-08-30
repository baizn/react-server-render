import config from '../../../config'
import actionType from '../constants/actionType'
import requestURL from '../constants/requestURL'
const { LOADED_ITEMS, LOADED_ITEMS_DETAIL, 
  LOADED_ITEM_USER, LOAD_CHART } = actionType
const { LOAD_DEFAULT_CHART_URL, LOAD_ITEMS_URL, 
  LOAD_ITEMDETAIL_URL, LOAD_USER_URL } = requestURL

const { CALL_API, CHAIN_API } = config

export function loadDefaultChartData() {
  return {
    [CALL_API]: {
      method: 'get',
      url: LOAD_DEFAULT_CHART_URL,
      successType: LOAD_CHART
    }
  }
}

export function loadItems(params) {
  return {
    [CALL_API]: {
      method: 'get',
      url: LOAD_ITEMS_URL,
      successType: LOADED_ITEMS,
      query: params
    }
  }
}

export function loadItemDetail ({ id }) {
  return {
    [CHAIN_API]: [
      ()=> {
        return {
          [CALL_API]: {
            method: 'get',
            url: LOAD_ITEMDETAIL_URL + `/${id}`,
            successType: LOADED_ITEMS_DETAIL
          }
        }
      },
      (item) => {
        debugger
        return {
          [CALL_API]: {
            method: 'get',
            url: LOAD_USER_URL + `/${item.id}`,
            successType: LOADED_ITEM_USER
          }
        }
      }
    ]
  }
}
