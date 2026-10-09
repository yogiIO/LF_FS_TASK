const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
    sequelize.define('Like', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        post_id: { type: DataTypes.INTEGER, allowNull: true },
        comment_id: { type: DataTypes.INTEGER, allowNull: true }
    }, {
        tableName: 'likes',
        timestamps: true,
        underscored: true,
        updatedAt: false,
        indexes: [
            { unique: true, fields: ['user_id', 'post_id', 'comment_id'], name: 'unique_like' }
        ]
    });
