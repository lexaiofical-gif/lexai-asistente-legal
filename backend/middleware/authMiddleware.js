const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas - verificar token JWT
exports.protect = async (req, res, next) => {
    let token;

    // Verificar si el token existe en los headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado para acceder a esta ruta'
        });
    }

    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscar usuario
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};

// Verificar si el usuario es admin
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `El rol '${req.user.role}' no tiene permiso para acceder a esta ruta`
            });
        }
        next();
    };
};