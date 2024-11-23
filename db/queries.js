const pool = require("./pool");

async function getAllCategories() {
  const { rows } = await pool.query("SELECT * FROM categories");
  return rows;
}

async function getAllGames() {
  const { rows } = await pool.query("SELECT * FROM games");
  return rows;
}

async function getGamesWithCategories() {
  const { rows } = await pool.query(
    "SELECT Games.*, Categories.name AS category_name FROM Games LEFT JOIN GameCategories ON Games.id = GameCategories.game_id LEFT JOIN Categories ON GameCategories.category_id = Categories.id ORDER BY Games.id"
  );
  return rows;
}

module.exports = {
  getAllCategories,
  getAllGames,
  getGamesWithCategories,
};
