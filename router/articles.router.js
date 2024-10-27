const articlesRouter = require("express").Router();
const {
  getArticle,
  getAllArticles,
  getArticleComments,
  postAComment,
  addVote,
} = require("../controllers/firstBackEndControllers");

const { getSortedArticles } = require("../models/firstBackEndModels");

articlesRouter.get("/:article_id", getArticle);

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postAComment);

articlesRouter.patch("/:article_id", addVote);

module.exports = articlesRouter;
