const { getUsers } = require("../controllers/firstBackEndControllers");

app.get("/api/users", getUsers);

module.exports = usersRouter;
