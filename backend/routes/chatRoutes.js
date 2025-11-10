// ESTE ARCHIVO ES EL QUE UNE LAS PETICIONES DEL USUARIO CON LAS FUNCIONES DEL CHATBOT
// AQUÍ SE DECIDE QUÉ FUNCIÓN SE EJECUTA CUANDO SE LLAMA A UNA RUTA ESPECÍFICA (POR EJEMPLO, /query O /history)

// IMPORTA EXPRESS PARA CREAR RUTAS (CAMINOS DE ACCESO)
const express = require('express');
const router = express.Router();

// IMPORTA LAS FUNCIONES PRINCIPALES DEL CHAT DESDE EL CONTROLADOR (chatController.js)
// ESTAS FUNCIONES SON LAS QUE MANEJAN LAS CONSULTAS, EL HISTORIAL DE CADA USUARIO Y EL HISTORIAL GENERAL DE TODOS
const { 
    processQuery, 
    getUserChatHistory, 
    getAllChatHistory 
} = require('../controllers/chatController');

// IMPORTA LOS MIDDLEWARES DE SEGURIDAD QUE VERIFICAN SI EL USUARIO ESTÁ AUTENTICADO Y SI TIENE ROL DE ADMIN
// ESTOS SE CONECTAN CON EL ARCHIVO authMiddleware.js
const { protect, authorize } = require('../middleware/authMiddleware');

// RUTA PARA ENVIAR CONSULTAS AL CHATBOT (SOLO USUARIOS AUTENTICADOS)
// SE CONECTA CON LA FUNCIÓN processQuery DEL chatController.js
router.post('/query', protect, processQuery);

// RUTA PARA VER EL HISTORIAL PERSONAL DEL CHAT DEL USUARIO (SOLO USUARIOS AUTENTICADOS)
// SE CONECTA CON LA FUNCIÓN getUserChatHistory DEL chatController.js
router.get('/history', protect, getUserChatHistory);

// RUTA PARA VER TODO EL HISTORIAL DE CHAT DE TODOS LOS USUARIOS (SOLO ADMINISTRADORES)
// SE CONECTA CON LA FUNCIÓN getAllChatHistory DEL chatController.js
router.get('/history/all', protect, authorize('admin'), getAllChatHistory);

// EXPORTA EL ROUTER PARA QUE PUEDA SER USADO EN EL ARCHIVO PRINCIPAL (server.js O app.js)
// ESTE ARCHIVO SE UNE DIRECTAMENTE CON chatController.js Y authMiddleware.js
module.exports = router;
