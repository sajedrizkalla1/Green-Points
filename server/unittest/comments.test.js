const { commentsController } = require('../controllers/commentsController');
const Comment = require('../models/comments');
const { infoLogger, errorLogger } = require("../logs/logs");

describe('commentsController.addComment', () => {
    it('should add a new comment', async () => {
        const req = { body: { comment: 'Test comment' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };

        // Mocking the save method of the Comment model
        const savedComment = { _id: '123', text: 'Test comment' };
        Comment.prototype.save = jest.fn().mockResolvedValue(savedComment);

        await commentsController.addComment(req, res);

        expect(res.json).toHaveBeenCalledWith(savedComment);
    });

    it('should handle errors when adding a comment', async () => {
        const req = { body: { comment: 'Test comment' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const error = new Error('Database error');
        
        // Mocking the save method of the Comment model to throw an error
        Comment.prototype.save = jest.fn().mockRejectedValue(error);

        await commentsController.addComment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});

describe('commentsController.getComments', () => {
    it('should get all comments', async () => {
        const comments = [{ _id: '1', text: 'Comment 1' }, { _id: '2', text: 'Comment 2' }];
        const req = {};
        const res = {
            json: jest.fn()
        };

        // Mocking the find method of the Comment model
        Comment.find = jest.fn().mockResolvedValue(comments);

        await commentsController.getComments(req, res);

        expect(res.json).toHaveBeenCalledWith(comments);
    });

    it('should handle errors when getting comments', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn()
        };
        const error = new Error('Database error');

        // Mocking the find method of the Comment model to throw an error
        Comment.find = jest.fn().mockRejectedValue(error);

        await commentsController.getComments(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});

describe('commentsController.deleteComment', () => {
    it('should delete a comment successfully', async () => {
        const req = { params: { id: '123' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        // Mocking the findByIdAndDelete method of the Comment model
        const deletedComment = { _id: '123', text: 'Deleted comment' };
        Comment.findByIdAndDelete = jest.fn().mockResolvedValue(deletedComment);

        await commentsController.deleteComment(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' });
    });

    it('should handle not found error when deleting a comment', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        Comment.findByIdAndDelete = jest.fn().mockResolvedValue(null);

        await commentsController.deleteComment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Comment not found' });
    });

    it('should handle errors when deleting a comment', async () => {
        const req = { params: { id: '123' } };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const error = new Error('Database error');

        Comment.findByIdAndDelete = jest.fn().mockRejectedValue(error);

        await commentsController.deleteComment(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error deleting comment', error: error });
    });
});
