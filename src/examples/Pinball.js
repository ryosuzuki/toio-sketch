class Pinball {
  init(canvas) {
    canvas.example = 'pinball'
    let shapes = canvas.state.shapes

    let xx = [510,      100,  1024-100,  330,                 700,              500, 700, 350]
    let yy = [125,      550,  550,       850,                 850,              600, 430, 300]
    let ww = [1024-150,  50,   50,        App.toioSize * 4,   App.toioSize * 4, 300, 300, 300]
    let hh = [ 50,       800,  800,      App.toioSize,        App.toioSize,      30, 30,   30]
    let rr = [ 0,        0,    0,        -10,                  10,                -5,   +5,   -5]
    let pp = [ 'static', 'static', 'static', 'float', 'float', 'static', 'static', 'static']
    let objType = [ 'shape', 'shape', 'shape', 'toio', 'toio', 'shape', 'shape', 'shape']

    let walls = [
      { x: 510, y: 125, width: 1024-150, height: 50 },
      { x: 100, y: 550, width: 50, height: 800 },
      { x: 1024-100, y: 550, width: 50, height: 800 }
    ]

    for (let wall of walls) {
      let shape = {
        x: wall.x,
        y: wall.y,
        width: wall.width,
        height: wall.height,
        type: 'rect',
        physics: 'static',
      }
      shapes.push(shape)
    }

    let ball = {
      x: 500,
      y: 500,
      radius: 50,
      type: 'circle',
      physics: 'float'
    }
    shapes.push(ball)

    let toio1 = { // paddle R
      x: 650,
      y: 900,
      width: App.toioSize*4,
      type: 'toio',
      physics: 'float',
    }
    shapes.push(toio1)

    let toio2 = { // paddle L
      x: 400,
      y: 900,
      width: App.toioSize*4,
      type: 'toio',
      physics: 'float',
    }
    shapes.push(toio2)





    canvas.setState({ shapes: shapes })
  }
}

export default Pinball