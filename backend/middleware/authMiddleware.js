// ============================================
// IMPORTAMOS LAS DEPENDENCIAS NECESARIAS
// ============================================

// JWT SE USA PARA CREAR Y VERIFICAR TOKENS DE AUTENTICACIÓN
const jwt = require('jsonwebtoken');

// IMPORTAMOS EL MODELO DE USUARIO PARA PODER BUSCARLO EN LA BASE DE DATOS
const User = require('../models/User');


// ============================================
// FUNCIÓN QUE PROTEGE LAS RUTAS PRIVADAS
// ============================================

// ESTA FUNCIÓN SE ASEGURA DE QUE EL USUARIO TENGA UN TOKEN VÁLIDO ANTES DE ENTRAR A CIERTAS RUTAS
exports.protect = async (req, res, next) => {
    let token;

    // VERIFICAMOS SI EL TOKEN EXISTE EN LOS HEADERS DE LA PETICIÓN
    // EL TOKEN DEBE VENIR COMO: "Authorization: Bearer [token]"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // AQUÍ SEPARAMOS EL TEXTO Y SOLO TOMAMOS EL TOKEN
        token = req.headers.authorization.split(' ')[1];
    }

    // SI NO HAY TOKEN, SIGNIFICA QUE NO ESTÁ AUTORIZADO
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado para acceder a esta ruta'
        });
    }

    try {
        // VERIFICAMOS QUE EL TOKEN SEA VÁLIDO USANDO LA CLAVE SECRETA DEL ARCHIVO .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // BUSCAMOS AL USUARIO EN LA BASE DE DATOS USANDO EL ID QUE ESTÁ DENTRO DEL TOKEN
        req.user = await User.findById(decoded.id);
        
        // SI EL USUARIO YA NO EXISTE EN LA BASE DE DATOS, SE NIEGA EL ACCESO
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // SI TODO ESTÁ BIEN, PASAMOS AL SIGUIENTE PASO O RUTA
        next();

    } catch (error) {
        // SI EL TOKEN ES INVÁLIDO O EXPIRÓ, SE ENVÍA UN MENSAJE DE ERROR
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};


// ============================================
// FUNCIÓN PARA VERIFICAR SI EL USUARIO ES ADMIN O TIENE UN ROL PERMITIDO
// ============================================

// ESTA FUNCIÓN SE USA PARA RESTRINGIR RUTAS SEGÚN EL ROL DEL USUARIO (EJEMPLO: SOLO ADMIN)
exports.authorize = (...roles) => {
    return (req, res, next) => {

        // SI EL ROL DEL USUARIO NO ESTÁ EN LA LISTA DE ROLES PERMITIDOS, NO PUEDE ENTRAR
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `El rol '${req.user.role}' no tiene permiso para acceder a esta ruta`
            });
        }

        // SI TIENE PERMISO, CONTINÚA CON LA PETICIÓN
        next();
    };
};
