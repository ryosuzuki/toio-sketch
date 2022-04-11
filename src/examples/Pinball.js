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

    for (let i = 0; i < xx.length; i++) {
      let shape = {
        x: xx[i],
        y: yy[i],
        width: ww[i],
        height: hh[i],
        rotation: rr[i],
        type: 'rect',
        physics: pp[i]
      }
      shapes.push(shape)
    }

    let shape = {
      x: 500,
      y: 500,
      radius: 50,
      type: 'circle',
      physics: 'dynamic',
      visible: true
    }
    shapes.push(shape)

    canvas.setState({ shapes: shapes })
  }
}

export default Pinball