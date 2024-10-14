import React, { Component } from 'react'
import spinner from './weatherloader.gif'

export default class Spinnner extends Component {
  render() {
    return (
      <>
      <div className="text-center my-5" >
      <img src={spinner} alt="spinner" style={{height: '100%', width: '100%',marginTop:"-200px"}}/>
      </div>
      </>
    )
  }
}
