import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadItemDetail } from 'actions/item'

function mapStateToProps(state) {
    return {
        item: state.itemDetail
    }
}

@connect(mapStateToProps, { loadItemDetail })
export default class Item extends Component {
    static fetchData( { store, params }) {
        const { id } = params
        return store.dispatch(loadItemDetail({id}))
    }

    componentDidMount() {
        const { id } = this.props.params
        this.props.loadItemDetail({id})
    }

    render() {
        let { item } = this.props
        return (
            <div>
                <h2>{item.get('content')}</h2>
                <h3>Name: {item.getIn(['user', 'name'])}</h3>
            </div>
        )
    }
}

Item.propTypes = {
    item: PropTypes.object.isRequired
}

export { Item }