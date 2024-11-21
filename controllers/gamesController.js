const db = require("../db/queries");

function gamesGet(req, res) {
  res.render("gameList", { categories: req.categories });
}

module.exports = {
  gamesGet,
};
