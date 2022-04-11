class NewtonsCradle {
  init(canvas) {
    canvas.example = 'newtons-cradle'
    let shapes = canvas.state.shapes

    let start = 360, offset = 90;
    for (let i = 0; i <= 3; i++) {
      let x = start + offset*i
      let ball = {
        x: x,
        y: 700,
        radius: 40,
        type: 'circle',
        physics: 'dynamic',
      }
      shapes.push(ball)
      let line = {
        x: 0,
        y: 0,
        points: [x, 350, x, 700],
        type: 'line',
        physics: 'constraint'
      }
      shapes.push(line)
    }

    /*
    for(let i = 4; i <= 5; i++) {
      let x = (i === 4) ? start - offset : start + offset * 4
      let toio = {
        x: x,
        y: 700,
        radius: 40,
        type: 'toio',
        physics: 'float'
      }
      shapes.push(toio) //  this.state.toios.push(toio1)

      let line = {
        x: 0,
        y: 0,
        points: [x, 350, x, 700],
        type: 'line',
        physics: 'constraint'
      }
      shapes.push(line)
    }
    */

    canvas.setState({ shapes: shapes })
  }
}

export default NewtonsCradle