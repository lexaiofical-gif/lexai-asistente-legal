const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => {
        console.error('❌ Error conectando a MongoDB:', err);
        process.exit(1);
    });

// Definir el esquema de Usuario (simplificado)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    joined: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Crear usuario administrador
async function createAdminUser() {
    try {
        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ email: 'admin@lexai.co' });
        
        if (existingAdmin) {
            console.log('⚠️  El usuario administrador ya existe.');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('📧 Email: admin@lexai.co');
            console.log('🔑 Contraseña: admin123');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            process.exit(0);
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Crear usuario admin
        const admin = await User.create({
            name: 'Administrador LexAI',
            email: 'admin@lexai.co',
            password: hashedPassword,
            role: 'admin',
            joined: new Date()
        });

        console.log('✅ Usuario administrador creado exitosamente!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email: admin@lexai.co');
        console.log('🔑 Contraseña: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANTE: Cambia esta contraseña después del primer login');
        console.log('');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creando usuario administrador:', error);
        process.exit(1);
    }
}

createAdminUser();