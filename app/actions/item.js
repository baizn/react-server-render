import { CALL_API, CHAIN_API } from 'config/config'
import { LOADED_ITEMS, LOADED_ITEMS_DETAIL, LOADED_ITEM_USER } from 'constants/successType'

export function loadItems() {
    return {
        [CALL_API]: {
            method: 'get',
            path: '/api/items',
            successType: LOADED_ITEMS
        }
    }
}

export function loadItemDetail( { id }) {
    return {
        [CHAIN_API]: [
            () => {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: `/api/items/${id}`,
                        successType: LOADED_ITEMS_DETAIL
                    }
                }
            },

            (item) => {
                return {
                    [CALL_API]: {
                        method: 'get',
                        path: `/api/users/${item.userId}`,
                        successType: LOADED_ITEM_USER
                    }
                }
            }
        ]
    }
}