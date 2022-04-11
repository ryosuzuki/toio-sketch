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

    if (['slingshot', 'pong', 'slider', 'pinball', 'rope'].includes(canvas.example)) {
      this.engine.gravity = { x: 0, y: 0 }  // uncomment to disable gravity for slingshot, pong, insituTUI & rope  example
    }

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
    // this.showChain()

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

  showChain() {
    let group = Matter.Body.nextGroup(true)
    this.rope = Matter.Composites.stack(100, 50, 9, 1, 10, 10, (x, y) => {
      let body = Matter.Bodies.rectangle(x, y, 100, 40, { collisionFilter: { group: group } })
      return body
    })

    this.rope = Matter.Composites.stack(100, 50, 20, 1, 10, 10, (x, y) => {
      return Matter.Bodies.circle(x, y, 20, { collisionFilter: { group: group } });
    });

    Matter.Composites.chain(this.rope, 0.5, 0, -0.5, 0, { stiffness: 0.2, length: 2, render: { type: 'line' } })
    Matter.Composite.add(this.engine.world, [
      this.rope,
    ])
    Matter.Composite.add(this.rope, Matter.Constraint.create({
      bodyB: this.rope.bodies[0],
      pointB: { x: -25, y: 0 },
      pointA: { x: this.rope.bodies[0].position.x, y: this.rope.bodies[0].position.y },
      stiffness: 0.5
    }))

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
      let angle = node.getAttr('rotation')
      body = Matter.Bodies.rectangle(x, y, width, height, {
        angle: (Math.PI/180) * angle,
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
    // body.friction = 0
    // body.frictionAir = 0
    if (canvas.example === 'newtons-cradle') {
      body.friction = 0
      body.frictionAir = 0
    }
    if (canvas.example === 'pong') {
      body.friction = 0
      body.frictionAir = 0
    }
    if (canvas.example === 'pinball') {
      body.friction = 0
      body.frictionAir = 0
      if (id.includes('toio')) {
        body.mass = 1000
        body.density = 1000
      }
    }
    if (canvas.example === 'rube-goldberg') {
      console.log(id)
      if (id.includes('toio')) {
        body.friction = 0
      }
      // if (id.includes('toio-3')) {
      //   Matter.Body.setDensity(body, 1000)
      //   Matter.Body.setMass(body, 1000)
      //   // body.friction = 0
      //   // body.frictionStatic = 0
      // }
    }


    Matter.Composite.add(this.engine.world, body)
    bodyIds.push(id)
    this.setState({ bodyIds: bodyIds })
  }

  addConstraint(node) {  //  to attach a body draw the body before drawing constraint
    let id = node.getAttr('id')
    let constraintIds = this.state.constraintIds
    if (constraintIds.includes(id)) {
      return
    }
    let points = node.getAttr('points')
    let constraint = null

    let startPoint = { x: points[0], y: points[1] }
    let endPoint = { x: points[points.length-2], y: points[points.length-1] }
    // console.log(points.length);

    // getting bodyToAttach
    let shapeType = node.id().split('-')[0]
    let shapeId = Number(node.id().split('-')[1])
    let bodyToAttach = this.engine.world.bodies[shapeId] // is replaced with body draw before the contraint and which intersects the constraint

    let offset = 100
    this.engine.world.bodies.forEach(body => {
      // console.debug(element.id, typeof(element.bounds.max.x),  typeof(points[2]), element.bounds.min.x, points[2],  Math.floor(element.bounds.max.x) >  Math.floor(points[2]) , element.bounds.min.x > points[2] , element.bounds.max.y,  points[3], element.bounds.min.y, points[3] )
      if(body.bounds.max.x + offset > endPoint.x &&
         body.bounds.min.x - offset < endPoint.x &&
         body.bounds.max.y + offset > endPoint.y &&
         body.bounds.min.y - offset < endPoint.y
      ) {
        bodyToAttach = body
      }
    })
    Matter.Body.setPosition(bodyToAttach, { x: endPoint.x, y: endPoint.y }) // Body snaps to the constraint

    let bodyToAttach2 = null //  this.engine.world.bodies[shapeId] // is replaced with body draw before the contraint and which intersects the constraint
    offset = 50
    for (let body of this.engine.world.bodies) {
    // this.engine.world.bodies.forEach(body => {
      // console.debug(element.id, typeof(element.bounds.max.x),  typeof(points[2]), element.bounds.min.x, points[2],  Math.floor(element.bounds.max.x) >  Math.floor(points[2]) , element.bounds.min.x > points[2] , element.bounds.max.y,  points[3], element.bounds.min.y, points[3] )
      // if (!body.id.includes('toio')) continue
      // if (body.isStatic) continue
      if(body.bounds.max.x + offset > startPoint.x &&
         body.bounds.min.x - offset < startPoint.x &&
         body.bounds.max.y + offset > startPoint.y &&
         body.bounds.min.y - offset < startPoint.y
      ) {
        bodyToAttach2 = body
      }
    }

    if (bodyToAttach2) {
      node.id(`linetwo-${shapeId}`)
      node.setAttr('physics', 'constrainttwo')
      shapeType = 'linetwo'
      console.log(bodyToAttach2)
    }

    if (bodyToAttach && bodyToAttach.id.includes('toio')) {
      node.setAttr('stroke', App.toioStrokeColor)
    }
    if (bodyToAttach2 && bodyToAttach2.id.includes('toio')) {
      node.setAttr('stroke', App.toioStrokeColor)
    }

    if ( shapeType === 'line') {
      // TODO: need to change the attached body based on the intersected object
      constraint = Matter.Constraint.create({
        pointA: { x: startPoint.x, y: startPoint.y },
        bodyB: bodyToAttach
      })
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
      /*
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
      */

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
    if ( shapeType === 'linetwo') {
      // adding nearest body to start point
      /*
      let bodyToAttach2 = this.engine.world.bodies[shapeId] // is replaced with body draw before the contraint and which intersects the constraint

      this.engine.world.bodies.forEach(body => {
        // console.debug(element.id, typeof(element.bounds.max.x),  typeof(points[2]), element.bounds.min.x, points[2],  Math.floor(element.bounds.max.x) >  Math.floor(points[2]) , element.bounds.min.x > points[2] , element.bounds.max.y,  points[3], element.bounds.min.y, points[3] )
        let offset = 10
        if(body.bounds.max.x + offset > startPoint.x &&
           body.bounds.min.x - offset < startPoint.x &&
           body.bounds.max.y + offset > startPoint.y &&
           body.bounds.min.y - offset < startPoint.y) {
          bodyToAttach2 = body
        }
      })
      */
      Matter.Body.setPosition(bodyToAttach2, { x: startPoint.x, y: startPoint.y }) // Body snaps to the constraint

      constraint = Matter.Constraint.create({
        bodyA: bodyToAttach2,
        bodyB: bodyToAttach,
      })

    } else if ( shapeType === 'lineelastic') { //super elastic constraint for InSitu TUI
      constraint = Matter.Constraint.create({
        pointA: { x: startPoint.x, y: startPoint.y },
        bodyB: bodyToAttach,
        stiffness: 0.005
      })
      Matter.Events.on(this.engine,'afterUpdate',()=>{ // based on stretching the other body moves
        let bodies = this.engine.world.bodies
        // console.log("yes");
        bodies.forEach(element => {
          if(element!=bodyToAttach){
            let dist = Math.sqrt((endPoint.x - bodyToAttach.position.x)**2 + (endPoint.y - bodyToAttach.position.y)**2)
            // Matter.Body.applyForce(element, {x:0,y:1} ,{x:0,y:-0.00001*dist})
            Matter.Body.setVelocity(element, {x:0,y:-0.001*dist})
          }
        });
      })

    } else if(shapeType === 'spring'){
      console.log(bodyToAttach)
      constraint = Matter.Constraint.create({
        pointA: { x: startPoint.x, y: startPoint.y },
        bodyB: bodyToAttach,
        render: { strokeStyle: 'red' },
        stiffness: 0.05
      })
      console.log(constraint)
      let shotFlag = 0;

      this.endPoint = endPoint
      this.bodyToAttach = bodyToAttach
      this.constraint = constraint

      
      setTimeout(() => {
        Matter.Events.on(this.engine, 'afterUpdate', () => { // removes the bodyToAttach from the slingshot and adds a new one
          let dist = Math.sqrt((endPoint.x - bodyToAttach.position.x)**2 + (endPoint.y - bodyToAttach.position.y)**2)
          if (this.mouseConstraint.mouse.button === -1 && shotFlag === 0 && dist > 1*60 ) {
            shotFlag = 1
            bodyToAttach = Matter.Bodies.polygon(endPoint.x, endPoint.y, 4, 20 , { density: 0.04})
            // Matter.Composite.add(this.engine.world, bodyToAttach)
            constraint.bodyB = bodyToAttach
          }
        })
      }, 1000)
    }

    if (!constraint) return false
    constraint.id = id
    Matter.Composite.add(this.engine.world, constraint)
    constraintIds.push(id)
    this.setState({ constraintIds: constraintIds })
  }

  shot() {
    this.bodyToAttach = Matter.Bodies.polygon(this.endPoint.x, this.endPoint.y, 4, 20 , { density: 0.04 })
    Matter.Composite.add(this.engine.world, this.bodyToAttach)
    this.constraint.bodyB = this.bodyToAttach
  }

  applyPhysics(node) {
    // console.log(node.getAttr('id'))
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
    } else if(node.getAttr('physics') === 'constrainttwo') { // constraint between two bodies
      this.addConstraint(node)
      let id = node.getAttr('id')
      let index = this.engine.world.constraints.map(c => c.id).indexOf(id)
      let constraint = this.engine.world.constraints[index]
      let points = [
        constraint.bodyA.position.x,
        constraint.bodyA.position.y,
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
      let vx = body.velocity.x
      let vy = body.velocity.y
      let degree = body.angle * 180 / Math.PI
      node.setAttrs({ x: x, y: y, vx: vx, vy: vy })
      let angleFix = node.getAttr('angleFix')
      if (angleFix) {
        node.rotation(0)
      } else {
        node.rotation(degree)
      }
    }
  }

  afterUpdate() {
    for (let node of this.canvas.layer.children) {
      /*
      // rope
      let id = node.getAttr('id')
      if (id.includes('rope')) {
        let points = []
        for (let body of this.rope.bodies) {
          points.push(body.position.x)
          points.push(body.position.y)
        }
        node.setAttrs({ points: points })
        // node.rotate(body.angle )
      }
      if (id.includes('circle-0')) {
        let body = this.rope.bodies[0]
        node.setAttrs({
          x: body.position.x,
          y: body.position.y,
          radius: 30,
          width: 100,
          height: 40,
          rotation: body.angle * 180 / Math.PI
        })
      }
      if (id.includes('circle-1')) {
        let body = this.rope.bodies[19]
        node.setAttrs({
          x: body.position.x,
          y: body.position.y,
          radius: 30,
          width: 100,
          height: 40,
          rotation: body.angle * 180 / Math.PI
        })
      }
      */
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