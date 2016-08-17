import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { List } from 'immutable'

export default class Item extends Component {
    render() {
        let { navs } = this.props
        let navItems = navs.map( data => {
            return <li>
                <Link to={`home/${data.id}`}>${data.name}</Link>
            </li>
        })

        return (
            <ul>
                { navItems }
            </ul>
        )
    }
}

Item.propTypes = {
    navs: PropTypes.instanceOf(List).isRequired
}