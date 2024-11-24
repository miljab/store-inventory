const { Router } = require("express");
const gamesRouter = Router();
const gamesController = require("../controllers/gamesController");

gamesRouter.get("/", gamesController.gamesGet);
gamesRouter.get("/category/:id", gamesController.gamesInCategoryGet);

module.exports = gamesRouter;
