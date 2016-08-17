import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'

function mapStateToProps(state) {
    return {}
}

@connect(mapStateToProps)
export default class DefaultConteiner extends Component {
    render() {
        return (
            <div className='container'>
                <h2>Default Container</h2>
                <Link to='/list'>Demo List</Link>
            </div>
        )
    }
}