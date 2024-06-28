const express = require('express');
const authenticateRouter = (express.Router);
const authenticateController = require(' ../controllers/auth');
authenticateRouter.post('/register', authenticateController-registerUser);
authenticateRouter.post('/login', authenticateController.loginUser); 
module.exports(authRouter_);