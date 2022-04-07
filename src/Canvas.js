import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'
import pasition from 'pasition'
import Physics from './Physics'
import Transform from './Transform'
import Spring from './Spring'

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
      toios: [],
      menuPos: { x: -100, y: -100 }
    }
  }

  componentDidMount() {
    this.stage = Konva.stages[0]
    this.slingShot = this.slingShot.bind(this)
    this.newtonsCradle = this.newtonsCradle.bind(this)
    this.rubeGoldberg = this.rubeGoldberg.bind(this)
    this.pistonMech = this.pistonMech.bind(this)
    this.pinBall = this.pinBall.bind(this)
    this.pong = this.pong.bind(this)
    this.inSituTui = this.inSituTui.bind(this)
    // this.slingShot() //  disable gravity ----------uncomment line 49 in Physics.js
    // this.newtonsCradle()
    // this.rubeGoldberg()
    // this.pistonMech()
    // this.pinBall()
    // this.pong() //  disable gravity ----------uncomment line 49 in Physics.js
    // this.inSituTui()
    
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

  slingShot(){
    // disable gravity ----------uncomment line 49 in Physics.js
    let shape1 = {  // for toio
      x: 300,
      y: 900,
      radius: 40,
      type: 'circle',
      physics: 'dynamic'
    }
    shape1.mode = this.state.mode
    this.state.shapes.push(shape1) // this.state.toios.push(shape1)
    this.setState({ currentPaths: [], shapes: this.state.shapes }) // this.setState({ currentPaths: [], toios: this.state.toios })

    let shape2 = 
    {
      x: 0,
      y: 0,
      start: { x: 300, y: 700 },
      end: { x: 300, y: 900 },
      length: 0, // Math.sqrt((points[last-1]-points[0])**2 + (points[last]-points[1])**2),
      type: 'spring',
      physics: 'spring'
    }
    shape2.mode = this.state.mode
    this.state.shapes.push(shape2)
    this.setState({ currentPaths: [], shapes: this.state.shapes })


    let xx = [ 700, 700, 700, 800, 900, 800 ]
    let yy = [ 100, 200, 300, 300, 300, 200 ] 

    for(let i=0;i<xx.length;i++) // pile of circles
    {
      let shape1 = {
        x: xx[i],
        y: yy[i],
        radius: 40,
        type: 'circle',
        physics: 'dynamic'
      }
      shape1.mode = this.state.mode
      this.state.shapes.push(shape1)
      this.setState({ currentPaths: [], shapes: this.state.shapes })
    }
    
  }

  newtonsCradle(){

    let start = 360, offset = 90;
    for(let i=0;i<=3;i++)
    {
      
      let x = start + offset*i
      let shape1 = {
        x: x,
        y: 700,
        radius: 40,
        type: 'circle',
        physics: 'dynamic'
      }
      shape1.mode = this.state.mode
      this.state.shapes.push(shape1)
      this.setState({ currentPaths: [], shapes: this.state.shapes })

      let shape2 = 
      {
        x: 0,
        y: 0,
        points: [x, 350, x, 700],
        type: 'line',
        physics: 'constraint'
      }
      shape2.mode = this.state.mode
      this.state.shapes.push(shape2)
      this.setState({ currentPaths: [], shapes: this.state.shapes })
    }

    for(let i=4;i<=5;i++) // for toios
    {
      let x = (i === 4) ? start - offset : start + offset * 4
      let shape1 = {
        x: x,
        y: 700,
        radius: 40,
        type: 'circle',
        physics: 'dynamic'
      }
      shape1.mode = this.state.mode
      this.state.shapes.push(shape1) //  this.state.toios.push(shape1)
      this.setState({ currentPaths: [], shapes: this.state.shapes }) // this.setState({ currentPaths: [], toios: this.state.toios })

      let shape2 = 
      {
        x: 0,
        y: 0,
        points: [x, 350, x, 700],
        type: 'line',
        physics: 'constraint'
      }
      shape2.mode = this.state.mode
      this.state.shapes.push(shape2)
      this.setState({ currentPaths: [], shapes: this.state.shapes })
    }

  }

  rubeGoldberg(){
    let xx = [500, 700, 300, 900]
    let yy = [350, 800, 100, 600]
    let ww = [600, 600,  50,  50]
    let hh = [ 50,  50,  50,  50]
    let rr = [ 2, -10,  5, -5]
    let pp = [ 'static', 'static',  'dynamic', 'dynamic']

    for(let i=0;i<xx.length;i++)
    {
      let shape1 = {
        x: xx[i],
        y: yy[i],
        width: ww[i],
        height: hh[i],
        rotation: rr[i],
        type: 'rect',
        physics: pp[i]
      }
      shape1.mode = this.state.mode
      this.state.shapes.push(shape1)
      this.setState({ currentPaths: [], shapes: this.state.shapes })
    }

    let shape2 = {
      x: 700,
      y: 200,
      radius: 40,
      type: 'circle',
      physics: 'dynamic'
    }
    shape2.mode = this.state.mode
    this.state.shapes.push(shape2)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

  }

  pistonMech(){
    let shape1 = {
      x: 240,
      y: 300,
      radius: 40,
      type: 'circle',
      physics: 'float'
    }
    shape1.mode = this.state.mode
    this.state.shapes.push(shape1)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape2 = {
      x: 240,
      y: 512,
      radius: 160,
      type: 'circle',
      physics: 'static'
    }
    shape2.mode = this.state.mode
    this.state.shapes.push(shape2)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape4 = { // for toio
      x: 600,
      y: 512,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynammic'
    }
    shape4.mode = this.state.mode
    this.state.shapes.push(shape4)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape5 = {
      x: 700,
      y: 512-55,
      width: 400,
      height: 50,
      type: 'rect',
      physics: 'static'
    }
    shape5.mode = this.state.mode
    this.state.shapes.push(shape5)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape6 = {
      x: 700,
      y: 512+55,
      width: 400,
      height: 50,
      type: 'rect',
      physics: 'static'
    }
    shape6.mode = this.state.mode
    this.state.shapes.push(shape6)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape3 = {
      x: 0,
      y: 0,
      points: [240, 512, 240, 300],
      type: 'line',
      physics: 'constraint'
    }
    shape3.mode = this.state.mode
    this.state.shapes.push(shape3)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape7 = {
      x: 0,
      y: 0,
      points: [240, 300, 600, 512],
      type: 'linetwo',
      physics: 'constrainttwo'
    }
    shape7.mode = this.state.mode
    this.state.shapes.push(shape7)
    this.setState({ currentPaths: [], shapes: this.state.shapes })
  }

  pinBall(){
  let xx = [510,      100,  1024-100,  330,                 700,              500, 700, 350]
  let yy = [125,      550,  550,       850,                 850,              600, 430, 300]
  let ww = [1024-150,  50,   50,        App.toioSize * 4,   App.toioSize * 4, 300, 300, 300]
  let hh = [ 50,       800,  800,      App.toioSize,        App.toioSize,      30, 30,   30]
  let rr = [ 0,        0,    0,        -10,                  10,                -5,   +5,   -5]
  let pp = [ 'static', 'static', 'static', 'float', 'float', 'static', 'static', 'static']

  for(let i=0;i<xx.length;i++)
  {
    let shape1 = {
      x: xx[i],
      y: yy[i],
      width: ww[i],
      height: hh[i],
      rotation: rr[i],
      type: 'rect',
      physics: pp[i]
    }
    shape1.mode = this.state.mode
    this.state.shapes.push(shape1)
    this.setState({ currentPaths: [], shapes: this.state.shapes })
  }

  let shape2 = {
    x: 500,
    y: 500,
    radius: 50,
    type: 'circle',
    physics: 'dynamic'
  }
  shape2.mode = this.state.mode
  this.state.shapes.push(shape2)
  this.setState({ currentPaths: [], shapes: this.state.shapes })
  
  }

  pong(){ 
    //  disable gravity ----------uncomment line 49 in Physics.js
    let shape1 = { // wall
      x: 500,
      y: 150,
      width: 800,
      height: 50,
      type: 'rect',
      physics: 'static'
    }
    shape1.mode = this.state.mode
    this.state.shapes.push(shape1)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape2 = { // wall
      x: 500,
      y: 1024-150,
      width: 800,
      height: 50,
      type: 'rect',
      physics: 'static'
    }
    shape2.mode = this.state.mode
    this.state.shapes.push(shape2)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape3 = { // virtual ball
      x: 400,
      y: 400,
      radius: 50,
      type: 'circle',
      physics: 'dynamic'
    }
    shape3.mode = this.state.mode
    this.state.shapes.push(shape3)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape4 = { // toio ball
      x: 600,
      y: 600,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynamic'
    }
    shape4.mode = this.state.mode
    this.state.shapes.push(shape4)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape5 = { // paddle R
      x: 900,
      y: 650,
      width: App.toioSize,
      height: App.toioSize*4,
      type: 'rect',
      physics: 'float'
    }
    shape5.mode = this.state.mode
    this.state.shapes.push(shape5)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape6 = { // paddle L
      x: 100,
      y: 400,
      width: App.toioSize,
      height: App.toioSize*4,
      type: 'rect',
      physics: 'float'
    }
    shape6.mode = this.state.mode
    this.state.shapes.push(shape6)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

  }


  inSituTui(){
    //  disable gravity ----------uncomment line 49 in Physics.js
    let xx = [400, 500, 600]
    let yy = [400, 300, 400]
    let pp = ["static", "static", "dynamic"]

    for(let i =0;i<xx.length;i++){
      let shape5 = { // for toio
        x: xx[i],
        y: yy[i],
        width: App.toioSize,
        height: App.toioSize,
        type: 'rect',
        physics: pp[i]
      }
      shape5.mode = this.state.mode
      this.state.shapes.push(shape5)
      this.setState({ currentPaths: [], shapes: this.state.shapes })
    }

    for(let i=0;i<xx.length-1;i++){
      let shape7 = {
        x: 0,
        y: 0,
        points: [xx[i], yy[i], xx[i+1], yy[i+1]],
        type: 'linetwo',
        physics: 'constrainttwo'
      }
      shape7.mode = this.state.mode
      this.state.shapes.push(shape7)
      this.setState({ currentPaths: [], shapes: this.state.shapes })
    }

    let shape5 = { // for toio
      x: 200,
      y: 800,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'float'
    }
    shape5.mode = this.state.mode
    this.state.shapes.push(shape5)
    this.setState({ currentPaths: [], shapes: this.state.shapes })

    let shape7 = {
      x: 0,
      y: 0,
      points: [100, 800, 200, 800],
      type: 'lineelastic',
      physics: 'constraint'
    }
    shape7.mode = this.state.mode
    this.state.shapes.push(shape7)
    this.setState({ currentPaths: [], shapes: this.state.shapes })
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
              {/* Toio */}
              { this.state.toios.map((toio, i) => {
                return (
                  <Rect
                    key={ i }
                    id={ `toio-${i}` }
                    name={ `toio-${i}` }
                    physics={ 'float' }
                    x={ toio.x }
                    y={ toio.y }
                    radius={ App.toioSize }
                    width={ App.toioSize }
                    height={ App.toioSize }
                    offsetX={ App.toioSize/2 }
                    offsetY={ App.toioSize/2 }
                    strokeWidth={ App.strokeWidth }
                    stroke={ App.toioStrokeColor }
                    fill={ App.toioFillColorAlpha }
                    rotation={ 45 }
                    draggable
                    onClick={ this.onShapeClick.bind(this, i) }
                    onTap={ this.onShapeClick.bind(this, i) }
                  />
                )
              })}
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