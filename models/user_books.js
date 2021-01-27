'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user_books.belongsTo(models.user)
      models.user_books.hasMany(models.book)
      models.user_books.hasMany(models.comment)
    }
  };
  user_books.init({
    user_id: DataTypes.INTEGER,
    book_id: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_books',
  });
  return user_books;
};