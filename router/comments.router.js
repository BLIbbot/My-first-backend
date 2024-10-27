const commentsRouter = require("express").Router();
const { deleteComment } = require("../controllers/firstBackEndControllers");

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
