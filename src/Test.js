import React, { Component } from 'react'

class Test extends Component {
  constructor(props) {
    super(props)
    console.log('hoge')
  }

  componentDidMount() {
    console.log('hoge')
  }

  render() {
    return (
      <>
        <h1>Hello World</h1>
      </>
    )
  }
}

export default Test