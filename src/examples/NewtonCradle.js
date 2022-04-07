import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import Matter from 'matter-js'

class NewtonCradle extends Component {
  constructor(props) {
    this.start = 360
    this.offset = 90
  }

  render() {
    return (
      <>
        { [0, 1, 2, 3].map(i => {
          let x = this.start + this.offset * i
          return (
            <>
              <Circle
                key={ i }
                id={ `circle-${i}` }
                name={ `circle-${i}` }
                x={ x }
                y={ 700 }
                radius={ 40 }
                physics={ 'float' }
                strokeWidth={ App.strokeWidth }
                stroke={ App.strokeColor }
                fill={ App.fillColorAlpha }
                draggable
              />
              <Line
                key={ i }
                id={ `line-${i}` }
                name={ `line-${i}` }
                physics={ 'constraint' }
                x={ 0 }
                y={ 0 }
                points={ [x, 350, x, 700] }
                strokeWidth={ App.strokeWidth }
                stroke={ App.strokeColor }
              />
            </>
          )
        }) }
        { [4, 5].map(i => {
          let x = (i === 4) ? this.start - this.offset : this.start + this.offset * 4
          return (
            <>
              <Circle
                key={ i }
                id={ `circle-${i}` }
                name={ `circle-${i}` }
                x={ x }
                y={ 700 }
                radius={ 40 }
                physics={ 'float' }
                strokeWidth={ App.strokeWidth }
                stroke={ App.toioStrokeColor }
                fill={ App.toioFillColorAlpha }
                draggable
              />
              <Line
                key={ i }
                id={ `line-${i}` }
                name={ `line-${i}` }
                physics={ 'constraint' }
                x={ 0 }
                y={ 0 }
                points={ [x, 350, x, 700] }
                strokeWidth={ App.strokeWidth }
                stroke={ App.toioStrokeColor }
              />
            </>
          )
        }) }
      </>
    )
  }
}
export default NewtonCradle;