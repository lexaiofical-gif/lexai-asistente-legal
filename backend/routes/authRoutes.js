const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    getAllUsers, 
    updateUserRole, 
    deleteUser,
    changePassword,
    verifyCode,
    resendCode
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rutas públicas
router.post('/register', register);
router.post('/login', login);
router.post('/verify-code', verifyCode);
router.post('/resend-code', resendCode);

// Rutas protegidas
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

// Rutas de administrador
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;