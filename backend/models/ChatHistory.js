//DEFINE LA ESTRUCTURA PARA GUARDAR CADA PREGUNTA Y RESPUESTA GENERADA POR EL USUARIO  Y EL SISTEMA YA SE SABE Q USUARIO ES Y QUE
//ES LA MEMORIA TAMBIEN 

//LE DICE A NODE QUE USAREMOS LA HERRAMIENTA
const mongoose = require('mongoose');
//BUSQUEDA RAPIDA USA ETIQUETA ESPECIAL PARA MONGODB PARA ENCONTRAR TODOS LOS PEDIDOS MUY RAPIDO  DE UN CLIENTE
const chatHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    //EL PEDIDO PARA GUARDAR LO Q EL USUARIO ESCRIBIO  LA CONSULTA
    query: {
        type: String,
        required: true,
        trim: true
    },
    //ESPACIO PARA GUARDAR LA RESPUESTA Q DIO LEXAI
    response: {
        type: String,
        required: true               
    },
    reference: {
        type: String,
        default: 'LexAI'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índice para búsquedas rápidas por usuario
chatHistorySchema.index({ userId: 1, timestamp: -1 });
//HABILITA EL MOLDE DE HISTORIAL DE CHAT PARA OTRAS PARTES DEL CODIGO LO PUEDAN USAR PARA GUARDAR O LEER
module.exports = mongoose.model('ChatHistory', chatHistorySchema);
