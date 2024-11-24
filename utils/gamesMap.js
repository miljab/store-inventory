function createGamesWithCategoriesMap(rows) {
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

  return gamesMap;
}

module.exports = { createGamesWithCategoriesMap };
