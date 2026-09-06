// Node.js example
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",           // for development
    methods: ["GET", "POST"],
  },
});

server.listen(8000, "0.0.0.0", () => {
  console.log("Socket server on 0.0.0.0:8000");
});