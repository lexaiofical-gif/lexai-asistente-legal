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
    // 🚨 ¡IMPORTACIONES AÑADIDAS!
    forgotPassword, // La función que envía el código
    resetPasswordVerifyCode // La función que verifica y cambia la contraseña
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
router.post('/forgotpassword', forgotPassword); // Usa la función importada directamente
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
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
