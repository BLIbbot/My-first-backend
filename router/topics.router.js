const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/firstBackEndControllers");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
