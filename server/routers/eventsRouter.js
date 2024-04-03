const { Router } = require('express');
const { eventsController } = require('../controllers/eventsController');
const eventsRouter = new Router();

// Assuming you have these methods in your eventsController
eventsRouter.get('/', eventsController.getEvents);
eventsRouter.get('/:id', eventsController.getEventById);
eventsRouter.post('/', eventsController.addEvent); // Note: Adjusted route for adding an event
eventsRouter.delete('/:id', eventsController.deleteEvent);
eventsRouter.post('/apply/:eventId/:userId', eventsController.applyToEvent);
eventsRouter.post('/apply/:eventId', eventsController.applyToEvent);
eventsRouter.put('/:id', eventsController.updateEvent);

module.exports = { eventsRouter };
