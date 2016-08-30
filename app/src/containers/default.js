import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import echarts from 'echarts'
import { loadDefaultChartData } from '../actions/items'
import { Map } from 'immutable'

const styles = {
  h1: {
    color: 'red',
    fontSize: '50px',
    marginTop: '100px'
  },
  a: {
    color: '#fff'
  }
}

function mapStateToProps(state) {
  return {
    chartData: state.charts
  }
}

@connect(mapStateToProps, { loadDefaultChartData })
export default class Default extends Component {
  static fetchData({ store }) {
    return store.dispatch(loadDefaultChartData())
  }

  componentDidMount() {
    this.props.loadDefaultChartData()
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.chartData !== nextProps) {
      const data = nextProps.chartData
      let charts = echarts.init(this.refs.charts)
      charts.setOption({
        title: {
          text: 'Echarts示例'
        },
        xAxis: {
          data: data.get('xData').toArray()
        },
        yAxis: {},
        series: [
          {
            name: '数量',
            type: 'bar',
            data: data.get('yData').toArray()
          }
        ]
      })
    }
  }

  render() {
    return (
      <div className='intro'>
        <h1 style={styles.h1}>示例项目</h1>
        <div ref='charts' style={{width: 600, height: 400}}></div>
        <Link style={styles.a} to='/list'>Next Page(路由)</Link>
      </div>
    );
  }
}