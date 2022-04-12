class Triangle {
  init(canvas) {
    canvas.example = 'triangle'
    let shapes = canvas.state.shapes

    let points = [
      { x: 500, y : 300 },
      { x: 200, y : 600 },
      { x: 800, y : 600 }
    ]

    let circle1 = { // for toio
      x: points[1].x,
      y: points[1].y,
      radius: 40,
      type: 'circle',
      physics: 'float',
    }
    shapes.push(circle1)

    let circle2 = { // for toio
      x: points[2].x,
      y: points[2].y,
      radius: 40,
      type: 'circle',
      physics: 'float',
    }
    shapes.push(circle2)

    let line1 = {
      x: 0,
      y: 0,
      points: [points[0].x, points[0].y, points[1].x, points[1].y],
      type: 'line',
      physics: 'constraint'
    }
    shapes.push(line1)

    let line2 = {
      x: 0,
      y: 0,
      points: [points[0].x, points[0].y, points[2].x, points[2].y],
      type: 'line',
      physics: 'constraint'
    }
    shapes.push(line2)

    // let toio = {
    //   x: 500,
    //   y: 800,
    //   type: 'toio',
    //   physics: 'float',
    //   toioId: 0,
    // }
    // shapes.push(toio)

    // let line3 = {
    //   x: 0,
    //   y: 0,
    //   points: [points[0].x, points[0].y, toio.x, toio.y],
    //   type: 'line',
    //   physics: 'constraint',
    //   strokeColor: App.toioStrokeColor
    // }
    // shapes.push(line3)

    canvas.setState({ shapes: shapes })
  }
}

export default Triangle