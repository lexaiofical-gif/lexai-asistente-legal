const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Contrato de Prestación de Servicios', 'Certificado Laboral', 'Carta de Renuncia']
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índice para búsquedas por usuario
documentSchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('Document', documentSchema);