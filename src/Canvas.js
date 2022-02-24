import React, { Component } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva'
import Physics from './Physics'

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this

    this.state = {
      dragging: false,
      currentPoints: [],
      rects: [],
      lines: []
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
    this.setState({ currentPoints: points })
  }

  mouseUp(event) {
    let points = this.state.currentPoints
    let lines = this.state.lines

    let node = new Konva.Line({ points: points })
    let bb = node.getClientRect()
    let x = bb.x + bb.width/2
    let y = bb.y + bb.height/2
    points = points.map((num, i) => {
      return (i % 2 === 0) ? num - x : num - y
    })
    lines.push({
      x: x,
      y: y,
      points: points
    })
    this.setState({ dragging: false, currentPoints: [], lines: lines })
  }


  render() {
    return (
      <>
        <Physics />
        <Stage width={ 1024 } height={ 1024 }>
          <Layer ref={ ref => this.layer = ref }>
            { this.state.rects.map((rect, i) => {
              return (
                <Rect x={rect.x} y={rect.y} width={rect.width} height={rect.height}      offsetX={ rect.width/2 } offsetY={ rect.height/2 } stroke={ 'black' } />
              )
            })}
            <Line
              points={ this.state.currentPoints }
              stroke={ 'black' }
            />
            { this.state.lines.map((line, i) => {
              return (
                <Line
                  id={ `line-${i}` }
                  x={ line.x }
                  y={ line.y }
                  points={ line.points }
                  stroke={ 'red' }
                />
              )
            })}

          </Layer>
        </Stage>
      </>
    )
  }


}

export default Canvas