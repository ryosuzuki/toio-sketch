class Piston {
  init(canvas) {
    canvas.example = 'piston'
    let shapes = canvas.state.shapes

    /*
    let toio1 = { //  joint
      x: 240,
      y: 300,
      type: 'toio',
      physics: 'float'
    }
    shapes.push(toio1)

    let toio2 = { // for toio  // PISTON
      x: 600,
      y: 512,
      type: 'toio',
      physics: 'dynammic',
    }
    shapes.push(toio2)
    */

    let wall1 = { // wall
      x: 700,
      y: 512-55,
      width: 400,
      height: 50,
      type: 'rect',
      physics: 'static',
      rotation: 0
    }
    shapes.push(wall1)

    let wall2 = { // wall
      x: 700,
      y: 512+55,
      width: 400,
      height: 50,
      type: 'rect',
      physics: 'static',
      rotation: 0
    }
    shapes.push(wall2)

    /*
    let shape2 = { // crank
      x: 240,
      y: 512,
      radius: 160,
      type: 'circle',
      physics: 'static',
      visible: true
    }
    shapes.push(shape2)

    let shape3 = {
      x: 0,
      y: 0,
      points: [240, 512, 240, 300],
      type: 'line',
      physics: 'constraint'
    }
    shapes.push(shape3)

    let shape7 = {
      x: 0,
      y: 0,
      points: [240, 300, 600, 512],
      type: 'linetwo',
      physics: 'constrainttwo'
    }
    shapes.push(shape7)
    */

    canvas.setState({ shapes: shapes })
  }
}

export default Piston