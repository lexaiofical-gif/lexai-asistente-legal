const express = require('express');
const router = express.Router();
const { 
    processQuery, 
    getUserChatHistory, 
    getAllChatHistory 
} = require('../controllers/chatController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rutas protegidas
router.post('/query', protect, processQuery);
router.get('/history', protect, getUserChatHistory);

// Rutas de administrador
router.get('/history/all', protect, authorize('admin'), getAllChatHistory);

module.exports = router;