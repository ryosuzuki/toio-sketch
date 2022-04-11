class RubeGoldberg {
  init(canvas) {
    canvas.example = 'rube-goldberg'
    let shapes = canvas.state.shapes

    let xx = [500, 700, 300, 900]
    let yy = [350, 800, 100, 600]
    let ww = [600, 600,  50,  50]
    let hh = [ 50,  50,  50,  50]
    let rr = [ 2, -10,  5, -5]
    let pp = [ 'static', 'static',  'dynamic', 'dynamic']
    let objType = [ 'shape', 'shape',  'toio', 'toio']

    for (let i = 0; i < xx.length; i++) {
      let shape1 = {
        x: xx[i],
        y: yy[i],
        width: ww[i],
        height: hh[i],
        rotation: rr[i],
        type: 'rect',
        physics: pp[i]
      }
      shapes.push(shape1)
    }

    let shape2 = {
      x: 700,
      y: 200,
      radius: 40,
      type: 'circle',
      physics: 'dynamic',
      visible: true
    }
    shapes.push(shape2)

    canvas.setState({ shapes: shapes })
  }
}

export default RubeGoldberg