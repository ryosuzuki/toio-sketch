class Slider {
  init(canvas) {
    let shapes = canvas.state.shapes

    let xx = [400, 500, 600]
    let yy = [400, 300, 400]
    let pp = ["static", "static", "dynamic"]

    for(let i =0;i<xx.length;i++){
      let toio1 = { // for toio
        x: xx[i],
        y: yy[i],
        width: App.toioSize,
        height: App.toioSize,
        type: 'rect',
        physics: pp[i],
        rotation: 0
      }
      shapes.push(toio1)
    }

    for(let i=0;i<xx.length-1;i++){
      let shape7 = {
        x: 0,
        y: 0,
        points: [xx[i], yy[i], xx[i+1], yy[i+1]],
        type: 'linetwo',
        physics: 'constrainttwo'
      }
      shapes.push(shape7)
    }

    let toio2 = { // for toio
      x: 200,
      y: 800,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'float',
      rotation: 0
    }
    shapes.push(toio2)

    let shape7 = {
      x: 0,
      y: 0,
      points: [100, 800, 200, 800],
      type: 'lineelastic',
      physics: 'constraint'
    }
    shapes.push(shape7)

    canvas.setState({ shapes: shapes })
  }
}

export default Slider