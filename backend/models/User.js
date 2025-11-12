// ============================================
// MODELO DE USUARIO (User.js)
// ============================================

// Define la estructura de los usuarios y la lógica de seguridad para las contraseñas

// Importa mongoose para crear la estructura (schema) en MongoDB
const mongoose = require('mongoose');

// Importa bcrypt para encriptar las contraseñas
const bcrypt = require('bcryptjs');

// ============================================
// DEFINICIÓN DEL ESQUEMA DEL USUARIO
// ============================================
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor ingrese un nombre'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Por favor ingrese un email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido']
    },
    password: {
        type: String,
        required: [true, 'Por favor ingrese una contraseña'],
        minlength: 6,
        select: false // No mostrar la contraseña en las consultas por seguridad
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String
    },
    verificationCodeExpires: {
        type: Date
    },
    joined: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // Agrega automáticamente createdAt y updatedAt
});

// ============================================
// MIDDLEWARE PARA ENCRIPTAR CONTRASEÑA
// ============================================
// Antes de guardar el usuario, encripta la contraseña si ha sido modificada
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// ============================================
// MÉTODO PERSONALIZADO PARA VALIDAR CONTRASEÑAS
// ============================================
// Compara la contraseña ingresada con la almacenada en la base de datos
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// ============================================
// EXPORTAR EL MODELO
// ============================================
// Crea y exporta el modelo para interactuar con la colección "users" en MongoDB
module.exports = mongoose.model('User', userSchema);





const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor ingrese un nombre'],
    },
    email: {
        type: String,
        required: [true, 'Por favor ingrese un email'],
        unique: true,
    },
    // ... (campos de password, role, etc.) ...
    
    isVerified: {
        type: Boolean,
        default: false
    },
    
    // ⬇️ AÑADE ESTE CAMPO ⬇️
    isActive: {
        type: Boolean,
        default: true // Todos los usuarios nuevos estarán activos por defecto
    },

    joined: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});
