const User = require('./user');
const Product = require('./product');

// Setup Associations
User.hasMany(Product);
Product.belongsTo(User);

module.exports = {
  User,
  Product
};