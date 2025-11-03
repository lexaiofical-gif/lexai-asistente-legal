const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    getAllUsers, 
    updateUserRole, 
    deleteUser 
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Rutas protegidas
router.get('/me', protect, getMe);

// Rutas de administrador
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;