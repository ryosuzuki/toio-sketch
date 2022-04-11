class Pong {
  init(canvas) {
    canvas.example = 'pong'
    let shapes = canvas.state.shapes

    /*
    let toio1 = { // paddle R
      x: 900,
      y: 650,
      height: App.toioSize*4,
      type: 'toio',
      physics: 'float',
      angleFix: true,
    }
    shapes.push(toio1)

    let toio2 = { // paddle L
      x: 100,
      y: 400,
      height: App.toioSize*4,
      type: 'toio',
      physics: 'float',
      angleFix: true,
    }
    shapes.push(toio2)
    */

    /*
    let toio = { // toio ball
      x: 600,
      y: 600,
      type: 'toio',
      physics: 'dynamic',
    }
    shapes.push(toio)
    */

    let ball = { // virtual ball
      x: 150,
      y: 400,
      radius: 50,
      type: 'circle',
      physics: 'dynamic',
    }
    shapes.push(ball)

    let wall1 = { // wall
      x: 500,
      y: 150,
      width: 800,
      height: 50,
      type: 'rect',
      physics: 'static',
    }
    shapes.push(wall1)

    let wall2 = { // wall
      x: 500,
      y: 1024-150,
      width: 800,
      height: 50,
      type: 'rect',
      physics: 'static',
    }
    shapes.push(wall2)

    canvas.setState({ shapes: shapes })
  }
}

export default Pong