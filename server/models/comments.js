const { Schema, model } = require('mongoose');

const CommentSchema = new Schema({
    text: String,
    createdAt: { type: Date, default: Date.now }
}, { collection: 'comments' });

const Comment = model('Comment', CommentSchema);

module.exports = Comment;
