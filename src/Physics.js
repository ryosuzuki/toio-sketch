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
      mode:"sketch", // action or sketch
      bodyIds: []
    }

    this.renderStyle = {
      strokeStyle: 'grey',
      fillStyle: 'white',
      lineWidth: 2
    }

    this.toioCategory = 0x0001 // using collision filtering categories for toio positioning
    this.secondCategory = 0x0002
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


    // add mouse control
    this.mouse = Matter.Mouse.create(this.render.canvas),
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
        mouse: this.mouse,
        constraint: {
            render: {
                visible: true
            }
        }
    });

    // keep the mouse in sync with rendering
    render.mouse = this.mouse;
    Matter.Composite.add(this.engine.world, this.mouseConstraint);
    this.setToSketch()


    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)
    Matter.Events.on(engine, 'afterUpdate', this.afterUpdate.bind(this))

    this.createBox()

    // let ball = Matter.Bodies.circle(100, 400, 50, { density: 0.04, frictionAir: 0.005});
    // Matter.Composite.add(this.engine.world, ball)

    // Matter.Composite.add(this.engine.world, Matter.Constraint.create({
    //   pointA: { x: 300, y: 100 },
    //   bodyB: ball
    // }))

  }

  createBox() { // creates walls, ceiling & floor
    let rect = { x: 500, y: 1000, width: 1000, height: 50 }
    let ground = Matter.Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, { isStatic: true, mass: 10000})
    ground.restitution = 1
    let wallLeft = Matter.Bodies.rectangle(rect.y, rect.x, rect.height, rect.width, { isStatic: true, mass: 10000 })
    wallLeft.restitution = 1
    let wallRight = Matter.Bodies.rectangle(0, rect.x, rect.height, rect.width, { isStatic: true, mass: 10000 })
    wallRight.restitution = 1
    let ceiling = Matter.Bodies.rectangle(rect.x, 0, rect.width, rect.height, { isStatic: true, mass: 10000 })
    ceiling.restitution = 1
    Matter.Composite.add(this.engine.world, [ground, wallLeft, wallRight, ceiling])
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

  setToSketch=()=>{ // called from Canvas.setToSketch - changes mode t sketch & removes mouse interaction 
    this.setState({ mode: "sketch" })
    this.removeMouseInteraction()
    // console.log("sketch")
  };

  setToAction=()=>{
    this.setState({ mode: "action" })
    this.allowMouseInteraction()
    // console.log("action")
  };


  allowMouseInteraction(){
    Matter.Composite.add(this.engine.world, this.mouseConstraint)
    // console.log("added")
  }

  removeMouseInteraction(){
    Matter.Composite.remove(this.engine.world, this.mouseConstraint)
    // console.log("removed")
  }

  addPendulum(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    // console.log(start, end)

    let body = Matter.Bodies.circle(end.x, end.y, 30, { density: 0.01, frictionAir: 0.01, render: this.renderStyle })
    body.collisionFilter.category = this.toioCategory // added to the category which will be followed by a toio
    Matter.Composite.add(this.engine.world, body)
    Matter.Composite.add(this.engine.world, Matter.Constraint.create({ // pendulum rod
      pointA: start,
      bodyB: body,
      stiffness: 1,
      render: this.renderStyle
    }))
  }

  addSpring(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    // console.log(start, end)

    let body = Matter.Bodies.polygon(end.x, end.y, 4, 30, {density: 0.04, frictionAir: 0.01, render: this.renderStyle })
    body.collisionFilter.category = this.toioCategory
    Matter.Composite.add(this.engine.world, body)
    Matter.Composite.add(this.engine.world, Matter.Constraint.create({
      pointA: start,
      bodyB: body,
      stiffness: 0.02,
      render: this.renderStyle
    }))
  }

  addSlingshot(x, y, points){
    let start = { //slingshot anchor
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }

    let anchor = end;

    let rock = Matter.Bodies.polygon(anchor.x, anchor.y, 5, 30, {density: 0.04, render: this.renderStyle })
    rock.collisionFilter.category = this.toioCategory
    let elastic = Matter.Constraint.create({
      pointA: anchor,
      bodyB: rock,
      stiffness: 0.05,
      render: this.renderStyle
    })
    Matter.Composite.add(this.engine.world, rock)
    Matter.Composite.add(this.engine.world, elastic)

    Matter.Events.on(this.engine,'afterUpdate',()=>{ // removes the rock from the slingshot and adds a new one
      
      if (this.mouseConstraint.mouse.button ===-1 && (rock.position.x > anchor.x + 20  || rock.position.y < anchor.y - 20)) 
      {
        rock = Matter.Bodies.polygon(anchor.x, anchor.y, 5, 30, {density: 0.04});
        Matter.Composite.add(this.engine.world, rock);
        elastic.bodyB = rock;
      }
    })
  }

  afterUpdate() {

    let index = _.findIndex(this.engine.world.bodies, { collisionFilter: this.toioCategory }) // finds object in the toio category -  
    let body = this.engine.world.bodies[index]
    if (body) {
      let toioPos = {
        x: body.position.x / 2,
        y: body.position.y / 2,
      }
      // App.socket.emit('move', toioPos) // uncomment for toio
      // console.log(toioPos)
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