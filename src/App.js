import React, { Component } from 'react'
import './App.css'
import Canvas from './Canvas2'
import { io } from 'socket.io-client'

if (!window.XR8) {
  AFRAME = require('aframe')
}

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this
    // this.socket = io('http://localhost:4000/') // uncomment for toio

    this.size = 1024
    this.state = {
      dragging: false,
      initDrawing: true,
      distance: 0,
      mouse2D: { x: 0, y: 0 },
      mouse: { x: 0, y: 0 },
      raycaster: new THREE.Raycaster(),
      XR8: window.XR8
    }
  }

  componentDidMount() {
    this.canvas = window.Canvas

    AFRAME.registerComponent('drawing-plane', {
      init: () => {
        let el = document.querySelector('#drawing-plane')
        let mesh = el.object3D.children[0]
        let konvaEl = document.querySelector('.konvajs-content canvas')
        konvaEl.width = konvaEl.height = this.size
        let texture = new THREE.Texture(konvaEl)
        let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        mesh.material = material
        // mesh.material.transparent = true
        this.mesh = mesh
        el.sceneEl.addEventListener('mousedown', this.mouseDown.bind(this))
        el.sceneEl.addEventListener('mousemove', this.mouseMove.bind(this))
        el.sceneEl.addEventListener('mouseup', this.mouseUp.bind(this))
      },

      tick: () => {
        this.update()
      }
    })
  }

  mouseDown(event) {
    this.setState({ dragging: true })
  }

  mouseMove(event) {
    let mouse2D = { x: event.clientX, y: event.clientY }
    this.setState({ mouse2D: mouse2D })
  }

  mouseUp(event) {
    this.setState({ dragging: false, initDrawing: true })
    this.canvas.mouseUp()
  }

  update() {
    this.mesh.material.map.needsUpdate = true
    if (this.state.dragging) {
      const screenPositionX = this.state.mouse2D.x / window.innerWidth * 2 - 1
      const screenPositionY = this.state.mouse2D.y / window.innerHeight * 2 - 1
      const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

      let camera = document.getElementById('camera')
      let threeCamera = camera.getObject3D('camera')
      this.state.raycaster.setFromCamera(screenPosition, threeCamera)
      const intersects = this.state.raycaster.intersectObject(this.mesh, true)
      if (intersects.length > 0) {
        const intersect = intersects[0]
        let point = intersect.point
        let mouse = {
          x: this.size * intersect.uv.x,
          y: this.size * (1- intersect.uv.y)
        }
        this.setState({ distance: intersect.distance, mouse: mouse })
        if (this.state.initDrawing) {
          this.canvas.mouseDown(mouse)
          this.setState({ initDrawing: false })
        } else {
          this.canvas.mouseMove(mouse)
        }
      }
    }
  }


  render() {
    return (
      <>
        <Canvas />
        <a-scene background="color: #eee"
        >
          <a-camera id="camera" look-controls="true" position="0 8 0" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;"></a-camera>
          <a-plane drawing-plane id="drawing-plane" class="cantap" position="0 5 -10" rotation="0 0 0" width="10" height="10" color="#ccc"></a-plane>
        </a-scene>
      </>
    )
  }


}

export default App