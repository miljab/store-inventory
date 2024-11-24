const db = require("../db/queries");

async function gamesGet(req, res) {
  const rows = await db.getGamesWithCategories();
  const gamesMap = new Map();

  rows.forEach((row) => {
    if (!gamesMap.has(row.id)) {
      gamesMap.set(row.id, {
        name: row.name,
        price: row.price,
        stock: row.stock,
        description: row.description,
        image_url: row.image_url,
        categories: [],
      });
    }

    if (row.category_name)
      gamesMap.get(row.id).categories.push(row.category_name);
  });

  res.render("gamesList", {
    categoriesList: req.categories,
    gamesList: gamesMap,
  });
}

async function gamesInCategoryGet(req, res) {
  const id = req.params.id;
  const rows = await db.getGamesInCategory(id);
  const gamesMap = new Map();

  rows.forEach((row) => {
    if (!gamesMap.has(row.id)) {
      gamesMap.set(row.id, {
        name: row.name,
        price: row.price,
        stock: row.stock,
        description: row.description,
        image_url: row.image_url,
        categories: [],
      });
    }

    if (row.category_name)
      gamesMap.get(row.id).categories.push(row.category_name);
  });

  res.render("gamesList", {
    categoriesList: req.categories,
    gamesList: gamesMap,
  });
}

module.exports = {
  gamesGet,
  gamesInCategoryGet,
};
