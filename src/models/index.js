const sequelize = require('../config/database');
const defineUser = require('./user');
const definePost = require('./post');
const defineComment = require('./comment');
const defineLike = require('./like');

const User = defineUser(sequelize);
const Post = definePost(sequelize);
const Comment = defineComment(sequelize);
const Like = defineLike(sequelize);

User.hasMany(Post, { foreignKey: 'user_id', as: 'posts', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

User.hasMany(Comment, { foreignKey: 'user_id', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

Post.hasMany(Comment, { foreignKey: 'post_id', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

User.hasMany(Like, { foreignKey: 'user_id', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Post.hasMany(Like, { foreignKey: 'post_id', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'post_id', as: 'post' });

Comment.hasMany(Like, { foreignKey: 'comment_id', as: 'likes', onDelete: 'CASCADE' });
Like.belongsTo(Comment, { foreignKey: 'comment_id', as: 'comment' });

module.exports = { sequelize, User, Post, Comment, Like };
