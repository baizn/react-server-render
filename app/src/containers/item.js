import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadItemDetail } from '../actions/items'
import { bindActionCreators } from 'redux'

const styles = {
  container: {
    width: 235,
    margin: '0 auto',
    marginTop: 120,
    color: '#fff'
  }
}
function mapStateToProps (state) {
  return { item: state.itemDetail }
}

@connect(mapStateToProps, {loadItemDetail})
export default class ItemContainer extends Component {
  componentDidMount() {
    let { id } = this.props.params
    const { loadItemDetail } = this.props
    loadItemDetail({id})
  }
  render() {
    let { item } = this.props
    return (
      <div style={styles.container}>
        <h2>专辑详情</h2>
        <p>名称：{ item.get('name') }</p>
        <p>发行时间: {item.get('releaseDate')} </p>
        <p>类型： {item.get('type')}</p>
        <img src={item.get('cover')} />
      </div>
    )
  }
}

