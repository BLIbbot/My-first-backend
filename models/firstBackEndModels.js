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

function grabArticles() {
  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comments_count FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       GROUP BY articles.article_id
       ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { getCurrentTopics, getSpecificArticle, grabArticles };
