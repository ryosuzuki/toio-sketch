const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const { NearestScanner } = require('@toio/scanner')
const cors = require('cors')
const app = express()
const server = http.Server(app)
app.use(cors())
const io = socketio(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/index.html'))
})

app.get('/simulator', (req, res) => {
  res.sendFile(path.join(__dirname + '/simulator.html'))
})

const Toio = require('./toio')
const toio = new Toio()

server.listen(4000, () => {
  console.log('listening 4000')

  toio.io = io
  toio.init()
})

// let cube = null
io.on('connection', (socket) => {
  console.log('connected')

  setInterval(() => {
    socket.emit('test', new Date())
  }, 1000)

  socket.on('position', (data) => {
    console.log(data)
    if (cube) {

    }
  })

  // main(io)
})

// async function main(io) {
//   cube = await new NearestScanner().start()
//   cube.connect()
//   cube.on('id:position-id', (data) => {
//     io.sockets.emit('pos', { cubes: [data] })
//   })
// }