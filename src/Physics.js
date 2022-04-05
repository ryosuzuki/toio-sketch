import React, { Component } from 'react'
import Matter from 'matter-js'
import polyDecomp from 'poly-decomp'
import pathseg from 'pathseg'
import { Stage, Layer, Rect, Text, Line } from 'react-konva'
import Konva from 'konva'

import Spring from './Spring'

class Physics extends Component {
  constructor(props) {
    super(props)
    window.Matter = Matter
    Matter.Common.setDecomp(polyDecomp)

    this.canvas = props.canvas
    this.canvas.physics = this
    this.max = 30
    this.state = {
      step: 0,
      rects: [],
      bodyIds: [],
      constraintIds: []
    }
  }

  componentDidMount() {
    let matterCanvas = document.querySelector('#matter-canvas')
    matterCanvas.width = 1024
    matterCanvas.height = 1024

    let engine = Matter.Engine.create()
    let runner = Matter.Runner.create()
    let render = Matter.Render.create({
      canvas: matterCanvas,
      engine: engine,
      options: {
        enabled: false,
        showPositions: true,
        showAngleIndicator: true,
        showMousePosition: true,
        width: App.size,
        height: App.size,
        background: '#eee',
        wireframeBackground: 'none'
      }
    })
    this.engine = engine
    this.runner = runner
    this.matterRender = render

    this.mouse = Matter.Mouse.create(this.matterRender.canvas)
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        render: {
          visible: true
        }
      }
    })
    this.matterRender.mouse = this.mouse
    Matter.Composite.add(this.engine.world, this.mouseConstraint)

    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)
    Matter.Events.on(engine, 'afterUpdate', this.afterUpdate.bind(this))

    // this.showBox()

    setInterval(() => {
      this.setState({ step: this.state.step + 1 })
    }, 100)
  }

  mouseEvent(event) {
    // emulate mouse interaction based on 3D touch points
    // https://github.com/liabru/matter-js/blob/master/src/core/Mouse.js
    this.mouse.absolute.x = event.clientX
    this.mouse.absolute.y = event.clientY
    this.mouse.position.x = this.mouse.absolute.x
    this.mouse.position.y = this.mouse.absolute.y
    if (event.type === 'mousemove') {
      this.mouse.sourceEvents.mousemove = event
      this.mouse.button = 0
    }
    if (event.type === 'mousedown') {
      this.mouse.mousedownPosition.x = this.mouse.position.x
      this.mouse.mousedownPosition.y = this.mouse.position.y
      this.mouse.sourceEvents.mousedown = event
      this.mouse.button = 0
    }
    if (event.type === 'mouseup') {
      this.mouse.mouseupPosition.x = this.mouse.position.x
      this.mouse.mouseupPosition.y = this.mouse.position.y
      this.mouse.sourceEvents.mouseup = event
      this.mouse.button = -1
    }
  }

  showBox() {
    let rect = { x: 400, y: 810, width: 810, height: 60 }
    let ground = Matter.Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, { isStatic: true, mass: 10 })
    ground.id = 'ground'
    ground.restitution = 1
    Matter.Composite.add(this.engine.world, ground)
    this.setState({ rects: [rect] })
  }

  addBody(node, options={}) {
    let id = node.getAttr('id')
    let bodyIds = this.state.bodyIds
    if (bodyIds.includes(id)) {
      return
    }
    let x = node.getAttr('x')
    let y = node.getAttr('y')
    let body = null
    if (node.className === 'Rect') {
      let width = node.getAttr('width')
      let height = node.getAttr('height')
      body = Matter.Bodies.rectangle(x, y, width, height, {
        render: {
          fillStyle: 'red',
          strokeStyle: 'red',
          lineWidth: 1,
        }
      })
    }
    if (node.className === 'Circle') {
      let radius = node.getAttr('radius') || 20
      body = Matter.Bodies.circle(x, y, radius, {
        render: {
          fillStyle: 'red',
          strokeStyle: 'red',
          lineWidth: 1,
        }
      })
    }
    if (!body) return false
    body.id = id
    body.restitution = 1
    Matter.Composite.add(this.engine.world, body)
    bodyIds.push(id)
    this.setState({ bodyIds: bodyIds })
  }

  addConstraint(node) {
    let id = node.getAttr('id')
    let constraintIds = this.state.constraintIds
    if (constraintIds.includes(id)) {
      return
    }
    let points = node.getAttr('points')
    let constraint = null
    if (node.className === 'Line') {
      // TODO: need to change the attached body based on the intersected object
      let id = Number(node.id().split('-')[1])
      /*
      let body = this.engine.world.bodies[id] // TODO
      constraint = Matter.Constraint.create({
        pointA: { x: points[0], y: points[1] },
        bodyB: body,
      })
      */

      // Piston
      /*
      if (id === 0) {
        let body = this.engine.world.bodies[id] // TODO
        constraint = Matter.Constraint.create({
          pointA: { x: points[0], y: points[1] },
          bodyB: body,
        })
      }
      if (id === 1) {
        let bodyA = this.engine.world.bodies[0] // TODO
        let bodyB = this.engine.world.bodies[1] // TODO
        constraint = Matter.Constraint.create({
          pointA: bodyA.position,
          bodyB: bodyB,
        })
      }
      */

      // In-situ Actuated TUI
      if (id === 0) {
        let bodyA = this.engine.world.bodies[1]
        let bodyB = this.engine.world.bodies[0]
        constraint = Matter.Constraint.create({
          pointA: bodyA.position,
          bodyB: bodyB,
        })
      }
      if (id === 1) {
        let bodyA = this.engine.world.bodies[1]
        let bodyB = this.engine.world.bodies[2]
        constraint = Matter.Constraint.create({
          pointA: bodyA.position,
          bodyB: bodyB,
        })
      }

      if (id === 2) {
        let bodyB = this.engine.world.bodies[3]
        constraint = Matter.Constraint.create({
          pointA: { x: 100, y: 800 },
          bodyB: bodyB,
          stiffness: 0.0001 // spring
        })
      }


      // spring
      /*
      let position = { x: body.position.x, y: body.position.y }
      constraint = Matter.Constraint.create({
        pointA: position,
        bodyB: body,
        stiffness: 0.05 // spring
      })
      */
    }
    if (!constraint) return false
    constraint.id = id
    Matter.Composite.add(this.engine.world, constraint)
    constraintIds.push(id)
    this.setState({ constraintIds: constraintIds })
  }

  applyPhysics(node) {
    if (node.getAttr('physics') === 'constraint') {
      this.addConstraint(node)
      let id = node.getAttr('id')
      let index = this.engine.world.constraints.map(c => c.id).indexOf(id)
      let constraint = this.engine.world.constraints[index]
      let points = [
        constraint.pointA.x,
        constraint.pointA.y,
        constraint.bodyB.position.x,
        constraint.bodyB.position.y,
      ]
      node.setAttrs({ points: points })
    } else if (node.getAttr('physics') === 'spring') {
      this.addConstraint(node)
      let id = node.getAttr('id')
      let index = this.engine.world.constraints.map(c => c.id).indexOf(id)
      let constraint = this.engine.world.constraints[index]

      let start = constraint.pointA
      let end = constraint.bodyB.position
      let length = node.getAttr('length')
      let spring = new Spring()
      let points = spring.calculatePoints(start, end, length)
      node.setAttrs({ points: points })
    } else {
      this.addBody(node)
      let id = node.getAttr('id')
      let index = this.engine.world.bodies.map(b => b.id).indexOf(id)
      let body = this.engine.world.bodies[index]
      if (node.getAttr('physics') === 'float') {
        body.isStatic = false
        body.isSleeping = true
      }
      if (node.getAttr('physics') === 'static') {
        body.isStatic = true
        body.isSleeping = false
      }
      if (node.getAttr('physics') === 'dynamic') {
        body.isStatic = false
        body.isSleeping = false
      }
      let originPoint = node.getAttr('originPoint') || { x: 0, y: 0 }
      let x = body.position.x
      let y = body.position.y
      let degree = body.angle * 180 / Math.PI
      node.setAttrs({ x: x, y: y })
      node.rotation(degree)
    }
  }

  afterUpdate() {
    for (let node of this.canvas.layer.children) {
      if (!node.getAttr('physics')) continue
      this.applyPhysics(node)
    }
  }

  render() {
    return (
      <>
        { this.state.rects.map((rect, i) => {
          return (
            <Rect
              key={ i }
              x={ rect.x }
              y={ rect.y }
              width={ rect.width }
              height={ rect.height }
              offsetX={ rect.width/2 }
              offsetY={ rect.height/2 }
              stroke={ '#002f2b' }
              strokeWidth={ 8 }
              fill={ '#004842' }
            />
          )
        })}
      </>
    )
  }

}

export default Physics