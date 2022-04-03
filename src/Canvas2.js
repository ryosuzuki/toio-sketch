import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line } from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'
// import Physics from './Physics'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      mode: 'drawing',
      lines: [],
      currentPoints: [],
      isPhysics: true
    }
  }

  componentDidMount() {
  }

  mouseDown(pos) {
    this.setState({ isPaint: true, currentPoints: [pos.x, pos.y, pos.x, pos.y] })
  }

  mouseMove(pos) {
    if (!this.state.isPaint) return false
    let points = this.state.currentPoints
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return false
    points = points.concat([pos.x, pos.y])
    this.setState({ currentPoints: points })
  }

  mouseUp(pos) {
    this.setState({ isPaint: false })
  }

  render() {
    return (
      <>
        <div style={{ display: debug ? 'block' : 'none' }}>
          <Stage width={ App.size } height={ App.size }>
            <Layer ref={ ref => (this.layer = ref) }>
              <Line
                points={ this.state.currentPoints }
                stroke={ 'black' }
              />
              { this.state.lines.map((line, i) => {
                  return (
                    <Line
                      key={ i }
                      id={ `line-${i}` }
                      name={ `line-${i}` }
                      physics={ line.physics }
                      x={ line.x }
                      y={ line.y }
                      radius={ line.radius }
                      points={ line.points }
                    />
                  )
              })}
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas