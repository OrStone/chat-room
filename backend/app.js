const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const PORT = 3000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const cors = require('cors');
app.use(cors());

server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});

require('./socket')(io);


