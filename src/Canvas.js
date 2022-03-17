import React, { Component } from 'react'
import { Stage, Layer, Rect, Line } from 'react-konva'
import Physics from './Physics'

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    
    this.state = {
      mode:"sketch", // sketch or action, passed on to Physics - sketch impleemnted in Canvas, action in Physics
      objectToSketch:"pendulum", // Canvas solely handles object to be sketched 
      gravity: 1,
      time: 1,
      dragging: false,
      currentPoints: [], // drawn points
      rects: [],
      lines: []
    }

    this.updateMode=React.createRef()

  }

  componentDidMount() {

    document.addEventListener('mousedown', this.mouseDown.bind(this))
    document.addEventListener('mousemove', this.mouseMove.bind(this))
    document.addEventListener('mouseup', this.mouseUp.bind(this))
    this.setToSketch = this.setToSketch.bind(this)
    this.setToAction = this.setToAction.bind(this)
    this.setToSpring = this.setToSpring.bind(this)
    this.setToPendulum = this.setToPendulum.bind(this)
    this.setToSlingshot = this.setToSlingshot.bind(this)
    this.setToSlingshot2 = this.setToSlingshot2.bind(this)
    this.setToFreeString = this.setToFreeString.bind(this)
    this.setToWall = this.setToWall.bind(this)
    this.setToBox = this.setToBox.bind(this)
    this.setGravityZero = this.setGravityZero.bind(this)
    this.setGravityOne = this.setGravityOne.bind(this)
    this.setTimeSpeed = this.setTimeSpeed.bind(this)
  }

  mouseDown(event) {

    if(event.x<1024 && event.y < 1024)
    {
      if(this.state.mode=="sketch")
      {
        this.setState({ dragging: true })
        this.setState({ currentPoints: [] })
      }
    }

  }

  mouseMove(event) {
    if(this.state.mode=="sketch")
    {
      if (!this.state.dragging) return false
      let points = this.state.currentPoints
      let x = event.clientX
      let y = event.clientY
      points = points.concat([x, y])
      this.setState({ currentPoints: points })
    }
  }

  mouseUp(event) {
    if(this.state.mode=="sketch")
    {
      let points = this.state.currentPoints
      let lines = this.state.lines

      let node = new Konva.Line({ points: points })
      let bb = node.getClientRect()
      let x = bb.x + bb.width/2
      let y = bb.y + bb.height/2
      points = points.map((num, i) => {
        return (i % 2 === 0) ? num - x : num - y
      })
      // lines.push({
      //   x: x,
      //   y: y,
      //   points: points
      // })
      if(this.state.objectToSketch=="pendulum")
        window.Physics.addPendulum(x, y, points)
      else if(this.state.objectToSketch=="spring")
        window.Physics.addSpring(x, y, points)
      else if(this.state.objectToSketch=="slingshot")
        window.Physics.addSlingshot(x, y, points)
      else if(this.state.objectToSketch=="slingshot2")
        window.Physics.addSlingshot2(x, y, points)
      else if(this.state.objectToSketch=="freeString")
        window.Physics.addFreeString(x, y, points)
      else if(this.state.objectToSketch=="wall")
        window.Physics.addWall(x, y, points)
      else if(this.state.objectToSketch=="box")
        window.Physics.addBox(x, y, points)
      this.setState({ dragging: false, currentPoints: [], lines: lines })
    }
  }

  setToSketch(){ // calls Physics.setToSketch
    this.setState({ mode: "sketch" })
    this.updateMode.current.setToSketch()
  }

  setToAction(){
    this.setState({ mode: "action" })
    this.updateMode.current.setToAction()
  }

  setToSpring(){ 
    this.setState({ objectToSketch: "spring" })
  }

  setToPendulum(){
    this.setState({ objectToSketch: "pendulum" })
  }

  setToSlingshot(){
    this.setState({ objectToSketch: "slingshot" })
  }
  setToSlingshot2(){
    this.setState({ objectToSketch: "slingshot2" })
  }
  setToFreeString(){
    this.setState({ objectToSketch: "freeString" })
  }
  setToWall(){
    this.setState({ objectToSketch: "wall" })
  }
  setToBox(){
    this.setState({ objectToSketch: "box" })
  }
  setGravityZero(){
    this.setState({ gravity: 0 })
    window.Physics.gravityZero()
  }
  setGravityOne(){
    this.setState({ gravity: 1 })
    window.Physics.gravityOne()
  }
  setTimeSpeed(event){
    this.setState({ time: event.target.value })
    window.Physics.changeTime(event.target.value)
  }
  

  render() {
    return (
      <>
        <Physics ref={this.updateMode}/>
        <Stage width={ 1024 } height={ 1024 }>
          <Layer ref={ ref => this.layer = ref }>
            {/* { this.state.rects.map((rect, i) => { // border for rectangles
              return (
                <Rect x={rect.x} y={rect.y} width={rect.width} height={rect.height}      offsetX={ rect.width/2 } offsetY={ rect.height/2 } stroke={ 'black' } />
              )
            })} */}
            <Line
              points={ this.state.currentPoints }
              stroke={ 'grey' }
            />
            {/* { this.state.lines.map((line, i) => {
              return (
                <Line
                  id={ `line-${i}` }
                  x={ line.x }
                  y={ line.y }
                  points={ line.points }
                  stroke={ 'red' }
                />
              )
            })} */}

          </Layer>
        </Stage>
        <div style={{display:"block" ,fontFamily:'sans-serif'}}> 
        {"Objects to Sketch: "}
        <button onClick={this.setToSpring} disabled = {(this.state.mode=="action" || this.state.objectToSketch=="spring")} style={{padding:"10px", margin:"10px"}}>Spring</button>
        <button onClick={this.setToPendulum} disabled = {(this.state.mode=="action" || this.state.objectToSketch=="pendulum")} style={{padding:"10px", margin:"10px"}}>Pendulum</button>
        <button onClick={this.setToSlingshot} disabled = {(this.state.mode=="action" || this.state.objectToSketch=="slingshot")} style={{padding:"10px", margin:"10px"}}>Slingshot</button>
        <button onClick={this.setToSlingshot2} disabled = {(this.state.mode=="action" || this.state.objectToSketch=="slingshot2")} style={{padding:"10px", margin:"10px"}}>Slingshot2</button>
        <button onClick={this.setToFreeString} disabled = {(this.state.mode=="action" || this.state.objectToSketch=="freeString")} style={{padding:"10px", margin:"10px"}}>Free String</button>
        <button onClick={this.setToWall} disabled = {(this.state.mode=="action" || this.state.objectToSketch=="wall")} style={{padding:"10px", margin:"10px"}}>Wall</button>
        <button onClick={this.setToBox} disabled = {(this.state.mode=="action" || this.state.objectToSketch=="box")} style={{padding:"10px", margin:"10px"}}>Box</button>

        <br></br>
        {"Mode: "}
       <button onClick={this.setToAction} disabled = {(this.state.mode=="action")} style={{padding:"10px", margin:"10px"}}> Performing an Action</button>
       <button onClick={this.setToSketch} disabled = {(this.state.mode=="sketch")} style={{padding:"10px", margin:"10px"}}> Sketching an Object</button>

       <br></br>
        {"Gravity: "}
       <button onClick={this.setGravityZero} disabled = {(this.state.gravity==0)} style={{padding:"10px", margin:"10px"}}> Zero</button>
       <button onClick={this.setGravityOne} disabled = {(this.state.gravity==1)} style={{padding:"10px", margin:"10px"}}> One</button>
       
       <br></br>
       {"Time "}
       <input onInput={this.setTimeSpeed} type="range" min="0.1" max="2" step="0.1"></input>

        </div>
      </>
    )
  }


}

export default Canvas