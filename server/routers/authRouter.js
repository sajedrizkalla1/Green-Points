const { Router } = require('express');
const { authController } = require('../controllers/authController');
const authRouter = new Router();

authRouter.post('/forgetPassword', authController.forgetPassword);
authRouter.post('/resetPassword', authController.resetPassword);

authRouter.post('/login', authController.login);
authRouter.post('/signup', authController.signup);


module.exports = { authRouter };
