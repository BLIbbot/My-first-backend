const {
  getArticle,
  getAllArticles,
  getArticleComments,
  postAComment,
  addVote,
} = require("../controllers/firstBackEndControllers");
const { getSortedArticles } = require("./models/firstBackEndModels");

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postAComment);

app.patch("/api/articles/:article_id", addVote);

module.exports = articlesRouter;
