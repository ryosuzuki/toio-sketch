import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'
import pasition from 'pasition'
import Physics from './Physics'
import Transform from './Transform'
import Spring from './Spring'

import Slingshot from './examples/Slingshot'
import Piston from './examples/Piston'
import Pong from './examples/Pong'
import NewtonsCradle from './examples/NewtonsCradle'
import RubeGoldberg from './examples/RubeGoldberg'
import Pinball from './examples/Pinball'
import Rope from './examples/Rope'
import Slider from './examples/Slider'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.example = null
    this.state = {
      toios: [],
      shapes: [],
      currentPoints: [],
      currentPaths: [],
      currentId: -1,
      event: {},
      menuPos: { x: -100, y: -100 }
    }

    this.pressed = []

    // demos
    this.slingshot = new Slingshot()
    this.piston = new Piston()
    this.pong = new Pong()
    this.newtonsCradle = new NewtonsCradle()
    this.rubeGoldberg = new RubeGoldberg()
    this.pinball = new Pinball()
    this.rope = new Rope()
    this.slider = new Slider()

    // this.slingshot.init(this)
    // this.piston.init(this)
    // this.newtonsCradle.init(this)
    this.pong.init(this)
    // this.pinball.init(this)
    // this.rubeGoldberg.init(this)
    // this.rope.init(this)
    // this.slider.init(this)
  }

  componentDidMount() {
    this.socket = App.socket

    // debug
    if (!this.socket) {
      /*
      let cube = { x: 250, y: 250, angle: 0 }
      let shape = {
        x: 1024 * ((cube.x - 45) / (455 - 45)),
        y: 1024 * ((cube.y - 45) / (455 - 45)),
        rotation: cube.angle,
        type: 'toio',
        physics: 'float',
        toioId: 0
      }
      let shapes = this.state.shapes
      shapes.push(shape)
      this.setState({ shapes: shapes})
      */
    } else {
      this.cubes = []
      this.socket.on('pos', (data) => {
        let shapes = this.state.shapes

        let cube = data
        let id = cube.id
        let shape = {
          x: 1024 * ((cube.x - 45) / (455 - 45)),
          y: 1024 * ((cube.y - 45) / (455 - 45)),
          rotation: cube.angle,
          type: 'toio',
          physics: 'float',
          toioId: cube.id
        }
        if (this.example === 'slingshot') {
          shape.physics = 'dynamic'
        }
        if (this.example === 'pinball') {
          shape.physics = 'dynamic'
        }
        let shapeId = _.findIndex(shapes, { 'toioId': id })

        let toios = this.state.toios
        /*
        if (!toios[id]) {
          toios.push({
            x: shape.x,
            y: shape.y,
            angle: shape.rotation,
            pressed: false,
          })
        } else {
          toios[id] = {
            x: shape.x + 5,
            y: shape.y - App.toioSize/2,
            angle: shape.rotation,
            pressed: false,
          }
        }
        */

        if (shapeId < 0) {
          shapes.push(shape)
          this.cubes.push({
            x: shape.x,
            y: shape.y,
            angle: shape.rotation,
            pressed: false,
          })
        } else {
          if (this.cubes[id].pressed) {
            let target = {
              id: id,
              x: data.x,
              y: data.y,
              angle: data.angle
            }
            this.socket.emit('move', target)
            let x = 1024 * ((data.x - 45) / (455 - 45))
            let y = 1024 * ((data.y - 45) / (455 - 45))
            let event = new MouseEvent('mousemove' , {
              clientX: x,
              clientY: y,
              pageX: x,
              pageY: y,
            })
            this.physics.mouseEvent(event)
          }
          let cube = this.cubes[id]
          if (cube && cube.pressed) {
            let toio = shapes[shapeId]
            toio.x = shape.x
            toio.y = shape.y
            toio.rotation = shape.rotation
            shapes[shapeId] = toio
          }
        }
        this.setState({ shapes: shapes})

        // for (let i = 0; i < this.cubes.length; i++) {
        //   let cube = this.cubes[i]
        //   if (cube.pressed) {
        //   }
        // }
      })

      this.socket.on('button', (data) => {
        console.log(data)
        let id = data.id
        this.cubes[id].pressed = data.pressed
        // this.pressed = data.pressed
        let x = 1024 * ((this.cubes[id].x - 45) / (455 - 45))
        let y = 1024 * ((this.cubes[id].y - 45) / (455 - 45))
        if (data.pressed) {
          let event = new MouseEvent('mousedown' , {
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
          })
          this.physics.mouseEvent(event)
        } else {
          let event = new MouseEvent('mouseup' , {
            clientX: x,
            clientY: y,
            pageX: x,
            pageY: y,
          })
          this.physics.mouseEvent(event)

          if (this.example === 'slingshot') {
            this.physics.shot()
          }
        }
      })

      setInterval(() => {
        // if (this.pressed) {
        //   console.log('pressed')
        //   return false
        // }
        let nodes = canvas.layer.children
        let cubes = []
        let i = 0
        for (let node of nodes) {
          let id = node.getAttr('id')
          if (!id.includes('toio')) continue

          let cube = this.cubes[i]
          if (cube.pressed) {
            i++
            continue
          }
          let x = node.getAttr('x')
          let y = node.getAttr('y')
          let vx = node.getAttr('vx')
          let vy = node.getAttr('vy')
          let angle = node.getAttr('rotation')
          let target = {
            id: i,
            x: x / 1024 * (455 - 45) + 45,
            y: y / 1024 * (455 - 45) + 45,
            angle: angle,
            vx: vx,
            vy: vy,
          }
          this.socket.emit('move', target)
          i++
        }
      }, 10)
    }

    this.stage = Konva.stages[0]

  }

  mouseDown(pos) {
    let event = new MouseEvent('mousedown' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.stage._pointerdown(event)
    this.physics.mouseEvent(event)
  }

  mouseMove(pos) {
    let event = new MouseEvent('mousemove' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    this.stage._pointermove(event)
    Konva.DD._drag(event)
    this.physics.mouseEvent(event)
  }

  mouseUp(pos) {
    let event = new MouseEvent('mouseup' , {
      clientX: pos.x,
      clientY: pos.y,
      pageX: pos.x,
      pageY: pos.y,
    })
    Konva.DD._endDragBefore(event)
    this.stage._pointerup(event)
    Konva.DD._endDragAfter(event)
    this.physics.mouseEvent(event)
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

    /*
    if (this.state.shapes.length === 3) {
      this.setState({ currentPoints: [], toios: [{ x: 100, y: 100 }] })
      return
    }
    */
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
      physics: 'float',
      rotation: 0
    }
    if (0.6 < ratio && ratio < 1.4) {
      let radius = Math.min(bb.width, bb.height) / 2
      shape = {
        x: ox,
        y: oy,
        radius: radius,
        type: 'circle',
        physics: 'float',
        visible: true
      }
    }
    let last = points.length-1
    let start = { x: points[0], y: points[1] }
    let end = { x: points[last-1], y: points[last] }
    let dist = Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2)
    if (dist > bb.width || dist > bb.height)
    {
      let sketchPointDist =0
      for(let i=0;i<last-3;i++){
        sketchPointDist = sketchPointDist + Math.sqrt((points[i+2] - points[i])**2 + (points[i+3] - points[i+1])**2)
      }
      if(sketchPointDist < 2.5*dist) // draw line quickly & straight to ensure correct recognition
      {
        shape =
        {
          x: 0,
          y: 0,
          points: [points[0], points[1], points[last-1], points[last]],
          type: 'line',
          physics: 'constraint'
        }
      }
      else // draw spring slowly and with edges to ensure correct recognition
      {
        // spring
        shape =
        {
        x: 0,
        y: 0,
        start: { x: points[0], y: points[1] },
        end: { x: points[last-1], y: points[last] },
        length: 0, // Math.sqrt((points[last-1]-points[0])**2 + (points[last]-points[1])**2),
        type: 'spring',
        physics: 'spring'
        }
      }
    }
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

  onContextMenu(event) {
    console.log(this)
    event.evt.preventDefault()
    console.log('context')
  }

  onToioClick(id) {
    console.log(id)
    let x = this.state.event.evt.clientX
    let y = this.state.event.evt.clientY
    this.setState({ menuPos: { x: x, y: y }, toioId: id })
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
                stroke={ App.strokeColor }
                strokeWidth={ App.strokeWidth }
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
                  onTap={ this.onGravityClick.bind(this) }
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
                  onTap={ this.onStaticClick.bind(this) }
                />
              </Group>
              {/* Transform Path */}
              <Group>
                { this.state.currentPaths.map((path, i) => {
                  return (
                    <Path
                      key={ i }
                      data={ path.data }
                      stroke={ App.strokeColor }
                      strokeWidth={ App.strokeWidth }
                    />
                  )
                }) }
              </Group>
              { this.state.toios.map((toio, i) => {
                  return (
                    <Rect
                      key={ i }
                      id={ `cube-${i}` }
                      name={ `cube-${i}` }
                      x={ toio.x }
                      y={ toio.y }
                      rotation={ toio.angle }
                      radius={ 40 }
                      width={ App.toioSize }
                      height={ App.toioSize }
                      offsetX={ App.toioSize/2 }
                      offsetY={ App.toioSize/2 }
                      strokeWidth={ App.strokeWidth }
                      stroke={ App.toioStrokeColor }
                      fill={ App.toioFillColorAlpha }
                      draggable
                      onClick={ this.onShapeClick.bind(this, i) }
                      onTap={ this.onShapeClick.bind(this, i) }
                    />
                  )
              }) }
              {/* All Sketched Shapes */}
              { this.state.shapes.map((shape, i) => {
                  if (shape.type === 'toio') {
                    let width = shape.width ? shape.width : App.toioSize
                    let height = shape.height ? shape.height : App.toioSize
                    return (
                      <Rect
                        key={ i }
                        id={ `toio-${i}` }
                        name={ `toio-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        rotation={ shape.angle }
                        angleFix={ true } // For pong
                        radius={ 40 }
                        width={ width }
                        height={height }
                        offsetX={ width/2 }
                        offsetY={ height/2 }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.toioStrokeColor }
                        fill={ App.toioFillColorAlpha }
                        // fill={ 'rgba(54, 40, 0, 0.01)' }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                      {/*
                      <Circle
                        key={ i }
                        id={ `toio-${i}` }
                        name={ `toio-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        radius={ 40 }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.toioStrokeColor }
                        fill={ App.toioFillColorAlpha }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                      */}
                  }
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
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        fill={ App.fillColorAlpha }
                        rotation={ shape.rotation }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
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
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        fill={ App.fillColorAlpha }
                        visible={ shape.visible }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
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
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'linetwo') { // contraint between two bodies
                    return (
                      <Line
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        points={ shape.points }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'lineelastic') { // super elastoc constraint for InSitu TUI
                    return (
                      <Line
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        points={ shape.points }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
                      />
                    )
                  }
                  if (shape.type === 'spring') {
                    return (
                      <Spring
                        key={ i }
                        id={ `${shape.type}-${i}` }
                        name={ `${shape.type}-${i}` }
                        physics={ shape.physics }
                        x={ shape.x }
                        y={ shape.y }
                        length={ shape.length }
                        start={ shape.start }
                        end={ shape.end }
                        strokeWidth={ App.strokeWidth }
                        stroke={ App.strokeColor }
                        draggable
                        onClick={ this.onShapeClick.bind(this, i) }
                        onTap={ this.onShapeClick.bind(this, i) }
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