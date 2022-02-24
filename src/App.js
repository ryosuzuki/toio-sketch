import React, { Component } from 'react'
import './App.css'
import Canvas from './Canvas'
import { io } from 'socket.io-client'


class App extends Component {
  constructor(props) {
    super(props)
    window.App = this
    this.socket = io('http://localhost:4000/')

  }

  componentDidMount() {

  }

  render() {

    return (
      <Canvas />
    )
  }


}

export default App