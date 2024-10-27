const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/firstBackEndControllers");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
