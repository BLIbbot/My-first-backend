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

const grabArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic,
  validTopics
) => {
  let queryStr = `
    SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comments_count
    FROM articles
    LEFT JOIN comments
    ON comments.article_id = articles.article_id
    `;

  const validSortBy = [
    "article_id",
    "votes",
    "title",
    "created_at",
    "author",
    "comment_count",
    "topic",
  ];
  const validOrder = ["DESC", "ASC"];

  if (!validSortBy.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid input" });
  }
  if (!validTopics.includes(topic) && topic !== undefined) {
    return Promise.reject({ status: 404, msg: "Topic does not exist" });
  }

  const queryArray = [];
  if (topic) {
    queryStr += ` WHERE articles.topic = $3`;
    queryArray.push(topic);
  }

  queryStr += ` GROUP BY articles.article_id`;

  if (sort_by) {
    queryStr += ` ORDER BY ${sort_by}`;
  }
  if (order) {
    queryStr += ` ${order}`;
  }

  return db.query(queryStr, queryArray).then(({ rows }) => {
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

const changeCommentVoteCount = (voteCount, comment_id) => {
  return db
    .query(
      `UPDATE comments SET votes=votes+$1 WHERE comment_id=$2 RETURNING *`,
      [voteCount, comment_id]
    )
    .then((updatedVoteCount) => {
      return updatedVoteCount.rows[0];
    });
};

const postArticle = (articleToPost) => {
  const { title, topic, author, body, article_img_url } = articleToPost;
  const articleProperties = [title, topic, author, body];
  let queryStr = `INSERT INTO articles (title, topic, author, body `;
  if (article_img_url) {
    articleProperties.push(article_img_url);
    queryStr += ", article_img_url)";
  } else {
    queryStr += ")";
  }
  queryStr += ` VALUES ($1, $2, $3, $4 `;
  if (article_img_url) {
    queryStr += " , $5)";
  } else {
    queryStr += ")";
  }
  queryStr += " RETURNING *;";
  return db.query(queryStr, articleProperties).then(({ rows }) => {
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
  changeCommentVoteCount,
  postArticle,
};
