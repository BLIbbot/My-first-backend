const { getCurrentTopics } = require("../models/firstBackEndModels");

function getTopics(req, res) {
  getCurrentTopics().then((topics) => {
    res.status(200).send({ topics });
  });
}

module.exports = { getTopics };
