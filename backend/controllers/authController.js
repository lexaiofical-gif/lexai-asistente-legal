// ================================================
// ARCHIVO: authController.js
// ================================================
// FUNCIÓN PRINCIPAL: MANEJA TODA LA AUTENTICACIÓN,
// REGISTRO, LOGIN, VERIFICACIÓN, ROLES Y CONTRASEÑAS
// ================================================
// PALABRA CLAVE GENERAL: AUTENTICACIÓN Y GESTIÓN DE USUARIOS
// ================================================

// ================================================
// 1️⃣ IMPORTACIONES NECESARIAS (VERSIÓN FINAL SEGURA)
// ================================================
const User = require('../models/User'); 
const jwt = require('jsonwebtoken'); 
const {
    sendWelcomeEmail,
    sendPasswordChangeEmail,
    sendVerificationEmail,
    generateVerificationCode, // Se asegura la coma
    sendPasswordResetCode      // Se añade la nueva función
} = require('../config/email'); // FUNCIONES PARA ENVIAR CORREOS AUTOMÁTICOS

// ================================================
// 2️⃣ FUNCIÓN PARA GENERAR TOKENS DE AUTENTICACIÓN
// ================================================
// PALABRA CLAVE: TOKEN
// QUIÉN LO ACTIVA: LOGIN, VERIFICACIÓN Y REGISTRO
// SE CONECTA CON: JWT_SECRET Y JWT_EXPIRE EN EL ARCHIVO .env
// ================================================
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// ================================================
// 3️⃣ REGISTRO DE NUEVO USUARIO
// ================================================
// PALABRA CLAVE: REGISTRO / CREAR CUENTA
// RUTA: POST /api/auth/register
// QUIÉN LO ACTIVA: FRONTEND (FORMULARIO DE REGISTRO)
// SE CONECTA CON: MODELO USER Y ARCHIVO email.js
// ================================================
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // VERIFICAR SI YA EXISTE UN USUARIO CON ESE CORREO
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // CREAR CÓDIGO DE VERIFICACIÓN
        const verificationCode = generateVerificationCode();

        // CREAR NUEVO USUARIO NO VERIFICADO
        const user = await User.create({
            name,
            email,
            password,
            verificationCode,
            isVerified: false
        });

        // ENVIAR CORREO DE VERIFICACIÓN
        await sendVerificationEmail(user.email, user.name, verificationCode);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado. Revisa tu correo para verificar la cuenta.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar usuario' });
    }
};

// ================================================
// 4️⃣ LOGIN (INICIO DE SESIÓN)
// ================================================
// PALABRA CLAVE: LOGIN / INICIAR SESIÓN
// RUTA: POST /api/auth/login
// QUIÉN LO ACTIVA: FRONTEND (BOTÓN DE “INICIAR SESIÓN”)
// SE CONECTA CON: MODELO USER Y TOKEN JWT
// ================================================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // BUSCAR USUARIO
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        // COMPROBAR CONTRASEÑA
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        // VERIFICAR SI ESTÁ CONFIRMADO
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Cuenta no verificada' });
        }

        // GENERAR TOKEN
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el login' });
    }
};

// ================================================
// 5.5️⃣ REENVIAR CÓDIGO DE VERIFICACIÓN (NUEVA FUNCIÓN)
// ================================================
// PALABRA CLAVE: REENVIAR CÓDIGO
// RUTA: POST /api/auth/resend-code
// QUIÉN LO ACTIVA: FRONTEND (BOTÓN "reenviar código")
// SE CONECTA CON: MODELO USER Y EMAIL
// ================================================
exports.resendCode = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Mensaje de seguridad genérico
            return res.status(200).json({ message: 'Si la cuenta existe, se ha enviado un nuevo código.' });
        }
        
        // No permitir reenviar si ya está verificada
        if (user.isVerified) {
            return res.status(400).json({ message: 'La cuenta ya está verificada.' });
        }

        // 1. Generar nuevo código
        const newVerificationCode = generateVerificationCode();

        // 2. Actualizar usuario con nuevo código y expiración (usa la misma lógica de expiración que en ForgotPassword)
        user.verificationCode = newVerificationCode;
        user.verificationCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutos de validez
        await user.save({ validateBeforeSave: false }); 

        // 3. Enviar nuevo correo de verificación
        await sendVerificationEmail(user.email, user.name, newVerificationCode);

        res.status(200).json({
            success: true,
            message: 'Nuevo código de verificación enviado a tu correo.'
        });

    } catch (error) {
        console.error('Error en resendCode:', error);
        res.status(500).json({ message: 'Error al reenviar el código.' });
    }
};


// ================================================
// 5️⃣.5 VERIFICAR CÓDIGO DE CORREO
// ================================================
// PALABRA CLAVE: VERIFICAR CUENTA
// RUTA: POST /api/auth/verify-code
// QUIÉN LO ACTIVA: FRONTEND (CUANDO USUARIO INGRESA EL CÓDIGO ENVIADO AL CORREO)
// SE CONECTA CON: MODELO USER Y EMAIL
// ================================================
exports.verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Código incorrecto' });
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        // Asegúrate de tener sendWelcomeEmail importado
        await sendWelcomeEmail(user.email, user.name);

        // Asegúrate de tener generateToken definido
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Cuenta verificada correctamente',
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar la cuenta' });
    }
};

// ================================================
// 6️⃣ OBTENER PERFIL DEL USUARIO LOGUEADO
// ================================================
// PALABRA CLAVE: PERFIL
// RUTA: GET /api/auth/me
// QUIÉN LO ACTIVA: FRONTEND (AL ABRIR PERFIL O DASHBOARD)
// SE CONECTA CON: MIDDLEWARE AUTH (req.user)
// ================================================
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
};

// ================================================
// 7️⃣ CAMBIAR ROL DE USUARIO (ADMIN)
// ================================================
// PALABRA CLAVE: CAMBIO DE ROL
// RUTA: PUT /api/auth/users/:id/role
// QUIÉN LO ACTIVA: ADMINISTRADOR DESDE PANEL
// SE CONECTA CON: MIDDLEWARES protect Y authorize('admin')
// ================================================
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        user.role = role;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Rol actualizado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
};

// ================================================
// 8️⃣ LISTAR TODOS LOS USUARIOS (SOLO ADMIN)
// ================================================
// PALABRA CLAVE: LISTA DE USUARIOS
// RUTA: GET /api/auth/users
// QUIÉN LO ACTIVA: PANEL DE ADMINISTRACIÓN
// SE CONECTA CON: MIDDLEWARE authorize('admin')
// ================================================
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

// ================================================
// 9️⃣ ELIMINAR USUARIO (ADMIN)
// ================================================
// PALABRA CLAVE: ELIMINAR USUARIO
// RUTA: DELETE /api/auth/users/:id
// QUIÉN LO ACTIVA: ADMINISTRADOR DESDE PANEL
// SE CONECTA CON: MIDDLEWARE authorize('admin')
// ================================================
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

// ================================================
// 🔟 CAMBIO DE CONTRASEÑA
// ================================================
// PALABRA CLAVE: CONTRASEÑA
// RUTA: PUT /api/auth/change-password
// QUIÉN LO ACTIVA: USUARIO LOGUEADO
// SE CONECTA CON: MODELO USER Y EMAIL.js
// ================================================
exports.changePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        const { currentPassword, newPassword } = req.body;

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña actual no es correcta' });
        }

        user.password = newPassword;
        await user.save();

        await sendPasswordChangeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: 'Contraseña cambiada exitosamente'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
};
// ================================================
// ❓ RECUPERAR CONTRASEÑA (INICIO DEL PROCESO)
// ================================================
// RUTA: POST /api/auth/forgotpassword
// QUIÉN LO ACTIVA: FORMULARIO DE PANTALLA DE LOGIN
// ================================================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Mensaje de seguridad: Siempre responde exitoso para no revelar si el correo existe o no
            return res.status(200).json({ message: 'Si el correo existe, recibirás un código para restablecer tu contraseña.' });
        }

        // Reutilizar la lógica de código de verificación
        const verificationCode = generateVerificationCode();
        
        // Guardar el código en los campos de verificación existentes (o puedes crear campos nuevos para el reset)
        // Usaremos los campos de verificación existentes para simplificar
        user.verificationCode = verificationCode;
        // Establecer una expiración de 15 minutos para el código
        user.verificationCodeExpires = Date.now() + 15 * 60 * 1000;
        await user.save({ validateBeforeSave: false }); // No validar contraseña al guardar

        // ⚠️ Llamar a la nueva función de email que crearemos en email.js
        await sendPasswordResetCode(user.email, user.name, verificationCode); 

        res.status(200).json({ 
            success: true, 
            message: 'Código de recuperación enviado.',
            email: user.email // Enviar el email para el Frontend
        });

    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ message: 'Error al enviar el código de recuperación.' });
    }
};

// ================================================
// ❓ VERIFICAR CÓDIGO Y RESTABLECER CONTRASEÑA
// ================================================
// RUTA: PUT /api/auth/resetpassword
// QUIÉN LO ACTIVA: PANTALLA DE INGRESO DEL CÓDIGO
// ================================================
exports.resetPasswordVerifyCode = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        
        // 1. Validar que el código sea correcto
        if (user.verificationCode !== code) {
            return res.status(400).json({ message: 'Código de verificación incorrecto.' });
        }

        // 2. Validar que el código no haya expirado
        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'El código ha expirado. Solicita uno nuevo.' });
        }

        // 3. Actualizar la contraseña
        user.password = newPassword;
        
        // 4. Limpiar los campos de código
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save(); // Mongoose se encargará de hashear el nuevo password antes de guardar (si está definido en tu modelo User)

        res.status(200).json({
            success: true,
            message: 'Contraseña restablecida exitosamente. Puedes iniciar sesión.'
        });

    } catch (error) {
        console.error('Error en resetPasswordVerifyCode:', error);
        res.status(500).json({ message: 'Error al restablecer la contraseña.' });
    }
};
