import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import { Html, Portal } from 'react-konva-utils';
import Konva from 'konva'
import _ from 'lodash'
import pasition from 'pasition'

import Physics from './Physics2'
import Transform from './Transform'

import ContextMenu from './ContextMenu'

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
      shapes: [],
      currentPoints: [],
      currentPaths: [],
      currentId: -1,
      isPhysics: true,
      event: {},
      menuPos: { x: -100, y: -100 }
    }
  }

  componentDidMount() {
    this.stage = Konva.stages[0]
  }

  mouseDown(pos) {
    let event = {
      clientX: pos.x,
      clientY: pos.y,
      type: 'mousedown'
    }
    this.stage._pointerdown(event)
  }

  mouseMove(pos) {
    let event = {
      clientX: pos.x,
      clientY: pos.y,
      type: 'mousemove'
    }
    this.stage._pointermove(event)
    Konva.DD._drag(event)
  }

  mouseUp(pos) {
    let event = {
      clientX: pos.x,
      clientY: pos.y,
      type: 'mouseup'
    }
    Konva.DD._endDragBefore(event)
    this.stage._pointerup(event)
    Konva.DD._endDragAfter(event)
  }

  stageMouseDown(event) {
    console.log(event)
    this.setState({ event: event })
    if (event.target !== this.stage) return
    let pos = this.stage.getPointerPosition()
    this.setState({ isPaint: true, currentPoints: [pos.x, pos.y, pos.x, pos.y] })
  }

  stageMouseMove(event) {
    this.setState({ event: event })
    let pos = this.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    let points = this.state.currentPoints
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return false
    points = points.concat([pos.x, pos.y])
    this.setState({ currentPoints: points })
  }

  stageMouseUp(event) {
    this.setState({ event: event })
    let pos = this.stage.getPointerPosition()
    if (!this.state.isPaint) return false
    this.setState({ isPaint: false })
    if (this.state.currentPoints.length === 0) return false
    let lines = this.state.lines
    let physics = (this.state.isPhysics && this.state.mode === 'drawing')
    /*
    let x = 0, y = 0, radius = Math.min(bb.width, bb.height)
    let line = {
      x: x,
      y: y,
      points: points,
      type: this.state.mode,
      physics: physics,
    }
    lines.push(line)
    */
    this.morph()

    // this.setState({ lines: lines, currentPoints: [] })
    // if (this.state.mode === 'emitter') {
    //   this.emit.start()
    // }
  }

  getShape(bb) {
    let ratio = bb.width / bb.height
    let ox = bb.x + bb.width / 2
    let oy = bb.y + bb.height / 2
    let shape = {
      x: bb.x,
      y: bb.y,
      width: bb.width,
      height: bb.height,
      type: 'rect'
    }
    if (0.6 < ratio && ratio < 1.4) {
      let radius = Math.min(bb.width, bb.height) / 2
      shape = {
        x: ox,
        y: oy,
        radius: radius,
        type: 'circle'
      }
    }
    shape.physics = false
    shape.mode = this.state.mode
    return shape
  }

  morph() {
    let points = this.state.currentPoints
    let node = new Konva.Line({ points: points })
    let bb = node.getClientRect()
    let shape = this.getShape(bb)

    let transform = new Transform()
    let paths = transform.getPaths(points, bb, shape)

    let prev
    pasition.animate({
      from: paths.from,
      to: paths.to,
      time: 500,
      begin: (shapes) => {
        this.setState({ currentPoints: [] })
      },
      progress: (shapes, percent) => {
        let paths = transform.getTransitionPaths(shapes)
        this.setState({ currentPaths: paths })
      },
      end: (shapes) => {
        this.state.shapes.push(shape)
        this.setState({ currentPaths: [], shapes: this.state.shapes })
      }
    })
  }

  changeMode(mode) {
    this.setState({ mode: mode })
  }

  color(mode) {
    return 'black'
    if (mode === 'drawing') return 'red'
    if (mode === 'emitter') return 'blue'
    if (mode === 'motion') return 'purple'
    return 'black'
  }

  enablePhysics() {
    this.setState({ isPhysics: !this.state.isPhysics })
  }

  onContextMenu(event) {
    console.log(this)
    event.evt.preventDefault()
    console.log('context')
  }

  onShapeClick(id) {
    console.log(id)
    let x = this.state.event.evt.clientX
    let y = this.state.event.evt.clientY
    this.setState({ menuPos: { x: x, y: y }, currentId: id })
  }

  onGravityClick() {
    let shapes = this.state.shapes
    shapes[this.state.currentId].physics = true
    this.setState({ shapes: shapes, menuPos: { x: -100, y: -100 } })
  }

  onStaticClick() {
    let shapes = this.state.shapes
    shapes[this.state.currentId].physics = true
    this.setState({ shapes: shapes, menuPos: { x: -100, y: -100 } })
  }

  onMouseDown() {
    console.log(this)
  }

  onMouseMove() {
    console.log('move')
  }

  onMouseUp() {
    console.log('up')
  }

  render() {
    return (
      <>
        <div style={{ display: debug ? 'block' : 'none' }}>
          <Stage
            width={ App.size }
            height={ App.size }
            onMouseDown={ this.stageMouseDown.bind(this) }
            onMouseMove={ this.stageMouseMove.bind(this) }
            onMouseUp={ this.stageMouseUp.bind(this) }
          >
            <Layer ref={ ref => (this.layer = ref) }>
              <Line
                points={ this.state.currentPoints }
                stroke={ 'black' }
              />
              <Group
                x={ this.state.menuPos.x }
                y={ this.state.menuPos.y }
                width={ 200 }
                height={ 50 }
              >
                <Rect
                  width={ 200 }
                  height={ 50 }
                  fill={ '#eee' }
                />
                <Text
                  width={ 200 }
                  height={ 50 }
                  text={ 'Add Gravity' }
                  fontSize={30}
                  align={ 'center' }
                  verticalAlign={ 'middle' }
                  onClick={ this.onGravityClick.bind(this) }
                />
                <Rect
                  x={ 0 }
                  y={ 50 }
                  width={ 200 }
                  height={ 50 }
                  fill={ '#eee' }
                />
                <Text
                  x={ 0 }
                  y={ 50 }
                  width={ 200 }
                  height={ 50 }
                  text={ 'Static' }
                  fontSize={30}
                  align={ 'center' }
                  verticalAlign={ 'middle' }
                  onClick={ this.onStaticClick.bind(this) }
                />
              </Group>
              <Group>
                { this.state.currentPaths.map((path, i) => {
                  return (
                    <Path
                      key={ i }
                      data={ path.data }
                      stroke={ 'black' }
                    />
                  )
                }) }
              </Group>
              { this.state.lines.map((line, i) => {
                  return (
                    <Line
                      key={ i }
                      id={ `line-${i}` }
                      name={ `line-${i}` }
                      physics={ line.physics }
                      x={ line.x }
                      y={ line.y }
                      points={ line.points }
                      stroke={ this.color(line.type) }
                    />
                  )
              }) }
              { this.state.shapes.map((shape, i) => {
                  if (shape.type === 'rect') {
                    return (
                      <Rect
                        key={ i }
                        id={ `shape-${i}` }
                        name={ `shape-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        width={ shape.width }
                        height={ shape.height }
                        stroke={ this.color(shape.mode) }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'circle') {
                    return (
                      <Circle
                        key={ i }
                        id={ `shape-${i}` }
                        name={ `shape-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        radius={ shape.radius }
                        stroke={ this.color(shape.mode) }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
              }) }
              <Physics
                canvas={ this }
              />
            </Layer>
          </Stage>
        </div>
      </>
    )
  }
}

export default Canvas