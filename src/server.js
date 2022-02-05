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
  socket["nickname"] = "Anon";
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
    done();
  });
  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });
});

httpServer.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});
