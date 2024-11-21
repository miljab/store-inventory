const path = require("node:path");
const express = require("express");
const app = express();
const gamesRouter = require("./routes/gamesRouter");
const categoriesController = require("./controllers/categoriesController");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));

app.use(categoriesController.categoriesGet);

app.use("/", gamesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
