import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

function mapStateToProps(state) {
    return {}
}

@connect(mapStateToProps)
export default class App extends Component {
    render() {
        return (
            <div>{this.props.children}</div>
        )
    }
}

//export default connect(mapStateToProps)(App)