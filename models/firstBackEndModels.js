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
};

const grabArticles = () => {
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
  const idList = [];
  return db
    .query(`SELECT comment_id FROM comments;`)
    .then((ids) => {
      ids.rows.forEach((id) => {
        idList.push(id.comment_id);
      });
    })
    .then(() => {
      if (isNaN(Number(comment_id))) {
        return Promise.reject({ status: 400, msg: "Invalid request" });
      } else {
        const correctId = [];
        idList.forEach((id) => {
          if (Number(comment_id) === id) {
            correctId.push(1);
          }
        });
        if (correctId.length === 0) {
          return Promise.reject({ status: 404, msg: "comment not found" });
        }
      }
    })
    .then(() => {
      return db.query(`DELETE FROM comments WHERE comment_id=$1 RETURNING *`, [
        comment_id,
      ]);
    })
    .then((deletedComment) => {
      return deletedComment.rows[0];
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
};
