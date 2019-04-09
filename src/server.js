const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

const server = require("http").Server(app);
const io = require("socket.io")(server);

io.on("connection", socket => {
  socket.on("connectRoom", box => {
    socket.join(box);
  });
});

mongoose.connect("mongodb://localhost:27017/omnistack", {
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.io = io;

  return next();
});

app.use(express.json()); // aceitar json nas requisições
app.use(express.urlencoded({ extended: true })); // aceitar envio de arquivo nas requisições
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

app.use(require("./routes"));

server.listen(process.env.PORT || 3000);
