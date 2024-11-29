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
    .withMessage("Stock must be greater than 0."),
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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(400).render("newGame", {
        categoriesList: req.categories,
        formData: req.body,
        errors: errors.array(),
      });
    }

    const {
      gameName,
      gamePrice,
      gameStock,
      gameImg,
      gameDescription,
      gameCategories,
    } = req.body;

    console.log({
      gameName,
      gamePrice,
      gameStock,
      gameImg,
      gameDescription,
      gameCategories,
    });

    res.redirect("/");
  },
];

module.exports = {
  gamesGet,
  gamesInCategoryGet,
  gameInfoGet,
  newGameGet,
  newGamePost,
};
