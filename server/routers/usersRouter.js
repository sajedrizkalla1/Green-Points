const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const usersRouter = new Router();

usersRouter.get('/', usersController.getUsers); 
usersRouter.get('/:id', usersController.getUserDetails);  
usersRouter.post('/:id/volunterEvent', usersController.addVolunterEvent);
usersRouter.post('/:id/organizerEvent', usersController.addOrganizerEvent);
usersRouter.put('/:id/updateUser', usersController.editUserDetails);
usersRouter.delete('/:id/deleteUser', usersController.deleteUser);

module.exports = { usersRouter };
