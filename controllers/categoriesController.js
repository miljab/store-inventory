const db = require("../db/queries");

async function categoriesGet(req, res, next) {
  const categoriesTable = await db.getAllCategories();
  const categories = categoriesTable.map((category) => category.name);
  req.categories = categories;
  next();
}

module.exports = {
  categoriesGet,
};
