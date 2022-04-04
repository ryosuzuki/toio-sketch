import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line, Group, Circle, Path } from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'
import pasition from 'pasition'
import svgPathBbox from 'svg-path-bbox'
import { pathParse, serializePath } from 'svg-path-parse'

import Physics from './Physics2'

window.Konva = Konva
let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      mode: 'drawing',
      lines: [],
      circles: [],
      currentPoints: [],
      currentPaths: [],
      isPhysics: true
    }
  }

  componentDidMount() {
  }

  mouseDown(pos) {
    this.setState({ isPaint: true, currentPoints: [pos.x, pos.y, pos.x, pos.y] })
  }

  mouseMove(pos) {
    if (!this.state.isPaint) return false
    let points = this.state.currentPoints
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return false
    points = points.concat([pos.x, pos.y])
    this.setState({ currentPoints: points })
  }

  mouseUp(pos) {
    if (!this.state.isPaint) return false
    this.setState({ isPaint: false })
    if (this.state.currentPoints.length === 0) return false
    let lines = this.state.lines
    let physics = (this.state.isPhysics && this.state.mode === 'drawing')
    /*
    let x = 0, y = 0, radius = Math.min(bb.width, bb.height)
    let line = {
      x: x,
      y: y,
      points: points,
      type: this.state.mode,
      physics: physics,
    }
    lines.push(line)
    */
    this.morph()

    // this.setState({ lines: lines, currentPoints: [] })
    // if (this.state.mode === 'emitter') {
    //   this.emit.start()
    // }
  }

  morph() {
    let points = this.state.currentPoints
    let node = new Konva.Line({ points: points })
    let bb = node.getClientRect()
    let ox = bb.x + bb.width / 2
    let oy = bb.y + bb.height / 2
    let radius = Math.min(bb.width, bb.height) / 2
    let circle = {
      x: ox,
      y: oy,
      radius: radius,
      type: this.state.mode,
      physics: true,
    }
    let paths = this.getPaths(points, bb)

    let prev
    pasition.animate({
      from: paths.from,
      to: paths.to,
      time: 500,
      begin: (shapes) => {
        this.setState({ currentPoints: [] })
      },
      progress: (shapes, percent) => {
        let paths = shapes.map((shape) => {
          return shape.map((curve) => {
            let d = `M${curve[0]},${curve[1]} C${curve[2]},${curve[3]} ${curve[4]},${curve[5]} ${curve[6]},${curve[7]}`
            return { data: d }
          })
        })
        paths = _.flattenDeep(paths)
        this.setState({ currentPaths: paths })
      },
      end: (shapes) => {
        console.log('end')
        let circles = this.state.circles
        circles.push(circle)
        this.setState({ currentPaths: [], circles: circles })
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

  enablePhysics() {
    this.setState({ isPhysics: !this.state.isPhysics })
  }


  getPaths(points, bb) {
    let d = `M ${points[0]} ${points[1]} `
    for (let i = 0; i < points.length-1; i = i+2 ) {
      let point = points[i]
      let next = points[i+1]
      d += `L ${point} ${next} `
    }
    let ratio = bb.width / bb.height

    let d0 = d
    // rectangle
    let d1 = 'M280,250L280,240L380,240L380,250Z'
    // circle
    d1 = 'M280,250A200,200,0,1,1,680,250A200,200,0,1,1,280,250Z'
    // d1 = 'M280,250L380,250'
    if (ratio < 0.2 || 10 < ratio) {
      let last = points.length-1
      d1 = `M${points[0]},${points[1]}L${points[last-1]},${points[last]}`
    }

    let d2 = this.translateToOrigin(d0, d1)
    let d3 = this.scaleSize(d0, d2)
    let d4 = this.translateToPosition(d, d3)

    return { from: d, to: d4 }
  }

  getBoundingBox(d) {
    let d0 = d
    let ob = svgPathBbox(d0)
    let ox = (ob[0] + ob[2])/2
    let oy = (ob[1] + ob[3])/2
    let ow = ob[2] - ob[0]
    let oh = ob[3] - ob[1]
    let ratio = ow / oh
    let res = {
      x: ox, y: oy, width: ow, height: oh
    }
    return res
  }

  translateToOrigin(d0, d1) {
    let bb = svgPathBbox(d1)
    let tw = bb[2] - bb[0]
    let th = bb[3] - bb[1]
    let a = pathParse(d1).absNormalize({ transform: `translate(${-bb[0]-tw/2} ${-bb[1]-th/2})`})
    // + 30 for heart for some reason
    d1 = serializePath(a)
    return d1
  }

  scaleSize(d0, d1) {
    let ob = svgPathBbox(d0)
    let ow = ob[2] - ob[0]
    let oh = ob[3] - ob[1]

    let bb = svgPathBbox(d1)
    let tw = bb[2] - bb[0]
    let th = bb[3] - bb[1]
    let a = pathParse(d1).absNormalize({ transform: `scale(${(1/tw)*ow} ${(1/th)*oh})` })
    d1 = serializePath(a)
    return d1
  }

  translateToPosition(d0, d1) {
    let ob = svgPathBbox(d0)
    let ox = (ob[0] + ob[2])/2
    let oy = (ob[1] + ob[3])/2
    let a = pathParse(d1).absNormalize({ transform: `translate(${ox} ${oy})`})
    d1 = serializePath(a)
    return d1
  }

  render() {
    return (
      <>
        <div style={{ display: debug ? 'block' : 'none' }}>
          <Stage width={ App.size } height={ App.size }>
            <Layer ref={ ref => (this.layer = ref) }>
              <Line
                points={ this.state.currentPoints }
                stroke={ 'black' }
              />
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
              { this.state.lines.map((line, i) => {
                  return (
                    <Line
                      key={ i }
                      id={ `line-${i}` }
                      name={ `line-${i}` }
                      physics={ line.physics }
                      x={ line.x }
                      y={ line.y }
                      points={ line.points }
                      stroke={ this.color(line.type) }
                    />
                  )
              }) }
              { this.state.circles.map((circle, i) => {
                  return (
                    <Circle
                      key={ i }
                      id={ `circle-${i}` }
                      name={ `circle-${i}` }
                      physics={ circle.physics }
                      x={ circle.x }
                      y={ circle.y }
                      radius={ circle.radius }
                      points={ circle.points }
                      stroke={ this.color(circle.type) }
                    />
                  )
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