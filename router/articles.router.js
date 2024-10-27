const articlesRouter = require("express").Router();
const {
  getArticle,
  getAllArticles,
  getArticleComments,
  postAComment,
  addVote,
} = require("../controllers/firstBackEndControllers");

const { getSortedArticles } = require("../models/firstBackEndModels");

articlesRouter.route("/:article_id").get(getArticle).patch(addVote);

articlesRouter.get("/", getAllArticles);

articlesRouter
  .route("/:article_id/comments")
  .get(getArticleComments)
  .post(postAComment);

module.exports = articlesRouter;
