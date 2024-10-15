const db = require("../db/connection");

function getCurrentTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

module.exports = { getCurrentTopics };
