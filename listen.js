const app = require("./app.js");
const { PORT = 9090 } = process.env || 8080;

console.log(app);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
