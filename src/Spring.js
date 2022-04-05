import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import Matter from 'matter-js'

class Spring extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  calculatePoints() {
    // https://github.com/liabru/matter-js/blob/master/src/render/Render.js#L661-L680
    let start = this.props.start
    let end = this.props.end
    let length = this.props.length

    let points = []
    points.push(start.x)
    points.push(start.y)

    let delta = Matter.Vector.sub(end, start)
    let normal = Matter.Vector.perp(Matter.Vector.normalise(delta))
    let coils = Math.ceil(Matter.Common.clamp(length / 5, 12, 20))
    let offset
    for (let i = 1; i < coils; i += 1)  {
      offset = i % 2 === 0 ? 1 : -1
      points.push(
        start.x + delta.x * (i / coils) + normal.x + offset * 4,
        start.y + delta.y * (i / coils) + normal.y + offset * 4,
      )
    }
    points.push(end.x)
    points.push(end.y)
    return points
  }

  render() {
    return (
      <>
        <Line
          key={ this.props.key }
          id={ this.props.id }
          name={ this.props.name }
          physics={ this.props.physics }
          x={ this.props.x }
          y={ this.props.y }
          length={ this.props.length }
          points={ this.calculatePoints() }
          strokeWidth={ this.props.strokeWidth }
          stroke={ this.props.stroke }
          draggable
          onClick={ this.props.onClick }
          onTap={ this.props.onTap }
        />
      </>
    )
  }
}

export default Spring