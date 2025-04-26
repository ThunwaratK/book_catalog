const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

function setRoutes(app) {
    // Initialize the user controller with Cassandra client
    userController.initialize(app.locals.cassandra);
    
    // Authentication routes
    router.get('/register', userController.showRegister.bind(userController));
    router.post('/register', userController.register.bind(userController));
    router.get('/login', userController.showLogin.bind(userController));
    router.post('/login', userController.login.bind(userController));
    router.get('/logout', userController.logout.bind(userController));
    
    app.use('/auth', router);
}

module.exports = setRoutes;