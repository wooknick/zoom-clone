import express from "express";
import { WebSocketServer } from "ws";
import http from "http";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (req, res) => res.render("home"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const sockets = [];

wss.on("connection", (socket) => {
  socket["nickname"] = "Anonymous";
  sockets.push(socket);
  console.log("Connected to Browser");
  socket.on("close", () => {
    console.log("closed connection");
  });
  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());
    switch (message.type) {
      case "new_message":
        sockets.forEach((s) =>
          s.send(`${socket.nickname}: ${message.payload}`)
        );
      case "nickname":
        socket["nickname"] = message.payload;
    }
  });
});

server.listen(3000, () => {
  console.log("Listening on https://localhost:3000");
});
