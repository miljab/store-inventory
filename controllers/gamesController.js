const db = require("../db/queries");
const gamesMap = require("../utils/gamesMap");

async function gamesGet(req, res) {
  const rows = await db.getGamesWithCategories();
  const games = gamesMap.createGamesWithCategoriesMap(rows);

  res.render("gamesList", {
    categoriesList: req.categories,
    gamesList: games,
  });
}

async function gamesInCategoryGet(req, res) {
  const id = req.params.id;
  const rows = await db.getGamesInCategory(id);
  const games = gamesMap.createGamesWithCategoriesMap(rows);

  res.render("gamesList", {
    categoriesList: req.categories,
    gamesList: games,
  });
}

async function gameInfoGet(req, res) {
  const id = req.params.id;
  const rows = await db.getGameWithCategories(id);
  const game = gamesMap.createGamesWithCategoriesMap(rows);

  res.render("gameDetails", {
    categoriesList: req.categories,
    game: game.get(parseInt(id)),
  });
}

module.exports = {
  gamesGet,
  gamesInCategoryGet,
  gameInfoGet,
};
