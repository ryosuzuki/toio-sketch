const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const https = require('https')
const fs = require('fs')
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

const Toio = require('./toio')
const toio = new Toio()

server.listen(4000, () => {
  console.log('listening 4000')

  toio.io = io
  toio.init()
})
