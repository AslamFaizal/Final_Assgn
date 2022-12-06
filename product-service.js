
const Sequelize = require('sequelize');

var sequelize = new Sequelize('esowotiv', 'esowotiv', 's6NFvc6Zi_CSIWIvjjhie9yZ9pumwfWC', {
  host: 'peanut.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
    ssl:{rejectUnauthorized: false}
  },
  query: {raw:true}
});


const Product = sequelize.define('Product', {
  body: Sequelize.TEXT,
  title: Sequelize.STRING,
  postDate: Sequelize.DATE,
  featureImage: Sequelize.STRING,
  published: Sequelize.BOOLEAN
});

var Category = sequelize.define('Category', {
  category: Sequelize.STRING
});

Product.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = function () {
  return sequelize.sync();
};

module.exports.getAllProducts = function () {
  return new Promise((resolve, reject) => {
      Product.findAll().then(data=>{
          resolve(data);
      }).catch( err =>{
          reject("no results returned");
      });
  });
}

module.exports.getProductsByCategory = function (category) {
  return new Promise((resolve, reject) => {
      Product.findAll({
          where: {
              category: category
          }
      }).then( data => {
          resolve(data);
      }).catch(() => {
          reject("no results returned");
      });
  });
}

module.exports.getProductsByMinDate = function (minDateStr) {

  const { gte } = Sequelize.Op;

  return new Promise((resolve, reject) => {
      Product.findAll({
          where: {
              postDate: {
                  [gte]: new Date(minDateStr)
                }
          }
      }).then( data => {
          resolve(data);
      }).catch((err) => {
          reject("no results returned");
      });
  });
}

module.exports.getProductById = function (id) {
  return new Promise((resolve, reject) => {
      Product.findAll({
          where: {
              id: id
          }
      }).then( data => {
          resolve(data[0]);
      }).catch((err) => {
          reject("no results returned");
      });
  });
}

module.exports.addProduct = function (productData) {
  return new Promise((resolve, reject) => {
      productData.published = productData.published ? true : false;

      for (var prop in productData) {
          if (productData[prop] === '')
          productData[prop] = null;
      }

      productData.postDate = new Date();

      Product.create(productData).then(() => {
          resolve();
      }).catch((e) => {
          reject("unable to create product");
      });

  });
}

module.exports.deleteProductById = function (id) {
  return new Promise((resolve, reject) => {
      Product.destroy({
          where: {
              id: id
          }
      }).then( data => {
          resolve();
      }).catch(() => {
          reject("unable to delete product");
      });
  });
}

module.exports.getPublishedProducts = function () {
  return new Promise((resolve, reject) => {
      Product.findAll({
          where: {
              published: true
          }
      }).then( data => {
          resolve(data);
      }).catch(() => {
          reject("no results returned");
      });
  });
}

module.exports.getPublishedProductsByCategory = function (category) {
  return new Promise((resolve, reject) => {
      Product.findAll({
          where: {
              published: true,
              category: category
          }
      }).then( data => {
          resolve(data);
      }).catch(() => {
          reject("no results returned");
      });
  });
}

module.exports.getCategories = function () {
  return new Promise((resolve, reject) => {
      Category.findAll().then(data=>{
          resolve(data);
      }).catch( err =>{
          reject("no results returned")
      });
  });
}

module.exports.addCategory = function (categoryData) {
  return new Promise((resolve, reject) => {

      for (var prop in categoryData) {
          if (categoryData[prop] === '')
          categoryData[prop] = null;
      }

      Category.create(categoryData).then(() => {
          resolve();
      }).catch((e) => {
          reject("unable to create category");
      });

  });
}

module.exports.deleteCategoryById = function (id) {
  return new Promise((resolve, reject) => {
      Category.destroy({
          where: {
              id: id
          }
      }).then( data => {
          resolve();
      }).catch(() => {
          reject("unable to delete category");
      });
  });
}