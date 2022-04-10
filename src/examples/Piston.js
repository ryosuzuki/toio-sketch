class Piston {
  init(canvas) {
    let shapes = canvas.state.shapes

    let shape1 = { //  joint
      x: 240,
      y: 300,
      radius: 40,
      type: 'circle',
      physics: 'float',
      visible: true
    }
    shapes.push(shape1)

    let shape2 = { // crank
      x: 240,
      y: 512,
      radius: 160,
      type: 'circle',
      physics: 'static',
      visible: true
    }
    shapes.push(shape2)

    let toio1 = { // for toio  // PISTON
      x: 600,
      y: 512,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynammic',
      rotation: 0
    }
    shapes.push(toio1)

    let shape5 = { // wall
      x: 700,
      y: 512-55,
      width: 400,
      height: 50,
      type: 'rect',
      physics: 'static',
      rotation: 0
    }
    shapes.push(shape5)

    let shape6 = { // wall
      x: 700,
      y: 512+55,
      width: 400,
      height: 50,
      type: 'rect',
      physics: 'static',
      rotation: 0
    }
    shapes.push(shape6)

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

    canvas.setState({ shapes: shapes })
  }
}

export default Piston