const { DataTypes } = require("sequelize");
const db = require("../db");

const Product = db.define('products', {
    productid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    datepurchased: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    purchaseprice: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    purchasetax: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    purchaseshipping: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
});

module.exports = Product;