class Rope {
  init(canvas) {
    canvas.example = 'rope'
    let shapes = canvas.state.shapes

    /*
    let toio = { // for toio
      x: 200,
      y: 700,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynammic',
      rotation: 0
    }
    shapes.push(toio)

    let toio2 = { // for toio
      x: 300,
      y: 700,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynammic',
      rotation: 0
    }
    shapes.push(toio2)

    let toio3 = { // for toio
      x: 400,
      y: 700,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynammic',
      rotation: 0
    }
    shapes.push(toio3)
    */

    canvas.setState({ shapes: shapes })
  }

  show(canvas, line) {
    let shapes = canvas.state.shapes

    // let start = 100
    // let offset = 40
    let ropeSize = 24;
    let pp = 'static'
    let vv = true

    console.log(line)

    let start = { x: line.points[0], y: line.points[1] }
    let end = { x: line.points[2], y: line.points[3] }
    let dist = Math.sqrt((end.x - start.x)**2 + (end.y - start.y)**2)
    let offset = {
      x: (end.x - start.x)/(ropeSize+1),
      y: (end.y - start.y)/(ropeSize+1)
    }

    // ropeSize = ropeSize + 3

    let anchor = {
      x: start.x,
      y: start.y,
      radius: 20,
      type: 'circle',
      physics: 'static',
    }
    shapes.push(anchor)

    for (let i = 1; i < ropeSize; i++) {
      let shape = { //rope ends & invisible bodies
        x: start.x + offset.x*i,
        y: start.y + offset.y*i,
        radius: Math.max(offset.x, offset.y)/3 ,
        type: 'circle',
        physics: 'dynamic',
        visible: false
      }
      shapes.push(shape)
    }

    let anchor2 = {
      x: start.x + offset.x*ropeSize,
      y: start.y + offset.y*ropeSize,
      radius: 20,
      type: 'circle',
      physics: 'dynamic',
    }
    shapes.push(anchor2)

    let last = ropeSize
    for (let i = 0; i < ropeSize-1; i++){ // rope
      let shape = {
        x: 0,
        y: 0,
        points: [
          start.x + offset.x*i,
          start.y + offset.y*i,
          start.x + offset.x*(i+1),
          start.y + offset.y*(i+1)
        ],
        // type: 'line'
        type: 'linetwo',
        physics: 'constrainttwo'
      }
      shapes.push(shape)
    }

    canvas.setState({ shapes: shapes })
  }

}

export default Rope