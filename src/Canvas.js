import React, { Component } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva'


class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this

    this.state = {
      dragging: false,
      currentPoints: []
    }
  }

  componentDidMount() {

    document.addEventListener('mousedown', this.mouseDown.bind(this))
    document.addEventListener('mousemove', this.mouseMove.bind(this))
    document.addEventListener('mouseup', this.mouseUp.bind(this))
  }

  mouseDown(event) {
    this.setState({ dragging: true })
    this.setState({ currentPoints: [] })
  }

  mouseMove(event) {
    if (!this.state.dragging) return false
    let points = this.state.currentPoints
    let x = event.clientX
    let y = event.clientY
    points = points.concat([x, y])
    console.log(points)
    this.setState({ currentPoints: points })
  }

  mouseUp(event) {
    this.setState({ dragging: false })
  }


  render() {
    return (
      <Stage width={ 1024 } height={ 1024 }>
        <Layer>
          <Rect x={100} y={100} width={100} height={100} stroke={ 'black' } />
          <Line
            points={ this.state.currentPoints }
            stroke={ 'black' }
          />
        </Layer>
      </Stage>
    )
  }


}

export default Canvas