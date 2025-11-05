
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { sendWelcomeEmail, sendPasswordChangeEmail, sendVerificationEmail, generateVerificationCode } = require('../config/email');
// Generar JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        // Generar código de verificación
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // Crear usuario (NO verificado)
        const user = await User.create({
            name,
            email,
            password,
            role: 'user',
            isVerified: true,
            verificationCode,
            verificationCodeExpires
        });

        // Enviar código por email
        //try {
            //await sendVerificationEmail(user.email, user.name, verificationCode);
        //} catch (emailError) {
            // Si falla el email, eliminar usuario y mostrar error
        //    await User.findByIdAndDelete(user._id);
        //    return res.status(500).json({
        //        success: false,
        //        message: 'Error al enviar el código de verificación. Por favor intenta nuevamente.'
        //    });
        //}

        res.status(201).json({
            success: true,
            message: 'Registro exitoso. Por favor verifica tu email para activar tu cuenta.',
            userId: user._id,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};


// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar email y password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor ingrese email y contraseña'
            });
        }

        // Buscar usuario (incluir password)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Correo o contraseña incorrectos'
            });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Correo o contraseña incorrectos'
            });
        }

        // Verificar que la cuenta esté verificada
        if (!user.isVerified) {
            return res.status(403).json({
                success: true,
                message: 'Por favor verifica tu cuenta. Revisa tu email para obtener el código de verificación.',
                needsVerification: true,
                userId: user._id
            });
        }

        // Generar token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                joined: user.joined
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado'
            });
        }

        // Generar código de verificación
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        // Crear usuario (NO verificado)
        const user = await User.create({
            name,
            email,
            password,
            role: 'user',
            isVerified: true,
            verificationCode,
            verificationCodeExpires
        });

        // Enviar código por email
        try {
            await sendVerificationEmail(user.email, user.name, verificationCode);
            
            res.status(201).json({
                success: true,
                message: 'Registro exitoso. Por favor verifica tu email para activar tu cuenta.',
                userId: user._id,
                email: user.email
            });
        } catch (emailError) {
            // Si falla el email, eliminar usuario y mostrar error
            //await User.findByIdAndDelete(user._id);
            //return res.status(500).json({
            //    success: false,
            //    message: 'Error al enviar el código de verificación. Verifica tu configuración de email.'
            //});
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                joined: user.joined
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

// @desc    Actualizar rol de usuario (solo admin)
// @route   PUT /api/auth/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Rol inválido'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

// @desc    Obtener todos los usuarios (solo admin)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message
        });
    }
};

// @desc    Eliminar usuario (solo admin)
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Usuario eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor',
            error: error.message

        });
    }
};
// @desc    Cambiar contraseña
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Por favor ingrese la contraseña actual y la nueva'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres'
            });
        }

        // Buscar usuario con contraseña
        const user = await User.findById(req.user.id).select('+password');

        // Verificar contraseña actual
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'La contraseña actual es incorrecta'
            });
        }

        // Actualizar contraseña
        user.password = newPassword;
        await user.save();

        // Enviar email de notificación
        sendPasswordChangeEmail(user.email, user.name, newPassword).catch(err =>
            console.error('Error enviando email:', err)
        );

        res.status(200).json({
            success: true,
            message: 'Contraseña actualizada correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cambiar la contraseña',
            error: error.message
        });
    }
};
// @desc    Verificar código de registro
// @route   POST /api/auth/verify-code
// @access  Public
exports.verifyCode = async (req, res) => {
    try {
        const { userId, code } = req.body;

        if (!userId || !code) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione el código de verificación'
            });
        }

        // Buscar usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si ya está verificado
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Esta cuenta ya ha sido verificada'
            });
        }

        // Verificar si el código expiró
        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'El código de verificación ha expirado. Solicita uno nuevo.'
            });
        }

        // Verificar el código
        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message: 'Código de verificación incorrecto'
            });
        }

        // Activar cuenta
        user.isVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;
        await user.save();

        // Enviar email de bienvenida
        sendWelcomeEmail(user.email, user.name).catch(err => 
            console.error('Error enviando email de bienvenida:', err)
        );

        // Generar token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Cuenta verificada exitosamente',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                joined: user.joined
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar el código',
            error: error.message
        });
    }
};

// @desc    Reenviar código de verificación
// @route   POST /api/auth/resend-code
// @access  Public
exports.resendCode = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione el ID de usuario'
            });
        }

        // Buscar usuario
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar si ya está verificado
        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Esta cuenta ya ha sido verificada'
            });
        }

        // Generar nuevo código
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

        user.verificationCode = verificationCode;
        user.verificationCodeExpires = verificationCodeExpires;
        await user.save();

        // Enviar nuevo código por email
        await sendVerificationEmail(user.email, user.name, verificationCode);

        res.status(200).json({
            success: true,
            message: 'Nuevo código de verificación enviado a tu email'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al reenviar el código',
            error: error.message
        });
    }
};
