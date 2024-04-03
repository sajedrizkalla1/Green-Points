const Comment = require('../models/comments'); // Assuming this is the correct path
const { infoLogger, errorLogger } = require("../logs/logs");

exports.commentsController = {

    async addComment(req, res) {
        try {
            const newComment = new Comment({
                text: req.body.comment
            });
            const savedComment = await newComment.save();
            res.json(savedComment);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },

    async getComments(req, res) {
        try {
            const comments = await Comment.find();
            res.json(comments);
        } catch (err) {
            console.error(err);
            res.status(500).send('Server error');
        }
    },

    async deleteComment(req, res) {
        try {
            const { id } = req.params; // Assuming comment ID is passed as a URL parameter
            const deletedComment = await Comment.findByIdAndDelete(id);
    
            if (deletedComment) {
                infoLogger.info(`Comment deleted successfully: ${id}`);
                res.json({ message: 'Comment deleted successfully' });
            } else {
                errorLogger.error(`Comment not found: ${id}`);
                res.status(404).json({ message: 'Comment not found' });
            }
        } catch (err) {
            errorLogger.error(`Error deleting comment: ${err}`);
            res.status(500).json({ message: 'Error deleting comment', error: err });
        }
    },    
    
};



