//Models interact directly with the database

const db = require("../db/connection");

function getCurrentTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
}

function getSpecificArticle(article_id) {
  return db
    .query(
      `SELECT * FROM articles 
      WHERE article_id = $1;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows;
    });
}

module.exports = { getCurrentTopics, getSpecificArticle };
