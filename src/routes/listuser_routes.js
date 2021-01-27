'use strict';
const express = require('express');
const router = express.Router();
const listUserController = require('../controllers/listuser_controller');

// Metodo para listar un usuario
router.get('/user/:email', listUserController.listUser);

module.exports = router;
