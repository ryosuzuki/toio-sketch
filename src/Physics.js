import React, { Component } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva'

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
        width: 300,
        height: 300,
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
    let body = Matter.Bodies.circle(x, y, 10)
    body.id = id
    Matter.Composite.add(this.engine.world, body)
    let bodyIds = this.state.bodyIds
    bodyIds.push(id)
    this.setState({ bodyIds: bodyIds })
  }

  afterUpdate() {
    console.log('update')

    for (let node of Canvas.layer.children) {
      let id = node.id()
      if (id.includes('line-')) {
        this.addBody(node)
        let body = this.engine.world.bodies[1]
        let x = body.position.x
        let y = body.position.y
        let line = Canvas.state.lines[0]
        console.log(body)
        line.x = x
        line.y = y
        Canvas.setState({ lines: [line] })
      }
    }

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