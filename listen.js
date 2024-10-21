const { app } = require("./app.js");
const PORT = process.env.PORT || 3000;

console.log(app);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
