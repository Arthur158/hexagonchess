//@ts-check

const express = require("express");
const http = require("http");

const indexRouter = require("./routes/index");

const port = process.argv[2];
const app = express();

app.use(express.static(__dirname + "/public"));

app.get("/play", indexRouter);
app.get("/", indexRouter);

http.createServer(app).listen(port);