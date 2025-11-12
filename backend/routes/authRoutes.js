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
    resendCode,
    forgotPassword, 
    resetPasswordVerifyCode,
    activateUser // ⬅️ 1. IMPORTACIÓN AÑADIDA
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// ===================================
// RUTAS PÚBLICAS
// ===================================
router.post('/register', register);
router.post('/login', login);
router.post('/verify-code', verifyCode);
router.post('/resend-code', resendCode);

// 🔑 RUTAS DE RECUPERACIÓN DE CONTRASEÑA (PÚBLICAS)
router.post('/forgotpassword', forgotPassword); 
router.put('/resetpassword', resetPasswordVerifyCode); 

// ===================================
// RUTAS PROTEGIDAS
// ===================================
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

// ===================================
// RUTAS DE ADMINISTRADOR
// ===================================
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/role', protect, authorize('admin'), updateUserRole);

// Esta ruta (DELETE) ahora desactiva al usuario (Soft Delete)
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// ⬇️ 2. RUTA AÑADIDA PARA REACTIVAR ⬇️
router.put('/users/:id/activate', protect, authorize('admin'), activateUser);

module.exports = router;
