//DEFINE EL MOLDE DEL DOCUMENTO SELECCIONADO POR EL USUARIO  UNICO SE ENLAZA CON USER.JS PARA VER QUIEN ES EL DUEÑO
      //IMPORTA A MONGO PARA CREAR LA ESTRUCTURA DE DE DATOS DE LOS DOCUME
const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    //ENLAZA EL DOCUMENTO CON EL USUARIO Q LO CREO
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
    //ALMACENA EL TEXTO COMPLETO DE LOS DOCUMENTS
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
//CREA Y EXPORTA EL MODELO PARA INTERACTUAR CON LA COLLECCION DE DOCUMENTOS
module.exports = mongoose.model('Document', documentSchema);
