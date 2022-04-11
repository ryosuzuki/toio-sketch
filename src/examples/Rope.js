class Rope {
  init(canvas) {
    canvas.example = 'rope'
    let shapes = canvas.state.shapes

    let start = 100
    let offset = 40
    let ropeSize = 24;
    let pp = 'static'
    let vv = true

    for (let i = 0; i < ropeSize; i++) {
      if (i === 0) {
        pp = 'static'
      } else if (i === ropeSize-1) {
        pp = 'dynamic'
        vv = true
      } else {
        pp = 'dynamic'
        vv = false
      }

      let shape5 = { //rope ends & invisible bodies
        x: start,
        y: start+(offset*i),
        radius: 20,
        type: 'circle',
        physics: pp,
        visible: vv
      }
      shapes.push(shape5)
    }

    for (let i = 0; i < ropeSize-1; i++){ // rope
      let shape7 = {
        x: 0,
        y: 0,
        points: [start, start+(offset*i), start, start+(offset*(i+1))],
        type: 'linetwo',
        physics: 'constrainttwo'
      }
      shapes.push(shape7)
    }

    let toio = { // for toio
      x: 200,
      y: 700,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynammic',
      rotation: 0
    }
    shapes.push(toio)

    let toio2 = { // for toio
      x: 300,
      y: 700,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynammic',
      rotation: 0
    }
    shapes.push(toio2)

    let toio3 = { // for toio
      x: 400,
      y: 700,
      width: App.toioSize,
      height: App.toioSize,
      type: 'rect',
      physics: 'dynammic',
      rotation: 0
    }
    shapes.push(toio3)


    canvas.setState({ shapes: shapes })
  }
}

export default Rope