class Slingshot {
  init(canvas) {
    let shapes = canvas.state.shapes

    // disable gravity ----------uncomment line 49 in Physics.js
    let toio = {  // for toio
      x: 300,
      y: 900,
      angle: 45,
      type: 'toio',
      physics: 'dynamic',
      visible: true
    }
    shapes.push(toio)

    let spring = {
      x: 0,
      y: 0,
      start: { x: 300, y: 700 },
      end: { x: 300, y: 900 },
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