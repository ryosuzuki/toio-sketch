class RubeGoldberg {
  init(canvas) {
    canvas.example = 'rube-goldberg'
    let shapes = canvas.state.shapes

    let slopes = [
      { x: 500, y: 350, width: 600, height: 50, angle: 2},
      { x: 650, y: 800, width: 600, height: 50, angle: -2},
    ]
    for (let slope of slopes) {
      let shape = {
        x: slope.x,
        y: slope.y,
        width: slope.width,
        height: slope.height,
        rotation: slope.angle,
        type: 'rect',
        physics: 'static'
      }
      shapes.push(shape)
    }

    /*
    let toios = [
      { x: 300, y: 100 },
      { x: 900, y: 700 }
    ]
    for (let toio of toios) {
      let shape = {
        x: toio.x,
        y: toio.y,
        type: 'toio',
        physics: 'dynamic'
      }
      shapes.push(shape)
    }
    */

    let ball = {
      x: 700,
      y: 200,
      radius: 40,
      type: 'circle',
      physics: 'dynamic'
    }
    shapes.push(ball)

    canvas.setState({ shapes: shapes })
  }
}

export default RubeGoldberg