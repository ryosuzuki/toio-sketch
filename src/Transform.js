import _ from 'lodash'
import svgPathBbox from 'svg-path-bbox'
import { pathParse, serializePath } from 'svg-path-parse'

class Transform {
  constructor() {
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

  getTransitionPaths(shapes) {
    let paths = shapes.map((shape) => {
      return shape.map((curve) => {
        let d = `M${curve[0]},${curve[1]} C${curve[2]},${curve[3]} ${curve[4]},${curve[5]} ${curve[6]},${curve[7]}`
        return { data: d }
      })
    })
    paths = _.flattenDeep(paths)
    return paths
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

}

export default Transform