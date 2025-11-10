// ================================================================
// 🚀 ARCHIVO PRINCIPAL DEL BACKEND (SERVER.JS)
// ESTE ARCHIVO ES EL MÁS IMPORTANTE DEL SERVIDOR
// PORQUE SE ENCARGA DE CONECTAR TODO EL SISTEMA,
// INICIAR LA API, Y VINCULAR LAS DIFERENTES RUTAS,
// CONTROLADORES Y LA BASE DE DATOS.
// ================================================================

// IMPORTA EXPRESS (LIBRERÍA PRINCIPAL PARA CREAR EL SERVIDOR)
const express = require('express');

// IMPORTA CORS (PERMITE CONEXIÓN ENTRE BACKEND Y FRONTEND)
const cors = require('cors');

// IMPORTA DOTENV (PERMITE LEER VARIABLES GUARDADAS EN EL ARCHIVO .env)
const dotenv = require('dotenv');

// IMPORTA LA FUNCIÓN QUE CONECTA CON LA BASE DE DATOS (MONGODB)
const connectDB = require('./config/database');

// ================================================================
// CARGA LAS VARIABLES DE ENTORNO DESDE EL ARCHIVO .env
// (AQUÍ SE OBTIENEN DATOS COMO PUERTO, URI DE BASE DE DATOS, ETC.)
// ================================================================
dotenv.config();

// ================================================================
// SE CONECTA A LA BASE DE DATOS USANDO LA FUNCIÓN connectDB()
// SIN ESTO, EL SISTEMA NO PODRÍA GUARDAR NI LEER INFORMACIÓN.
// ================================================================
connectDB();

// ================================================================
// CREA LA APLICACIÓN PRINCIPAL EXPRESS (EL CORAZÓN DEL BACKEND)
// AQUÍ SE MONTAN TODAS LAS FUNCIONES, RUTAS Y CONEXIONES.
// ================================================================
const app = express();

// ================================================================
// MIDDLEWARES: SON FUNCIONES QUE SE EJECUTAN ANTES DE LAS RUTAS
// SIRVEN PARA PERMITIR LA LECTURA DE DATOS Y CONTROL DE ACCESO.
// ================================================================
app.use(cors()); // PERMITE CONEXIÓN ENTRE BACKEND Y FRONTEND
app.use(express.json()); // PERMITE LEER DATOS EN FORMATO JSON
app.use(express.urlencoded({ extended: true })); // PERMITE LEER DATOS DE FORMULARIOS

// ================================================================
// 🔗 CONEXIÓN DE RUTAS (SE UNE CON LOS ARCHIVOS DE LA CARPETA "routes")
// CADA RUTA TIENE SU PROPIO CONTROLADOR (LÓGICA DE FUNCIONES).
// ================================================================
app.use('/api/auth', require('./routes/authRoutes')); // CONECTA EL SISTEMA DE LOGIN Y REGISTRO
app.use('/api/chat', require('./routes/chatRoutes')); // CONECTA EL SISTEMA DE CHAT INTELIGENTE
app.use('/api/documents', require('./routes/documentRoutes')); // CONECTA EL SISTEMA DE DOCUMENTOS

// ================================================================
// RUTA PRINCIPAL (SE ACTIVA CUANDO VISITAS LA RAÍZ DEL SERVIDOR)
// SIRVE PARA PROBAR QUE LA API ESTÉ FUNCIONANDO CORRECTAMENTE.
// ================================================================
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API de LexAI funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            chat: '/api/chat',
            documents: '/api/documents'
        }
    });
});

// ================================================================
// MANEJO DE RUTAS NO ENCONTRADAS
// SI EL USUARIO INTENTA ENTRAR A UNA RUTA QUE NO EXISTE, SE MUESTRA ESTE MENSAJE.
// ================================================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// ================================================================
// MANEJO GLOBAL DE ERRORES DEL SERVIDOR
// CAPTURA CUALQUIER ERROR GENERAL Y EVITA QUE EL SERVIDOR SE CAIGA.
// ================================================================
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message : 'Error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// ================================================================
// 🚀 INICIAR EL SERVIDOR
// SE ACTIVA DESDE EL COMANDO "npm start" O "node server.js"
// ESTE PASO ENCIENDE TODO EL BACKEND Y LO CONECTA CON EL FRONTEND.
// ================================================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Accede a: http://localhost:${PORT}`);
});
