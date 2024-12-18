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
    "SELECT Games.*, Categories.id AS category_id, Categories.name AS category_name FROM Games LEFT JOIN GameCategories ON Games.id = GameCategories.game_id LEFT JOIN Categories ON GameCategories.category_id = Categories.id ORDER BY Games.id"
  );
  return rows;
}

async function getGamesInCategory(category_id) {
  const { rows } = await pool.query(
    "SELECT Games.*, Categories.id AS category_id, Categories.name AS category_name FROM Games LEFT JOIN GameCategories ON Games.id = GameCategories.game_id LEFT JOIN Categories ON GameCategories.category_id = Categories.id WHERE Games.id IN ( SELECT GameCategories.game_id FROM GameCategories WHERE GameCategories.category_id = ($1) ) ORDER BY Games.id",
    [category_id]
  );
  return rows;
}

async function getGameWithCategories(game_id) {
  const { rows } = await pool.query(
    `SELECT Games.*, Categories.id AS category_id, Categories.name AS category_name 
     FROM Games 
     LEFT JOIN GameCategories ON Games.id = GameCategories.game_id 
     LEFT JOIN Categories ON GameCategories.category_id = Categories.id 
     WHERE Games.id = $1`,
    [game_id]
  );

  return rows;
}

async function insertGame(data) {
  const columns = ["name", "price", "stock"];
  const values = [data.gameName, data.gamePrice, data.gameStock];
  if (data.gameDescription) {
    columns.push("description");
    values.push(data.gameDescription);
  }
  if (data.gameImg) {
    columns.push("image_url");
    values.push(data.gameImg);
  }

  const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

  const query = `
  INSERT INTO GAMES (${columns.join(", ")})
  VALUES (${placeholders})
  RETURNING *
  `;

  const { rows } = await pool.query(query, values);

  return rows;
}

async function addCategoryToGame(game_id, category_id) {
  await pool.query(
    "INSERT INTO GameCategories (game_id, category_id) VALUES ($1, $2)",
    [game_id, category_id]
  );
}

async function deleteGame(game_id) {
  await pool.query("DELETE FROM Games WHERE id = $1", [game_id]);
}

async function updateGame(game_id, data) {
  await pool.query(
    `UPDATE Games
    SET name = $1, price = $2, stock = $3, description = $4, image_url = $5
    WHERE id = $6`,
    [
      data.gameName,
      data.gamePrice,
      data.gameStock,
      data.gameDescription,
      data.gameImg,
      game_id,
    ]
  );
}

async function updateCategories(game_id, categories) {
  await pool.query("DELETE FROM GameCategories WHERE game_id = $1", [game_id]);

  const placeholders = categories
    .map((_, index) => `($${(index + 1) * 2 - 1}, $${(index + 1) * 2})`)
    .join(", ");

  const values = [];

  for (let i = 0; i < categories.length; i++) {
    values.push(game_id);
    values.push(categories[i]);
  }

  await pool.query(
    `INSERT INTO GameCategories (game_id, category_id) VALUES
    ${placeholders}`,
    values
  );
}

module.exports = {
  getAllCategories,
  getAllGames,
  getGamesWithCategories,
  getGamesInCategory,
  getGameWithCategories,
  insertGame,
  addCategoryToGame,
  deleteGame,
  updateGame,
  updateCategories,
};
