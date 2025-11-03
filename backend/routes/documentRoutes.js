const express = require('express');
const router = express.Router();
const { 
    generateDocument, 
    getTemplates, 
    getUserDocuments, 
    getDocument, 
    deleteDocument 
} = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');

// Rutas protegidas
router.post('/generate', protect, generateDocument);
router.get('/templates', protect, getTemplates);
router.get('/my-documents', protect, getUserDocuments);
router.get('/:id', protect, getDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;