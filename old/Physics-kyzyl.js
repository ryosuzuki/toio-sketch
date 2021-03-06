import React, { Component } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva'
import _ from 'lodash'

import Matter from 'matter-js'
import MatterAttractors from 'matter-attractors'
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
      gravity:1,
      bodyIds: []
    }

    this.bodyRenderStyle = {
      fillStyle: 'white',
      // lineWidth: 2
    }
    this.wallRenderStyle = {
      fillStyle: 'grey',
      // lineWidth: 2
    }
    this.constraintRenderStyle = {
      strokeStyle: 'grey',
      fillStyle:'grey',
      lineWidth: 2
    }
    this.collideRenderStyle = {
      visible: false, // put true for debugging
      strokeStyle: 'grey',
      fillStyle:'white',
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
        // showPositions: true,
        // showAngleIndicator: true,
        // showVelocityIndicator: true,
        width: 1000,
        height: 1000,
        background: '#eee',
        wireframes:false,
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
    Matter.Events.on(engine, 'beforeUpdate', this.limitMaxSpeed.bind(this))
    Matter.Events.on(engine, 'beforeUpdate', this.magnetForce.bind(this))
    Matter.Events.on(engine, 'beforeUpdate', this.puzzleForce.bind(this))

    this.createBoundary()

    // let ball = Matter.Bodies.circle(100, 400, 50, { density: 0.04, frictionAir: 0.005});
    // Matter.Composite.add(this.engine.world, ball)

    // Matter.Composite.add(this.engine.world, Matter.Constraint.create({
    //   pointA: { x: 300, y: 100 },
    //   bodyB: ball
    // }))

  }

  createBoundary() { // creates walls, ceiling & floor
    let rect = { x: 500, y: 1000, width: 1000, height: 50 }
    let ground = Matter.Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, { isStatic: true, density: 1, render:this.wallRenderStyle })
    ground.restitution = 0 // no bounce
    let wallLeft = Matter.Bodies.rectangle(rect.y, rect.x, rect.height, rect.width, { isStatic: true, density: 1, render:this.wallRenderStyle })
    wallLeft.restitution = 0
    let wallRight = Matter.Bodies.rectangle(0, rect.x, rect.height, rect.width, { isStatic: true, density: 1, render:this.wallRenderStyle })
    wallRight.restitution = 0
    let ceiling = Matter.Bodies.rectangle(rect.x, 0, rect.width, rect.height, { isStatic: true, density: 1, render:this.wallRenderStyle })
    ceiling.restitution = 0
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
      render: constraintRenderStyle
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

    let body = Matter.Bodies.circle(end.x, end.y, 20, { density: 0.01, frictionAir: 0.01, render: this.bodyRenderStyle, label:"pendulum" })
    body.collisionFilter.category = this.toioCategory // added to the category which will be followed by a toio
    Matter.Composite.add(this.engine.world, body)
    Matter.Composite.add(this.engine.world, Matter.Constraint.create({ // pendulum rod
      pointA: start,
      bodyB: body,
      stiffness: 1,
      render: this.constraintRenderStyle
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

    let body = Matter.Bodies.polygon(end.x, end.y, 4, 20, {density: 0.04, frictionAir: 0.01, render: this.bodyRenderStyle })
    body.collisionFilter.category = this.toioCategory
    Matter.Composite.add(this.engine.world, body)
    Matter.Composite.add(this.engine.world, Matter.Constraint.create({
      pointA: start,
      bodyB: body,
      stiffness: 0.02,
      render: this.constraintRenderStyle
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

    let rock = Matter.Bodies.polygon(anchor.x, anchor.y, 5, 20, {density: 0.04, render: this.bodyRenderStyle })
    rock.collisionFilter.category = this.toioCategory
    let elastic = Matter.Constraint.create({
      pointA: anchor,
      bodyB: rock,
      stiffness: 0.05,
      render: this.constraintRenderStyle
    })
    Matter.Composite.add(this.engine.world, rock)
    Matter.Composite.add(this.engine.world, elastic)

    Matter.Events.on(this.engine,'afterUpdate',()=>{ // removes the rock from the slingshot and adds a new one
      
      if (this.mouseConstraint.mouse.button ===-1 && (rock.position.x > anchor.x + 20  || rock.position.y < anchor.y - 20)) 
      {
        rock = Matter.Bodies.polygon(anchor.x, anchor.y, 5, 20, {density: 0.04, render: this.bodyRenderStyle });
        Matter.Composite.add(this.engine.world, rock);
        elastic.bodyB = rock;
      }
    })
  }

  addSlingshot2(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    // console.log(start, end)

    let dist = (Math.sqrt( ((start.x-end.x)*(start.x-end.x)) + ((start.y-end.y)*(start.y-end.y)) ))
    // console.log(dist, Math.floor(dist/21)+1);
    let particleRadius=10
    let xx =start.x, yy=start.y, columns=1 , rows=Math.floor(dist/((2*particleRadius)+1))+5, columnGap=0, rowGap=0, crossBrace=true, particleOptions, constraintOptions;


    let Body = Matter.Body, 
    Bodies = Matter.Bodies,
    Common = Matter.Common,
    Composites = Matter.Composites;

    let group = Body.nextGroup(true);
    particleOptions = Common.extend({ inertia: Infinity, friction: 0.01, collisionFilter: { group: group }, render:{visible:false, fillStyle:'grey'}}, particleOptions);
    constraintOptions = Common.extend({ stiffness: 1, render: { type: 'line', anchors: false, strokeStyle:'grey' } }, constraintOptions);
    
    let stack_x = start.x - ((end.x-start.x)/rows); // holds the position of circles in the stack
    let stack_y = start.y - ((end.y-start.y)/rows); // holds the position of circles in the stack

    let cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
      stack_x = stack_x + ((end.x-start.x)/rows)
      stack_y = stack_y + ((end.y-start.y)/rows)
      return Bodies.polygon(stack_x, stack_y ,4, particleRadius, particleOptions) //Bodies.polygon(x, y, 4, particleRadius, particleOptions)  
    });



    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);
    cloth.label = 'slingshot2';

    // for (var i = 0; i < 20; i++) {
    //     cloth.bodies[i].isStatic = true;
    // }
    cloth.bodies[0].isStatic = true
    cloth.bodies[cloth.bodies.length-1].isStatic = true
    cloth.bodies[0].render.visible = true
    cloth.bodies[cloth.bodies.length-1].render.visible = true
    // cloth.bodies[0].render = this.wallRenderStyle
    // cloth.bodies[cloth.bodies.length-1].render = this.wallRenderStyle

    // Matter.Composite.add(this.engine.world, Matter.Bodies.circle(end.x, end.y, 30, {render: this.bodyRenderStyle }))

    Matter.Composite.add(this.engine.world, [
        cloth,
        //Bodies.circle(end.x, end.y, 80, { isStatic: true, render: this.bodyRenderStyle})
    ]);

    // let body = Matter.Bodies.polygon(end.x, end.y, 4, 30, {density: 0.04, frictionAir: 0.01, render: this.bodyRenderStyle })
    // body.collisionFilter.category = this.toioCategory
    // Matter.Composite.add(this.engine.world, body)
    // Matter.Composite.add(this.engine.world, Matter.Constraint.create({
    //   pointA: start,
    //   bodyB: body,
    //   stiffness: 0.02,
    //   render: render: this.bodyRenderStyle
    // }))
  }


  addFreeString(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    // console.log(start, end)

    let dist = (Math.sqrt( ((start.x-end.x)*(start.x-end.x)) + ((start.y-end.y)*(start.y-end.y)) ))
    // console.log(dist, Math.floor(dist/21)+1);
    let particleRadius=10
    let xx =start.x, yy=start.y, columns=1 , rows=Math.floor(dist/((2*particleRadius)+1))+5, columnGap=0, rowGap=0, crossBrace=true, particleOptions, constraintOptions;

    let Body = Matter.Body, 
    Bodies = Matter.Bodies,
    Common = Matter.Common,
    Composites = Matter.Composites;

    let group = Body.nextGroup(true);
    particleOptions = Common.extend({ inertia: Infinity, friction: 0.01, collisionFilter: { group: group },render:{visible:false, fillStyle:'white'}}, particleOptions);
    constraintOptions = Common.extend({ stiffness: 0.8, render: { type: 'line', anchors: false, strokeStyle:'grey' } }, constraintOptions);
    
    let stack_x = start.x - ((end.x-start.x)/rows); // holds the position of circles in the stack
    let stack_y = start.y - ((end.y-start.y)/rows); // holds the position of circles in the stack

    let cloth = Composites.stack(xx, yy, columns, rows, columnGap, rowGap, function(x, y) {
      stack_x = stack_x + ((end.x-start.x)/rows)
      stack_y = stack_y + ((end.y-start.y)/rows)
      return Bodies.circle(stack_x, stack_y , particleRadius, particleOptions); //Bodies.polygon(x, y, 4, particleRadius, particleOptions)  
    });

    Composites.mesh(cloth, columns, rows, crossBrace, constraintOptions);
    cloth.label = 'freestring';

    // for (var i = 0; i < 20; i++) {
    //     cloth.bodies[i].isStatic = true;
    // }
    cloth.bodies[0].render.visible = true;
    cloth.bodies[cloth.bodies.length-1].render.visible = true;
    // cloth.bodies[0].render = this.bodyRenderStyle
    // cloth.bodies[cloth.bodies.length-1].render = this.bodyRenderStyle

    Matter.Composite.add(this.engine.world, [
        cloth
    ]);

    

    // let body = Matter.Bodies.polygon(end.x, end.y, 4, 30, {density: 0.04, frictionAir: 0.01, render: this.bodyRenderStyle })
    // body.collisionFilter.category = this.toioCategory
    // Matter.Composite.add(this.engine.world, body)
    // Matter.Composite.add(this.engine.world, Matter.Constraint.create({
    //   pointA: start,
    //   bodyB: body,
    //   stiffness: 0.02,
    //   render: render: this.bodyRenderStyle
    // }))
  }

  addWall(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    // console.log(start, end)

    let bodyVector =  Matter.Vector.sub(start, end),
    lengthOfBody = this.getDistance(start, end),
    bodyPosition = {x:(start.x+end.x)/2, y:(start.y+end.y)/2}
    let body = Matter.Bodies.rectangle(bodyPosition.x, bodyPosition.y, lengthOfBody , 20 , {density: 0.04, frictionAir: 0.01, render: this.wallRenderStyle, angle:Matter.Vector.angle(bodyVector, {x:0, y:0}) })
    body.isStatic = true
    Matter.Composite.add(this.engine.world, body)
  }

  addBox(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    // console.log(start, end)

    let bodyVector =  Matter.Vector.sub(start, end),
    lengthOfBody = 30,
    bodyPosition = start
    let body = Matter.Bodies.rectangle(bodyPosition.x, bodyPosition.y, lengthOfBody , 30 , {density: 0.04, frictionAir: 0.01, render: this.bodyRenderStyle, angle:Matter.Vector.angle(bodyVector, {x:0, y:0}), force: {x: -bodyVector.x/200, y: -bodyVector.y/200 } })
    Matter.Composite.add(this.engine.world, body)
  }

  addMetalBox(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    // console.log(start, end)

    let bodyVector =  Matter.Vector.sub(start, end),
    lengthOfBody = 30,
    bodyPosition = start
    // let body = Matter.Bodies.rectangle(bodyPosition.x, bodyPosition.y, lengthOfBody , 30 , {density: 0.04, label:"metalbox" ,frictionAir: 0.01, render: this.bodyRenderStyle, angle:Matter.Vector.angle(bodyVector, {x:0, y:0}), force: {x: -bodyVector.x/20000, y: -bodyVector.y/20000 } })
    // Matter.Composite.add(this.engine.world, body)
    let body = Matter.Bodies.polygon(end.x, end.y, 4, 4, {density: 0.0004, frictionAir: 0.01, render: {fillStyle: '#D5D5D5'}, chamfer:30, label: "metalbox"})
    Matter.Composite.add(this.engine.world, body)
  }

  addPuzzle(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }

    // let vertices = [
    //   {x : 0 , y : 0},
    //   {x : 0 , y : 50},
    //   {x : 25 , y : 25},
    //   {x : 50 , y : 50},
    //   {x : 50 , y : 0}
    // ]
    let vertices = [
      {x : 0 , y : 0},
      
      {x : 17, y : 0},
      {x : 17, y : -10},
      {x : 33, y : -10},
      {x : 33, y : 0},
      
      {x : 50 , y : 0},
      
      
      {x : 50, y : 15},
      {x : 40, y : 15},
      {x : 40, y : 35},
      {x : 50, y : 35},
      
      
      {x : 50 , y : 50},
      
      {x : 35 , y : 50},
      {x : 35 , y : 40},
      {x : 15 , y : 40},
      {x : 15 , y : 50},

      {x : 0 , y : 50},

      {x : 0 , y : 33},
      {x : -10 , y : 33},
      {x : -10 , y : 17},
      {x : 0 , y : 17},
    ]
    
    // var chamfer = options.chamfer;
    // let chamferedVertices = Matter.Vertices.chamfer(vertices, 2, 2, 1, 3);
    // console.log(chamferedVertices);
    let body = Matter.Bodies.fromVertices(start.x, start.y, vertices, {density: 1, render: this.bodyRenderStyle, chamfer: [2,2,20,20,20], label:'puzzle'})
    body.collisionFilter.category = this.toioCategory
    Matter.Composite.add(this.engine.world, body)
    // Matter.Body.setCentre(body,{x:x,y:y})
  }

  addMagnet(x, y, points) {
    let start = {
      x: points[0] + x,
      y: points[1] + y
    }
    let end = {
      x: points[points.length-2] + x,
      y: points[points.length-1] + y,
    }
    // console.log(start, end)

    let bodyN = Matter.Bodies.rectangle(end.x+30, end.y, 60, 30, {density: 1, mass:100, frictionAir: 0.01,  label:"magnetN", render:{fillStyle: '#F55A3C'}})
    let bodyS = Matter.Bodies.rectangle(end.x-30, end.y, 60, 30, {density: 1, mass: 100, frictionAir: 0.01,  label:"magnetS", render:{fillStyle: '#063E7B'}})
    let body = Matter.Body.create({parts: [bodyN, bodyS], label:"magnet"});
    Matter.Composite.add(this.engine.world, body)
  }


  
  gravityZero(){
    this.engine.gravity.y =0;
  }
  gravityOne(){
    this.engine.gravity.y =1;
  }
  changeTime(x){
    this.engine.timing.timeScale = x;
  }

  afterUpdate() {
    // const delta = 1000 / 60;
    // const subSteps = 3;
    // const subDelta = delta / subSteps;
    // Matter.Engine.update(engine, subDelta);


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
  
  limitMaxSpeed()
  {
    // console.log(body.velocity)
    // let maxSpeed = 10000;
    // if (body.velocity.x > maxSpeed) {
    //   Body.setVelocity(body, { x: maxSpeed, y: body.velocity.y });
    // }

    // if (body.velocity.x < -maxSpeed) {
    //     Body.setVelocity(body, { x: -maxSpeed, y: body.velocity.y });
    // }

    // if (body.velocity.y > maxSpeed) {
    //     Body.setVelocity(body, { x: body.velocity.x, y: maxSpeed });
    // }

    // if (body.velocity.y < -maxSpeed) {
    //     Body.setVelocity(body, { x: -body.velocity.x, y: -maxSpeed });
    // }
  }

  getDistance(A, B) { 
    let xA = A.x,
    yA = A.y,
    xB = B.x,
    yB = B.y
    var xDiff = xA - xB; 
    var yDiff = yA - yB;
  
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  }

  getUnitVector(A){
    let U = { x: A.x/Math.sqrt((A.x*A.x)+ (A.y*A.y)), y: A.y/Math.sqrt((A.x*A.x)+ (A.y*A.y))}
    return U
  }

  getAttractionUnitForce(A,B){
    let attractforce = {x: B.x - A.x, y: B.y - A.y}
    return this.getUnitVector(attractforce);
  }

  getRepellingUnitForce(A,B){
    let repelforce = {x: A.x - B.x, y:A.y - B.y}
    return this.getUnitVector(repelforce);
  }

  attractiveMagnetBody(bodyA, bodyB) {
    // use Newton's law of gravitation
    var bToA = Matter.Vector.sub(bodyB.position, {x:bodyA.position.x ,y:bodyA.position.y}),
      distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001,
      normal = Matter.Vector.normalise(bToA),
      gravityConstant = 0.01,
      magnitude = -gravityConstant * (bodyA.mass * bodyB.mass / distanceSq),
      force = Matter.Vector.mult(normal, magnitude);

    // to apply forces to both bodies
    // Matter.Body.applyForce(bodyA,  {x:bodyA.position.x+60 ,y:bodyA.position.y}, Matter.Vector.neg(force));
    Matter.Body.applyForce(bodyB, bodyB.position, force);

    // // use Newton's law of gravitation
    // var bToA = Matter.Vector.sub(bodyB.position, {x:bodyA.position.x-60 ,y:bodyA.position.y}),
    // distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001,
    // normal = Matter.Vector.normalise(bToA),
    // gravityConstant = 0.001,
    // magnitude = -gravityConstant * (bodyA.mass * bodyB.mass / distanceSq),
    // force = Matter.Vector.mult(normal, magnitude);

    // // to apply forces to both bodies
    // // Matter.Body.applyForce(bodyA,  {x:bodyA.position.x-60 ,y:bodyA.position.y}, Matter.Vector.neg(force));
    // Matter.Body.applyForce(bodyB, bodyB.position, force);
    
    
    
  }

  attractivePuzzleBody(bodyA, bodyB) {
    // use Newton's law of gravitation
    var bToA = Matter.Vector.sub({x:bodyB.position.x , y:bodyB.position.y}, {x:bodyA.position.x+15 , y:bodyA.position.y}),
      distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001,
      normal = Matter.Vector.normalise(bToA),
      gravityConstant = 0.001,
      magnitude = -gravityConstant * (bodyA.mass * bodyB.mass / distanceSq),
      force = Matter.Vector.mult(normal, magnitude);

    // to apply forces to both bodies
    Matter.Body.applyForce(bodyA, {x:bodyA.position.x+15 , y:bodyA.position.y}, Matter.Vector.neg(force));
    Matter.Body.applyForce(bodyB, {x:bodyB.position.x , y:bodyB.position.y}, force);

    // use Newton's law of gravitation
    var bToA = Matter.Vector.sub({x:bodyB.position.x , y:bodyB.position.y}, {x:bodyA.position.x , y:bodyA.position.y+15}),
      distanceSq = Matter.Vector.magnitudeSquared(bToA) || 0.0001,
      normal = Matter.Vector.normalise(bToA),
      gravityConstant = 0.001,
      magnitude = -gravityConstant * (bodyA.mass * bodyB.mass / distanceSq),
      force = Matter.Vector.mult(normal, magnitude);

    // to apply forces to both bodies
    Matter.Body.applyForce(bodyA, {x:bodyA.position.x , y:bodyA.position.y+15}, Matter.Vector.neg(force));
    Matter.Body.applyForce(bodyB, {x:bodyB.position.x , y:bodyB.position.y}, force);
  }


  magnetForce()
  {
    let bodies = Matter.Composite.allBodies(this.engine.world);
    for(let i=0;i<bodies.length;i++)
    { 
     
      for(let j=0;(j<bodies.length);j++)
      {
        // console.log(i,j,bodies.length, bodies[i].label, bodies[j].label);
        if(bodies[i].label=="magnet" && bodies[j].label=="metalbox"){
          let magnet = bodies[i],
          box = bodies[j],
          magnetPos = bodies[i].position,
          boxPos = bodies[j].position

          if(this.getDistance(magnetPos, boxPos) <= 60 )
          {
            this.attractiveMagnetBody(magnet,box)
          }
        }
      }
    }
  }

  puzzleForce()
  {
    let bodies = Matter.Composite.allBodies(this.engine.world);
    for(let i=0;i<bodies.length;i++)
    { 
      for(let j=0;(j<bodies.length);j++)
      {
        // console.log(i,j,bodies.length, bodies[i].label, bodies[j].label);
        if(bodies[i].label=="puzzle" && bodies[j].label=="puzzle" && j!=i){
          let magnet = bodies[i],
          box = bodies[j],
          magnetPos = bodies[i].position,
          boxPos = bodies[j].position

          if(this.getDistance(magnetPos, boxPos) <= 60 && this.getDistance(magnetPos, boxPos) >= 55)
          {
            this.attractivePuzzleBody(magnet,box)
          }
        }
      }
    }
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