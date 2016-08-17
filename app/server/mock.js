import _ from 'lodash'

function item(id) {
    let itemContent = 'Item content'
    return {
        id,
        content: `item-${id}: ${itemContent}`,
        user_id: id
    }
}

export const items = _.range(1, 10).map(i => item(i))