'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.book.belongsToMany(models.user, {through: 'user_books'})
      models.book.hasMany(models.comment)
    }
  };
  book.init({
    book_id: DataTypes.INTEGER,
    isbn: DataTypes.INTEGER,
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};