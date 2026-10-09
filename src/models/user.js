const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>
    sequelize.define('User', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
        email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
        password_hash: { type: DataTypes.STRING(255), allowNull: false },
        profile_picture_url: { type: DataTypes.STRING(255), allowNull: true },
        bio: { type: DataTypes.TEXT, allowNull: true }
    }, { tableName: 'users', timestamps: true, underscored: true });
