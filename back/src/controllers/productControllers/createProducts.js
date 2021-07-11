const { Category, Product, Review, User } = require("../../db");
const { products: productsSeed } = require("../../../seeds");
//const { Op } = require("sequelize");

//endPoint localhost:3001/product
async function createProducts(req, res, next) {
  try {
    if (!req.body.length) {
      res.send('Producto debe ser un array de al menos 1 elemento.');
    } else {
      const products = req.body;
      console.log(products)
      products.forEach(
        async ({ name, description, images, price, stock, categories }) => {
          const [product] = await Product.findOrCreate({
            where: {
              name,
            },
            defaults: { description, images, price, stock },
          });
          categories.forEach(async ({ name, image }) => {
            const [category] = await Category.findOrCreate({
              where: {
                name,
              },
              defaults: { image },
            });
            product.addCategory(category);
          });
          console.log(`Producto creado ${product.name}`);
        }
      );
      if (products.length > 1) {
        const productsNames = products.map((e) => e.name);
        res.json(`los productos ${productsNames} han sido creados exitosamente.`);
      }
      if (products.length === 1) {
        const productName = products.map((e) => e.name);
        res.json(`El producto ${productName} ha sido creado exitosamente.`);
      }
    }
  } catch (error) {
    console.error(error);
    res.send('Product is not create ERROR');
  }
}


module.exports = {
  createProducts,
};
