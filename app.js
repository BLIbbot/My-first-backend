const express = require("express");
const app = express();

const apiRouter = require("./router/api.router");
app.use("/api", apiRouter);

app.use(express.json()); //required for post

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Invalid request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = { app };
