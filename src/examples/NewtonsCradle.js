class NewtonsCradle {
  init(canvas) {
    let shapes = canvas.state.shapes

    let start = 360, offset = 90;
    for (let i = 0; i <= 3; i++) {
      let x = start + offset*i
      let shape1 = {
        x: x,
        y: 700,
        radius: 40,
        type: 'circle',
        physics: 'dynamic',
        visible: true
      }
      shapes.push(shape1)

      let shape2 = {
        x: 0,
        y: 0,
        points: [x, 350, x, 700],
        type: 'line',
        physics: 'constraint'
      }
      shapes.push(shape2)
    }

    for(let i = 4; i <= 5; i++) {
      let x = (i === 4) ? start - offset : start + offset * 4
      let toio1 = {
        x: x,
        y: 700,
        radius: 40,
        type: 'circle',
        physics: 'dynamic',
        visible: true
      }
      shapes.push(toio1) //  this.state.toios.push(toio1)

      let shape2 = {
        x: 0,
        y: 0,
        points: [x, 350, x, 700],
        type: 'line',
        physics: 'constraint'
      }
      shapes.push(shape2)
    }

    canvas.setState({ shapes: shapes })
  }
}

export default NewtonsCradle