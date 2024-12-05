const db = require("../db/queries");
const gamesMap = require("../utils/gamesMap");
const { body, validationResult } = require("express-validator");

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

function newGameGet(req, res) {
  res.render("newGame", {
    categoriesList: req.categories,
    formData: {},
  });
}

const validateGame = [
  body("gameName")
    .trim()
    .notEmpty()
    .withMessage("Game title is required")
    .isLength({ min: 1, max: 255 })
    .withMessage("Game title must be between 1 and 255 characters"),
  body("gamePrice")
    .trim()
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ decimal_digits: "0,2", min: "0.01" })
    .withMessage("Price must be greater than 0."),
  body("gameStock")
    .trim()
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: "1" })
    .withMessage("Stock must be integer greater than 0."),
  body("gameImg")
    .optional({ checkFalsy: true })
    .trim()
    .isURL({ protocols: ["http", "https"] })
    .withMessage("Check if image URL is correct.")
    .isLength({ max: 255 })
    .withMessage("Image URL cannot be longer than 255 characters."),
];

newGamePost = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newGame", {
        categoriesList: req.categories,
        formData: req.body,
        errors: errors.array(),
      });
    }

    const newGame = await db.insertGame(req.body);
    const newGameCategories = req.body.gameCategories;

    if (newGameCategories && newGameCategories.length > 0) {
      const categoryPromises = newGameCategories.map((category) =>
        db.addCategoryToGame(newGame[0].id, category)
      );

      await Promise.all(categoryPromises);
    }

    res.redirect(`/game/${newGame[0].id}`);
  },
];

async function gameDeletePost(req, res) {
  const id = req.params.id;
  await db.deleteGame(id);

  res.redirect("/");
}

async function editGameGet(req, res) {
  const id = req.params.id;
  const rows = await db.getGameWithCategories(id);
  const game = gamesMap.createGamesWithCategoriesMap(rows).get(parseInt(id));

  const categoriesID = game.categories.map((category) => category.id);

  const formData = {
    gameID: game.id,
    gameName: game.name,
    gamePrice: game.price,
    gameStock: game.stock,
    gameImg: game.image_url,
    gameDescription: game.description,
    gameCategories: categoriesID,
  };

  res.render("editGame", {
    categoriesList: req.categories,
    formData: formData,
  });
}

editGamePost = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("editGame", {
        categoriesList: req.categories,
        formData: req.body,
        errors: errors.array(),
      });
    }

    const id = parseInt(req.params.id);

    await db.updateGame(id, req.body);
    await db.updateCategories(id, req.body.gameCategories);

    res.redirect(`/game/${id}`);
  },
];

module.exports = {
  gamesGet,
  gamesInCategoryGet,
  gameInfoGet,
  newGameGet,
  newGamePost,
  gameDeletePost,
  editGameGet,
  editGamePost,
};
