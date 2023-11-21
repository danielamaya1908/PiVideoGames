const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); 

module.exports = (sequelize) => {
  sequelize.define('videogame', {
    id: {
      type: DataTypes.UUID, 
      allowNull: false,
      defaultValue: uuidv4, 
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    background_image: {
      type: DataTypes.TEXT,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATEONLY,
    },
    rating: {
      type: DataTypes.DECIMAL,
    },
    platforms: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Database',
    },
  });
};
