const commentsRouter = require("express").Router();
const {
  deleteComment,
  addCommentVote,
} = require("../controllers/firstBackEndControllers");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(addCommentVote);

module.exports = commentsRouter;
