import React, { Component } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva'
import _ from 'lodash'

import Matter from 'matter-js'
import polyDecomp from 'poly-decomp'
import pathseg from 'pathseg'

class Physics extends Component {
  constructor(props) {
    super(props)
    window.Physics = this
    window.Matter = Matter
    Matter.Common.setDecomp(polyDecomp)

    this.state = {
      bodyIds: []
    }

    this.renderStyle = {
      strokeStyle: 'black',
      fillStyle: 'white',
      lineWidth: 3
    }

  }

  componentDidMount() {
    let engine = Matter.Engine.create()
    let runner = Matter.Runner.create()
    let render = Matter.Render.create({
      element: document.getElementById('physics-container'),
      engine: engine,
      options: {
        showPositions: true,
        showAngleIndicator: true,
        width: 1000,
        height: 1000,
        background: '#eee',
        wireframeBackground: '#eee'
      }
    })
    this.engine = engine
    this.runner = runner
    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)
    Matter.Events.on(engine, 'afterUpdate', this.afterUpdate.bind(this))

    this.showBox()

    // let ball = Matter.Bodies.circle(100, 400, 50, { density: 0.04, frictionAir: 0.005});
    // Matter.Composite.add(this.engine.world, ball)

    // Matter.Composite.add(this.engine.world, Matter.Constraint.create({
    //   pointA: { x: 300, y: 100 },
    //   bodyB: ball
    // }))

  }

  showBox() {
    let rect = { x: 10, y: 10, width: 20, height: 20 }
    let ground = Matter.Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, { isStatic: false, mass: 10 })
    ground.id = 'ground'
    ground.restitution = 1
    Matter.Composite.add(this.engine.world, ground)
    Canvas.setState({ rects: [rect] })
  }

  addBody(node) {
    let id = node.id()
    if (this.state.bodyIds.includes(id)) return false
    let x = node.x()
    let y = node.y()
    let body = Matter.Bodies.circle(x, y, 10, { density: 0.04, frictionAir: 0.005})
    body.id = id
    Matter.Composite.add(this.engine.world, body)
    let bodyIds = this.state.bodyIds
    bodyIds.push(id)
    this.setState({ bodyIds: bodyIds })
    Matter.Composite.add(this.engine.world, Matter.Constraint.create({
      pointA: { x: 300, y: 100 },
      bodyB: body,
      render: renderStyle
    }))
  }

  addLine(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    console.log(start, end)

    let id = 'ball-0'
    let body = Matter.Bodies.circle(end.x, end.y, 50, { density: 0.04, frictionAir: 0.0, render: this.renderStyle })
    body.id = id
    Matter.Composite.add(this.engine.world, body)
    Matter.Composite.add(this.engine.world, Matter.Constraint.create({
      pointA: start,
      bodyB: body,
      render: this.renderStyle
    }))
  }


  afterUpdate() {

    let index = _.findIndex(this.engine.world.bodies, { id: 'ball-0' })
    let body = this.engine.world.bodies[index]
    if (body) {
      let toioPos = {
        x: body.position.x / 2,
        y: body.position.y / 2,
      }
      App.socket.emit('move', toioPos)
      console.log(toioPos)
    }

    // console.log('update')

    // for (let node of Canvas.layer.children) {
    //   let id = node.id()
    //   if (id.includes('line-')) {
    //     // this.addLine(node)

    //     this.addBody(node)
    //     let body = this.engine.world.bodies[1]
    //     let x = body.position.x
    //     let y = body.position.y
    //     let line = Canvas.state.lines[0]
    //     console.log(body)
    //     line.x = x
    //     line.y = y
    //     Canvas.setState({ lines: [line] })

    //   }
    // }

    // let body = this.engine.world.bodies[0]
    // let x = body.position.x
    // let y = body.position.y
    // let rect = Canvas.state.rects[0]
    // rect.x = x
    // rect.y = y
    // Canvas.setState({ rects: [rect] })

  }


  render() {
    return (
      <>
        <div id="physics-container"></div>
      </>
    )
  }


}

export default Physics