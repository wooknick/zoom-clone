import express from "express";
import path from "path";

const app = express();
const __dirname = path.resolve();

app.set("view engine", "pug");
app.set("views", __dirname + "/src/views");
app.use("/public", express.static(__dirname + "/src/public"));
app.get("/", (req, res) => res.render("home"));

app.listen(3000, () => {
  console.log("Listening on https://localhost:3000");
});
