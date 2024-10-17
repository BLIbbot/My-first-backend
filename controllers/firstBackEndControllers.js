//Controllers direct the data flow i.e. sending data from a client request to be queiried by a model, returning requested data to the client after a query completes or passing the request over to an error handler if there is a problem with the request

const {
  getCurrentTopics,
  getSpecificArticle,
  grabArticles,
  getComments,
  postComment,
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

function getAllArticles(req, res) {
  grabArticles().then((articles) => {
    res.status(200).send({ articles });
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

module.exports = {
  getTopics,
  getAPIS,
  getArticle,
  getAllArticles,
  getArticleComments,
  postAComment,
};
