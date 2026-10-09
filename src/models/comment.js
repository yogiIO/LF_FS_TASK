const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
    sequelize.define('Comment', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        post_id: { type: DataTypes.INTEGER, allowNull: false },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        likes_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 }
    }, { tableName: 'comments', timestamps: true, underscored: true });
