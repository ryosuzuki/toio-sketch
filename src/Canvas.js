import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'
import pasition from 'pasition'
import Physics from './Physics'
import Transform from './Transform'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      mode: 'drawing',
      shapes: [],
      currentPoints: [],
      currentPaths: [],
      currentId: -1,
      event: {},
      menuPos: { x: -100, y: -100 }
    }
  }

  componentDidMount() {
    this.stage = Konva.stages[0]
  }

  mouseDown(pos) {
    let event = new MouseEvent('mousedown' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.physics.mouseEvent(event)
    this.stage._pointerdown(event)
  }

  mouseMove(pos) {
    let event = new MouseEvent('mousemove' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.physics.mouseEvent(event)
    this.stage._pointermove(event)
    Konva.DD._drag(event)
  }

  mouseUp(pos) {
    let event = new MouseEvent('mouseup' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.physics.mouseEvent(event)
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
    this.morph()
  }

  estimateShape(points, bb) {
    let ratio = bb.width / bb.height
    let ox = bb.x + bb.width / 2
    let oy = bb.y + bb.height / 2
    let shape = {
      x: ox,
      y: oy,
      width: bb.width,
      height: bb.height,
      type: 'rect',
      physics: 'float'
    }
    if (0.6 < ratio && ratio < 1.4) {
      let radius = Math.min(bb.width, bb.height) / 2
      shape = {
        x: ox,
        y: oy,
        radius: radius,
        type: 'circle',
        physics: 'float'
      }
    }
    let last = points.length-1
    let start = { x: points[0], y: points[1] }
    let end = { x: points[last-1], y: points[last] }
    let dist = Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2)
    if (dist > bb.width || dist > bb.height) {
      shape = {
        x: 0,
        y: 0,
        points: [points[0], points[1], points[last-1], points[last]],
        type: 'line',
        physics: 'constraint'
      }
    }
    shape.mode = this.state.mode
    return shape
  }

  morph() {
    let points = this.state.currentPoints
    let node = new Konva.Line({ points: points })
    let bb = node.getClientRect()
    let shape = this.estimateShape(points, bb)

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
    shapes[this.state.currentId].physics = 'dynamic'
    this.setState({ shapes: shapes, menuPos: { x: -100, y: -100 } })
  }

  onStaticClick() {
    let shapes = this.state.shapes
    shapes[this.state.currentId].physics = 'static'
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
              {/* Drawing Line */}
              <Line
                points={ this.state.currentPoints }
                stroke={ 'black' }
              />
              {/* Gravity and Static Menu */}
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
              {/* Transform Path */}
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
              {/* All Sketched Shapes */}
              { this.state.shapes.map((shape, i) => {
                  if (shape.type === 'rect') {
                    return (
                      <Rect
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        width={ shape.width }
                        height={ shape.height }
                        offsetX={ shape.width/2 }
                        offsetY={ shape.height/2 }
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
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
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
                  if (shape.type === 'line') {
                    return (
                      <Line
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        points={ shape.points }
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