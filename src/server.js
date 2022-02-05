import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (req, res) => res.render("home"));

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.on("enter_room", (roomName, done) => {
    console.log(roomName);
    socket.join(roomName);
    done();
  });
});

httpServer.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
