// =============================================================
// IMPORTACIÓN DE DEPENDENCIAS
// =============================================================

// PALABRA CLAVE: require()
// "require" SE USA PARA IMPORTAR MÓDULOS EN NODE.JS

// SE IMPORTA LA LIBRERÍA JSONWEBTOKEN PARA CREAR Y VERIFICAR TOKENS DE AUTENTICACIÓN (JWT)
const jwt = require('jsonwebtoken');

// SE IMPORTA EL MODELO DE USUARIO PARA PODER BUSCAR INFORMACIÓN EN LA BASE DE DATOS
const User = require('../models/User');


// =============================================================
// MIDDLEWARE: PROTEGER RUTAS PRIVADAS
// =============================================================

// PALABRA CLAVE: exports.protect
// ESTE MIDDLEWARE SE ACTIVA AUTOMÁTICAMENTE CUANDO SE USA EN UNA RUTA, EJEMPLO:
// router.get('/perfil', protect, obtenerPerfil);

// ENTONCES:
// 1️⃣ EL USUARIO HACE UNA PETICIÓN A UNA RUTA PRIVADA
// 2️⃣ ANTES DE ENTRAR AL CONTROLADOR, SE EJECUTA "protect"
// 3️⃣ "protect" REVISA EL TOKEN DEL USUARIO Y DECIDE SI PUEDE CONTINUAR O NO

exports.protect = async (req, res, next) => {
    let token; // VARIABLE DONDE SE GUARDARÁ EL TOKEN ENCONTRADO

    // ================================================================
    // PASO 1: VERIFICAR SI EL TOKEN EXISTE EN LOS HEADERS
    // ================================================================

    // PALABRA CLAVE: req.headers.authorization
    // AQUÍ SE REVISA SI EL CLIENTE (FRONTEND) ENVIÓ EL TOKEN EN EL ENCABEZADO HTTP
    // EL TOKEN SE ENVÍA COMO: "Authorization: Bearer [TOKEN_AQUI]"

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // SEPARA EL TEXTO "Bearer" Y SOLO GUARDA EL TOKEN
        token = req.headers.authorization.split(' ')[1];
    }

    // ================================================================
    // PASO 2: SI NO HAY TOKEN, SE BLOQUEA EL ACCESO
    // ================================================================

    // PALABRA CLAVE: return res.status()
    // SE DEVUELVE UNA RESPUESTA HTTP 401 = NO AUTORIZADO
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado para acceder a esta ruta'
        });
    }

    // ================================================================
    // PASO 3: SI EXISTE TOKEN, SE VERIFICA Y DECODIFICA
    // ================================================================

    try {
        // PALABRA CLAVE: jwt.verify()
        // ESTA FUNCIÓN VERIFICA QUE EL TOKEN SEA VÁLIDO USANDO LA CLAVE SECRETA DEL ARCHIVO .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // ================================================================
        // PASO 4: BUSCAR AL USUARIO EN LA BASE DE DATOS
        // ================================================================

        // PALABRA CLAVE: await User.findById()
        // AQUÍ SE USA EL ID DEL TOKEN PARA BUSCAR AL USUARIO
        // SI EL USUARIO EXISTE, SE GUARDA EN req.user (ASÍ SE COMPARTE CON EL RESTO DE LA APP)
        req.user = await User.findById(decoded.id);
        
        // ================================================================
        // PASO 5: VALIDAR QUE EL USUARIO EXISTA
        // ================================================================

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // ================================================================
        // PASO 6: SI TODO ESTÁ CORRECTO, CONTINÚA AL SIGUIENTE MIDDLEWARE O CONTROLADOR
        // ================================================================

        // PALABRA CLAVE: next()
        // ESTA FUNCIÓN PERMITE PASAR AL SIGUIENTE PASO DEL PROCESO
        next();

    } catch (error) {
        // ================================================================
        // SI EL TOKEN ES INVÁLIDO O EXPIRÓ, SE BLOQUEA EL ACCESO
        // ================================================================
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};


// =============================================================
// MIDDLEWARE: VERIFICAR ROLES Y PERMISOS
// =============================================================

// PALABRA CLAVE: exports.authorize
// ESTE MIDDLEWARE SE USA DESPUÉS DE "protect"
// SU FUNCIÓN ES COMPROBAR SI EL USUARIO TIENE PERMISO SEGÚN SU ROL
// EJEMPLO:
// router.get('/admin', protect, authorize('admin'), funcionDelAdmin);

// ENTONCES:
// - PRIMERO SE EJECUTA "protect" (VERIFICA TOKEN)
// - LUEGO "authorize" (REVISA SI EL ROL DEL USUARIO ES PERMITIDO)

exports.authorize = (...roles) => {
    return (req, res, next) => {

        // PALABRA CLAVE: roles.includes()
        // REVISA SI EL ROL DEL USUARIO ESTÁ DENTRO DE LA LISTA DE ROLES PERMITIDOS
        if (!roles.includes(req.user.role)) {
            // SI NO TIENE PERMISO, SE DEVUELVE ERROR 403 = PROHIBIDO
            return res.status(403).json({
                success: false,
                message: `El rol '${req.user.role}' no tiene permiso para acceder a esta ruta`
            });
        }

        // SI EL ROL ESTÁ PERMITIDO, SE CONTINÚA
        next();
    };
};

