// ===========================================================
// HISTORIAL DE CHAT (CHATHISTORY.JS)
// ===========================================================

// ESTE ARCHIVO SIRVE PARA GUARDAR TODO LO QUE EL USUARIO ESCRIBE
// Y TODO LO QUE EL SISTEMA (LEXAI) LE RESPONDE.
// EN OTRAS PALABRAS, AQUÍ SE GUARDA LA "MEMORIA" DE LAS CONVERSACIONES.

// -----------------------------------------------------------
// CONEXIÓN CON LA BASE DE DATOS
// -----------------------------------------------------------
// "MONGOOSE" ES LA HERRAMIENTA QUE SE USA PARA COMUNICARSE CON MONGODB.
// CON ESTO SE CREAN Y ORGANIZAN LOS DATOS DENTRO DE LA BASE DE DATOS.
const mongoose = require('mongoose');

// -----------------------------------------------------------
// ESTRUCTURA DE LOS DATOS QUE SE GUARDAN
// -----------------------------------------------------------
// AQUÍ SE DEFINE CÓMO SE VE CADA REGISTRO O MENSAJE QUE SE GUARDA
// EN EL HISTORIAL DEL CHAT.
const chatHistorySchema = new mongoose.Schema({
    // ID DEL USUARIO QUE HIZO LA PREGUNTA.
    // ESTO CONECTA CON EL ARCHIVO USER.JS, DONDE ESTÁN LOS DATOS DEL USUARIO.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // CORREO DEL USUARIO (SIRVE PARA SABER QUIÉN ESCRIBIÓ SIN BUSCAR POR ID).
    userEmail: {
        type: String,
        required: true
    },
    // EL MENSAJE O PREGUNTA QUE ESCRIBIÓ EL USUARIO.
    query: {
        type: String,
        required: true,
        trim: true
    },
    // LA RESPUESTA QUE DIO EL SISTEMA (LEXAI).
    response: {
        type: String,
        required: true               
    },
    // INDICA QUIÉN RESPONDIÓ (POR DEFECTO ES "LEXAI").
    reference: {
        type: String,
        default: 'LexAI'
    },
    // FECHA Y HORA EN QUE SE GUARDÓ LA CONVERSACIÓN.
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // AGREGA AUTOMÁTICAMENTE LA HORA DE CREACIÓN Y ACTUALIZACIÓN.
});

// -----------------------------------------------------------
// OPTIMIZACIÓN PARA BÚSQUEDAS
// -----------------------------------------------------------
// ESTO SIRVE PARA QUE CUANDO SE BUSQUEN LAS CONVERSACIONES DE UN USUARIO,
// MONGODB LAS ENCUENTRE MÁS RÁPIDO Y LAS MUESTRE EN ORDEN (DE LA MÁS NUEVA A LA MÁS VIEJA).
chatHistorySchema.index({ userId: 1, timestamp: -1 });

// -----------------------------------------------------------
// EXPORTAR EL MODELO
// -----------------------------------------------------------
// ESTO PERMITE QUE OTRAS PARTES DEL PROYECTO PUEDAN USAR ESTE ARCHIVO.
// POR EJEMPLO, UN CONTROLADOR PUEDE LLAMARLO PARA GUARDAR UN NUEVO CHAT
// O LEER LO QUE YA ESTÁ GUARDADO.
module.exports = mongoose.model('ChatHistory', chatHistorySchema);

// ===========================================================
// EXPLICACIÓN FINAL
// ===========================================================
// 🔹 PARA QUÉ SIRVE ESTE ARCHIVO:
// GUARDA EL HISTORIAL DE TODAS LAS CONVERSACIONES ENTRE EL USUARIO Y EL SISTEMA.
// CADA REGISTRO TIENE: QUIÉN PREGUNTÓ, QUÉ PREGUNTÓ, QUÉ RESPONDIÓ EL SISTEMA Y CUÁNDO FUE.

// 🔹 CON QUIÉN SE CONECTA:
// - SE CONECTA CON LA BASE DE DATOS MONGODB A TRAVÉS DE MONGOOSE.
// - TAMBIÉN SE RELACIONA CON EL MODELO "USER.JS" POR EL CAMPO "USERID".

// 🔹 QUIÉN LO ACTIVA:
// - OTROS ARCHIVOS DEL PROYECTO, COMO LOS CONTROLADORES O RUTAS.
//   POR EJEMPLO, AL GUARDAR UNA CONVERSACIÓN SE USA:
//     CONST CHATHISTORY = REQUIRE('../MODELS/CHATHISTORY');
//     CHATHISTORY.CREATE({ USERID, QUERY, RESPONSE, USEREMAIL });

// 🔹 QUÉ SE PUEDE MODIFICAR:
// - SE PUEDEN AGREGAR MÁS CAMPOS (POR EJEMPLO: "TEMA", "IDIOMA", "ESTADO").
// - SE PUEDE CAMBIAR EL VALOR POR DEFECTO DE "REFERENCE" (POR EJEMPLO "LEXAI" → "ASISTENTE").
// - SE PUEDEN QUITAR LOS "TIMESTAMPS" SI NO SE QUIERE GUARDAR LA HORA.
// - PERO **NO SE DEBE ELIMINAR `USERID`, `QUERY` NI `RESPONSE`**, 
//   PORQUE SON LOS CAMPOS PRINCIPALES QUE HACEN FUNCIONAR EL HISTORIAL.

