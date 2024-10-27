//Models interact directly with the database

const db = require("../db/connection");

const getCurrentTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

const getSpecificArticle = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows;
    });
};

const grabArticles = (sort_by = "created_at", order = "DESC") => {
  order = order.toUpperCase();
  const allowedInputs = [
    "title",
    "topic",
    "author",
    "created_at",
    "article_img_url",
    "comments_count",
    "article_id",
    "votes",
    "ASC",
    "DESC",
  ];
  if (!allowedInputs.includes(sort_by, order)) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  return db
    .query(
      `SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comments_count FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       GROUP BY articles.article_id
       ORDER BY articles.${sort_by} ${order};`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const getComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
       WHERE article_id = $1
       ORDER BY comments.created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "page not found" });
      }
      return rows;
    });
};

const postComment = (comment, id) => {
  const { body, author } = comment;
  const article_id = id.article_id;
  if (!author) {
    return Promise.reject({ status: 404, msg: "User does not exist" });
  }
  if (!article_id) {
    return Promise.reject({ status: 404, msg: "Invalid id" });
  }

  return db
    .query(
      `INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *`,
      [body, article_id, author]
    )
    .then((postedComment) => {
      return postedComment.rows[0];
    });
};

const changeVoteCount = (voteCount, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING *`,
      [voteCount, article_id]
    )
    .then((updatedVoteCount) => {
      return updatedVoteCount.rows[0];
    });
};

const removeSelectedComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

const getAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

const fetchUser = (username) => {
  return db
    .query(
      `SELECT * FROM users
  WHERE users.username=$1;`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      return rows[0];
    });
};

module.exports = {
  getCurrentTopics,
  getSpecificArticle,
  grabArticles,
  getComments,
  postComment,
  changeVoteCount,
  removeSelectedComment,
  getAllUsers,
  fetchUser,
};
