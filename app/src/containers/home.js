import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

@connect(mapStateToProps)
export default class Home extends Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {}
}
