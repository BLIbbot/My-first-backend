const express = require("express");
const app = express();
app.use(express.json()); //required for post
const {
  getTopics,
  getAPIS,
  getArticle,
  getAllArticles,
  getArticleComments,
  postAComment,
  addVote,
} = require("./controllers/firstBackEndControllers");

app.get("/api/topics", getTopics);

app.get("/api", getAPIS);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postAComment);

app.patch("/api/articles/:article_id", addVote);

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
