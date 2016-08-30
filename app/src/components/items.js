import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { List } from 'immutable'

const styles = {
  ptext: {
    color: '#fff'
  },
  ds: {
    float: 'left',
    paddingLeft: '80px'
  }
}
export default class Items extends Component {
  render() {
    let albums = this.props.items
    return (
      <div>
        {
          albums.map((a)=> {
            let id = a.get('id')
            return (
              <div key={id} style={styles.ds}>
                <p style={styles.ptext}>专辑名：{a.get('name')}</p>
                <Link to={`/item/${id}`}>
                  <img src={a.get('cover')} />
                </Link>
              </div>
            )
          })
        }
      </div>
    )
  }
}

Items.propTypes = {
  items: PropTypes.instanceOf(List).isRequired
}
