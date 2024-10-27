//Controllers direct the data flow i.e. sending data from a client request to be queiried by a model, returning requested data to the client after a query completes or passing the request over to an error handler if there is a problem with the request

const {
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
} = require("../models/firstBackEndModels");
//const fs = require("fs/promises");
const APIList = require("../endpoints.json");

function getTopics(req, res) {
  getCurrentTopics().then((topics) => {
    res.status(200).send({ topics });
  });
}

/* 
function getAPIS(req, res) {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((unparsedAPIList) => {
      return JSON.parse(unparsedAPIList);
    })
    .then((APIList) => {
      res.status(200).send({ APIList });
    });
} */

const getAPIS = (req, res) => {
  res.status(200).send({ APIList });
};

function getArticle(req, res, next) {
  const { article_id } = req.params;
  getSpecificArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  grabArticles(sort_by, order)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleComments(req, res, next) {
  const { article_id } = req.params;
  getComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

function postAComment(req, res, next) {
  const comment = req.body;
  const article_id = req.params;
  postComment(comment, article_id)
    .then((postedComment) => {
      res.status(201).send({ postedComment });
    })
    .catch((err) => {
      next(err);
    });
}

function addVote(req, res, next) {
  const voteCount = req.body.inc_votes;
  const { article_id } = req.params;
  changeVoteCount(voteCount, article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  removeSelectedComment(comment_id)
    .then((deletedComment) => {
      res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
}

function getUsers(req, res) {
  getAllUsers().then((users) => {
    res.status(200).send(users);
  });
}

function getUserByUsername(req, res, next) {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}

function addCommentVote(req, res, next) {
  const voteCount = req.body.inc_votes;
  const { comment_id } = req.params;
  changeCommentVoteCount(voteCount, comment_id)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
}

function postAnArticle(req, res, next) {
  const articleToPost = req.body;
  postArticle(articleToPost)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getTopics,
  getAPIS,
  getArticle,
  getAllArticles,
  getArticleComments,
  postAComment,
  addVote,
  deleteComment,
  getUsers,
  getUserByUsername,
  addCommentVote,
  postAnArticle,
};
