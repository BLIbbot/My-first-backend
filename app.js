const express = require("express");
const app = express();
const {
  getTopics,
  getAPIS,
  getArticle,
  getAllArticles,
} = require("./controllers/firstBackEndControllers");

app.get("/api/topics", getTopics);

app.get("/api", getAPIS);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Server Error!" });
});

module.exports = { app };
