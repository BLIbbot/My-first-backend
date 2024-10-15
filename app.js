const express = require("express");
const app = express();
const { getTopics, getAPIS } = require("./controllers/firstBackEndControllers");

app.get("/api/topics", getTopics);

app.get("/api", getAPIS);

module.exports = { app };
