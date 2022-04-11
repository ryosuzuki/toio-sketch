const { NearScanner } = require('@toio/scanner')
const { NearestScanner } = require('@toio/scanner')
let num = 2

class Toio {
  constructor() {
    // cube = null
    // this.targetX = 250
    // this.targetY = 250

    this.targets = []
    this.cubes = []
    for (let i = 0; i < num; i++) {
      this.cubes.push({})
      this.targets.push({ x: null, y: null, angle: null })
    }
    this.speed = {}
    // this.ids = ids
  }

  async init() {
    this.io.on('connection', (socket) => {
      console.log('connected')

      socket.on('move', (data) => {
        let target = data
        console.log(target)
        if (!target.x || !target.y) return false
        this.targets[target.id] = target
        // for (let i = 0; i < targets.length; i++) {
        //   let target = targets[i]
        //   if (!target.x || !target.y) continue
        //   this.targets[i] = target
        // }
        // this.targetX = data.x
        // this.targetY = data.y
      })
    })

    const cubes = await new NearScanner(num).start()
    // const cube = await new NearestScanner().start()
    // const cubes = [cube]
    console.log('test-2')

    for (let i = 0; i < num; i++) {
      const cube = await cubes[i].connect()
      console.log(cube.id)
      let id = cube.id
      // TODO
      // let index = this.ids.findIndex(el => el === cube.id)
      // this.cubes[index] = cube
      this.cubes[i] = cube
    }
    console.log('toio connected')

    for (let i = 0; i < this.cubes.length; i++) {
      let cube = this.cubes[i]
      cube.on('id:position-id', (data) => {
        cube.x = data.x
        cube.y = data.y
        cube.angle = data.angle
        data.id = i
        this.io.sockets.emit('pos', data)
      })
      cube.on('button:press', (data) => {
        data.id = i
        this.io.sockets.emit('button', data)
      })
    }
    setInterval(() => {
      // console.log(this.targets)
      for (let i = 0; i < this.cubes.length; i++) {
        let cube = this.cubes[i]
        let target = this.targets[i]
        if (!target.x || !target.y) continue
        cube.move(...this.move(i, cube), 100)
      }
      /*
      for (let cube of this.cubes) {
        if (!this.targetX || !this.targetY) continue
        cube.move(...this.move(this.targetX, this.targetY, cube), 100)
      }
      */
    }, 10)
  }

  move(i, cube) {
    let target = this.targets[i]
    const diffX = target.x - cube.x
    const diffY = target.y - cube.y
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2)
    if (distance < 10) {
      this.targets[i] = { x: null, y: null, angle: null }
      return [0, 0]
    }

    let relAngle = (Math.atan2(diffY, diffX) * 180) / Math.PI - cube.angle
    relAngle = relAngle % 360
    if (relAngle < -180) {
      relAngle += 360
    } else if (relAngle > 180) {
      relAngle -= 360
    }
    // console.log(relAngle)
    const ratio = Math.abs(1 - Math.abs(relAngle) / 90)
    let speed = 40
    if (relAngle > 0 && relAngle <= 90) {
      // forward
      return [speed, speed * ratio]
    } else if (relAngle > 90) {
      // backward
      return [-speed, -speed * ratio]
    } else if (relAngle < 0 && relAngle >= -90) {
      // forward
      return [speed * ratio, speed]
    } else if (relAngle < -90) {
      // backward
      return [-speed * ratio, -speed]
    }

    if (relAngle > 0) {
      console.log('test')
      return [speed, speed * ratio]
    } else {
      console.log('test2')
      return [speed * ratio, speed]
    }



  }

}

module.exports = Toio