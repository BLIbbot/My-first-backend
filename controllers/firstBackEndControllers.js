//Controllers direct the data flow i.e. sending data from a client request to be queiried by a model, returning requested data to the client after a query completes or passing the request over to an error handler if there is a problem with the request

const { getCurrentTopics } = require("../models/firstBackEndModels");
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

function getAPIS(req, res) {
  res.status(200).send({ APIList });
}

module.exports = { getTopics, getAPIS };
