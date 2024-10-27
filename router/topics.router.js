const { getTopics } = require("../controllers/firstBackEndControllers");

app.get("/api/topics", getTopics);

module.exports = topicsRouter;
