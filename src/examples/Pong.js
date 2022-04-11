class Pong {
  init(canvas) {
    canvas.example = 'pong'
    let shapes = canvas.state.shapes

    //  disable gravity ----------uncomment line 49 in Physics.js
    let shape1 = { // wall
      x: 500,
      y: 150,
      width: 800,
      height: 50,
      type: 'rect',
      physics: 'static',
      rotation: 0
    }
    shapes.push(shape1)

    let shape2 = { // wall
      x: 500,
      y: 1024-150,
      width: 800,
      height: 50,
      type: 'rect',
      physics: 'static',
      rotation: 0
    }
    shapes.push(shape2)

    let shape3 = { // virtual ball
      x: 400,
      y: 400,
      radius: 50,
      type: 'circle',
      physics: 'dynamic',
      visible: true
    }
    shapes.push(shape3)

    let shape4 = { // toio ball
      x: 600,
      y: 600,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynamic',
      rotation: 0
    }
    shapes.push(shape4)

    let toio1 = { // paddle R
      x: 900,
      y: 650,
      width: App.toioSize,
      height: App.toioSize*4,
      type: 'rect',
      physics: 'float',
      rotation: 0
    }
    shapes.push(toio1)

    let toio2 = { // paddle L
      x: 100,
      y: 400,
      width: App.toioSize,
      height: App.toioSize*4,
      type: 'rect',
      physics: 'float',
      rotation: 0
    }
    shapes.push(toio2)

    canvas.setState({ shapes: shapes })
  }
}

export default Pong