const http = require('http');
var express = require('express')
var cors = require('cors');  
const io = require('socket.io')(3000, {
  cors: {
    origin: ['http://localhost:4200']
  }
})

io.on('connection', socket => {
  console.log(socket.id)

  socket.on('run-code', (code) => {
    console.log(code)
  })

})