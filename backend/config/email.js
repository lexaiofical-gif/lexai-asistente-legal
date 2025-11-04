const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verificar conexión
transporter.verify(function(error, success) {
    if (error) {
        console.log('❌ Error en configuración de email:', error.message);
    } else {
        console.log('✅ Servidor de email listo');
    }
});

// Función para generar código de 6 dígitos
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Función para enviar código de verificación
const sendVerificationEmail = async (email, name, code) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Código de Verificación - LexAI 🔐',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #4f46e5, #7c3aed); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Verifica tu Cuenta</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1f2937;">Hola ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Gracias por registrarte en LexAI. Para activar tu cuenta, ingresa el siguiente código:
                    </p>
                    <div style="background: white; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border: 2px dashed #4f46e5;">
                        <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Tu código de verificación es:</p>
                        <p style="color: #4f46e5; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0;">${code}</p>
                    </div>
                    <p style="color: #dc2626; font-size: 14px; text-align: center;">
                        ⏱️ Este código expira en 15 minutos
                    </p>
                    <p style="color: #6b7280; font-size: 14px;">
                        Si no solicitaste este código, ignora este mensaje.
                    </p>
                </div>
                <div style="background: #1f2937; padding: 20px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © 2025 LexAI. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Código de verificación enviado a: ${email}`);
    } catch (error) {
        console.error('❌ Error enviando código:', error);
        throw error;
    }
};

// Función para enviar email de bienvenida
const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: '¡Bienvenido a LexAI! 🏛️',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #4f46e5, #7c3aed); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">¡Bienvenido a LexAI!</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1f2937;">Hola ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Tu cuenta ha sido verificada exitosamente. ¡Bienvenido a LexAI!
                    </p>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Ahora puedes:
                    </p>
                    <ul style="color: #4b5563; font-size: 16px; line-height: 1.8;">
                        <li>💬 Hacer consultas sobre legislación colombiana</li>
                        <li>📄 Generar documentos legales profesionales</li>
                        <li>📚 Acceder a referencias legales actualizadas</li>
                        <li>💼 Gestionar tu historial de consultas y documentos</li>
                    </ul>
                </div>
                <div style="background: #1f2937; padding: 20px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © 2025 LexAI. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de bienvenida enviado a: ${email}`);
    } catch (error) {
        console.error('❌ Error enviando email:', error);
    }
};

// Función para enviar email de cambio de contraseña
const sendPasswordChangeEmail = async (email, name, newPassword) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Cambio de Contraseña - LexAI',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(to right, #4f46e5, #7c3aed); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">Cambio de Contraseña</h1>
                </div>
                <div style="padding: 30px; background: #f9fafb;">
                    <h2 style="color: #1f2937;">Hola ${name},</h2>
                    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                        Tu contraseña en LexAI ha sido actualizada exitosamente.
                    </p>
                    <p style="color: #dc2626; font-size: 14px;">
                        ⚠️ Si no fuiste tú, contacta con soporte inmediatamente.
                    </p>
                </div>
                <div style="background: #1f2937; padding: 20px; text-align: center;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        © 2025 LexAI. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de cambio de contraseña enviado a: ${email}`);
    } catch (error) {
        console.error('❌ Error enviando email:', error);
    }
};

module.exports = {
    sendWelcomeEmail,
    sendPasswordChangeEmail,
    sendVerificationEmail,
    generateVerificationCode
};