const db = require("../db/queries");

async function categoriesGet(req, res, next) {
  const categoriesTable = await db.getAllCategories();
  const categories = categoriesTable.map((category) => {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
    };
  });
  req.categories = categories;
  next();
}

module.exports = {
  categoriesGet,
};
