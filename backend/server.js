const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));

// Ruta raíz
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

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message : 'Error en el servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Accede a: http://localhost:${PORT}`);
});