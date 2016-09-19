import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadItems } from '../actions/items'
import * as actionCreators from '../actions/items'
import { Link } from 'react-router'
import _ from 'lodash'
import Items from '../components/items'
import { bindActionCreators } from 'redux'

function mapStateToProps (state) {
  return { items: state.items }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ListContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '123'
    }
    console.log(this.state)
  }

  componentDidMount() {
    const { loadItems } = this.props.actions
    debugger
    let params = {
      kw: '张学友',
      pi: 1,
      pz: 1
    }
    loadItems(params)
  }
  render() {
    return (
      <div>
        <h2>Item bzn</h2>
        <Items items={this.props.items} />
        <Link to="/">Back to Home</Link>
      </div>
    )
  }
}

