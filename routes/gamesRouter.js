const { Router } = require("express");
const gamesRouter = Router();
const gamesController = require("../controllers/gamesController");

gamesRouter.get("/", gamesController.gamesGet);
gamesRouter.get("/category/:id", gamesController.gamesInCategoryGet);
gamesRouter.get("/game/new", gamesController.newGameGet);
gamesRouter.post("/game/new", gamesController.newGamePost);
gamesRouter.get("/game/:id", gamesController.gameInfoGet);

module.exports = gamesRouter;
