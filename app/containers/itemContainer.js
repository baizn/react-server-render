import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadItems } from 'actions/item'
import { Link } from 'react-router'
import _ from 'lodash'
import Items from 'components/item'

function mapStateToProps(state) {
    return {
        items: state.items
    }
}

@connect(mapStateToProps, { loadItems })
export default class ItemContainer extends Component {
    static fetchData({ store }) {
        return store.dispatch(loadItems())
    }

    componentDidMount() {
        this.props.loadItems()
    }

    render() {
        return (
            <div>
                <h2>Items</h2>
                <Items navs={this.props.items}></Items>
                <Link to='/'>You can back</Link>
            </div>
        )
    }
}

export { ItemContainer }