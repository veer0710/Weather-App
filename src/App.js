import React, { Component } from 'react'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Weather from './Components/Weather'
import './App.css'


export default class App extends Component {
  render() {
    return (
      <>
      <Navbar/>
      <Weather/>
      </>
    )
  }
}
