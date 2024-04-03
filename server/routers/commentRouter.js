const { Router } = require('express');
const { commentsController } = require('../controllers/commentsController');
const commentRouter = new Router();

// Assuming you have these methods in your eventsController
commentRouter.get('/', commentsController.getComments);
commentRouter.post('/', commentsController.addComment); // Note: Adjusted route for adding an event
commentRouter.delete('/:id', commentsController.deleteComment);

module.exports = { commentRouter };