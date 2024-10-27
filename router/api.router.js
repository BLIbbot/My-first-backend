const apiRouter = require("express").Router();
const { getAPIS } = require("../controllers/firstBackEndControllers");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");

apiRouter.get("/", getAPIS);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
