const { deleteComment } = require("../controllers/firstBackEndControllers");

app.delete("/api/comments/:comment_id", deleteComment);

module.exports = commentsRouter;
