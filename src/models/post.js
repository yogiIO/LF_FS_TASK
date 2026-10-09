const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
    sequelize.define('Post', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.STRING(200), allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        image_url: { type: DataTypes.STRING(255), allowNull: true },
        likes_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
    }, { tableName: 'posts', timestamps: true, underscored: true });
