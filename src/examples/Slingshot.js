class Slingshot {
  init(canvas) {
    canvas.example = 'slingshot'
    let shapes = canvas.state.shapes

    let toio = {  // for toio
      x: 200,
      y: 800,
      angle: 45,
      type: 'toio',
      physics: 'dynamic'
    }
    shapes.push(toio)

    let spring = {
      x: 0,
      y: 0,
      start: { x: 300, y: 700 },
      end: { x: 200, y: 800 },
      length: 0, // Math.sqrt((points[last-1]-points[0])**2 + (points[last]-points[1])**2),
      type: 'spring',
      physics: 'spring'
    }
    shapes.push(spring)


    let balls = [
      { x: 700, y: 100},
      { x: 700, y: 200},
      { x: 700, y: 300},
      { x: 800, y: 300},
      { x: 900, y: 300},
      { x: 800, y: 200}
    ]
    for (let ball of balls) {
      let shape = {
        x: ball.x,
        y: ball.y,
        radius: 40,
        type: 'circle',
        physics: 'dynamic'
      }
      shapes.push(shape)
    }

    canvas.setState({ shapes: shapes })

  }
}

export default Slingshot