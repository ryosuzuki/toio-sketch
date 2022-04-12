const { NearScanner } = require('@toio/scanner')
const { NearestScanner } = require('@toio/scanner')
let num = 1

class Toio {
  constructor() {
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
        if (!target.x || !target.y) return false
        // console.log(target)
        this.targets[target.id] = target
      })
    })

    const cubes = await new NearScanner(num).start()
    console.log('test-2')

    for (let i = 0; i < num; i++) {
      const cube = await cubes[i].connect()
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
      for (let i = 0; i < this.cubes.length; i++) {
        let cube = this.cubes[i]
        let target = this.targets[i]
        if (!target.x || !target.y) continue
        cube.move(...this.move(i, cube), 50)
      }
    }, 50)
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

    let leftSpeed = 0
    let rightSpeed = 0
    let maxSpeed = 115
    let angleToTarget = Math.atan2(diffY, diffX)
    let thisAngle = cube.angle * Math.PI / 180
    let diffAngle = thisAngle - angleToTarget
    if (diffAngle > Math.PI) diffAngle -= Math.PI * 2
    if (diffAngle < -Math.PI) diffAngle += Math.PI * 2

    if (Math.abs(diffAngle) < Math.PI/2) { // front
      let frac = Math.cos(diffAngle)
      if (diffAngle > 0) {
        leftSpeed = Math.floor(maxSpeed * Math.pow(frac, 2))
        rightSpeed = maxSpeed
      } else {
        leftSpeed = maxSpeed
        rightSpeed = Math.floor(maxSpeed * Math.pow(frac, 2))
      }
    } else { // back
      let frac = -Math.cos(diffAngle)
      if (diffAngle > 0) {
        leftSpeed = -Math.floor(maxSpeed * Math.pow(frac, 2))
        rightSpeed = -maxSpeed
      } else {
        leftSpeed = -maxSpeed
        rightSpeed = -Math.floor(maxSpeed * Math.pow(frac, 2))
      }
    }

    let targetVelX = 0 // target.vx
    let targetVelY = 0 // target.vy
    let velIntegrate = Math.sqrt(targetVelX**2 + targetVelY**2)
    let aimMotSpeed = velIntegrate / 2.04

    let aa = 0
    if (leftSpeed < 0) { // back
      aa = -aimMotSpeed
    } else {
      aa = aimMotSpeed
    }

    // if (leftSpeed < 0) {
    //   aimMotSpeed = -aimMotSpeed
    // }

    let dd = distance / 50.0
    dd = Math.min(dd, 1)

    if (dd < 0.1) {
      this.targets[i] = { x: null, y: null, angle: null }
      return [0, 0]
    }

    leftSpeed = aa + (leftSpeed*dd)
    rightSpeed = aa + (rightSpeed*dd)
    if (leftSpeed < -maxSpeed) {
      leftSpeed = -maxSpeed
    }
    if (maxSpeed < leftSpeed) {
      leftSpeed = maxSpeed
    }
    if (rightSpeed < -maxSpeed) {
      rightSpeed = -maxSpeed
    }
    if (maxSpeed < rightSpeed) {
      rightSpeed = maxSpeed
    }
    // console.log([leftSpeed, rightSpeed])

    return [leftSpeed, rightSpeed]

    /*
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
    */

  }

}

module.exports = Toio