// ===========================================================
// PALABRA CLAVE: DOCUMENTOS
// ===========================================================
// ESTE ARCHIVO SIRVE PARA GUARDAR LOS DOCUMENTOS CREADOS POR CADA USUARIO.
// CADA DOCUMENTO ESTÁ ENLAZADO CON SU DUEÑO (USER.JS) Y GUARDA EL TEXTO COMPLETO.
// SE CONECTA CON LA BASE DE DATOS MONGODB A TRAVÉS DE MONGOOSE.
// OTRAS PARTES DEL PROYECTO PUEDEN USAR ESTE MODELO PARA CREAR, LEER O BORRAR DOCUMENTOS.

// -----------------------------------------------------------
// IMPORTAR HERRAMIENTA PARA LA BASE DE DATOS
// -----------------------------------------------------------
// "MONGOOSE" SE USA PARA HABLAR CON MONGODB Y CREAR LA ESTRUCTURA
// DE CÓMO SE GUARDAN LOS DOCUMENTOS EN LA BASE DE DATOS.
const mongoose = require('mongoose');

// -----------------------------------------------------------
// ESTRUCTURA DE LOS DOCUMENTOS
// -----------------------------------------------------------
// AQUÍ SE DEFINE CÓMO SE VE CADA DOCUMENTO QUE CREA UN USUARIO.
const documentSchema = new mongoose.Schema({
    // ENLACE ENTRE EL DOCUMENTO Y EL USUARIO QUE LO CREÓ.
    // ESTO CONECTA CON EL MODELO USER.JS PARA SABER QUIÉN ES EL DUEÑO.
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // TIPO DE DOCUMENTO QUE SE CREARÁ.
    // SOLO SE PERMITEN ESTOS TRES TIPOS DE EJEMPLO:
    // CONTRATO, CERTIFICADO LABORAL O CARTA DE RENUNCIA.
    type: {
        type: String,
        required: true,
        enum: ['Contrato de Prestación de Servicios', 'Certificado Laboral', 'Carta de Renuncia']
    },
    // AQUÍ SE GUARDA TODO EL TEXTO DEL DOCUMENTO COMPLETO.
    content: {
        type: String,
        required: true
    },
    // FECHA Y HORA EN QUE SE CREÓ EL DOCUMENTO.
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // AGREGA AUTOMÁTICAMENTE CREATEDAT Y UPDATEDAT.
});

// -----------------------------------------------------------
// OPTIMIZACIÓN PARA BÚSQUEDAS
// -----------------------------------------------------------
// PERMITE BUSCAR LOS DOCUMENTOS DE UN USUARIO MÁS RÁPIDO
// Y LOS ORDENA DE MÁS NUEVO A MÁS ANTIGUO.
documentSchema.index({ userId: 1, timestamp: -1 });

// -----------------------------------------------------------
// EXPORTAR EL MODELO
// -----------------------------------------------------------
// HABILITA ESTE MOLDE PARA QUE OTRAS PARTES DEL PROYECTO LO USEN,
// POR EJEMPLO PARA GUARDAR, EDITAR O MOSTRAR LOS DOCUMENTOS DE UN USUARIO.
module.exports = mongoose.model('Document', documentSchema);

// ===========================================================
// EXPLICACIÓN FINAL
// ===========================================================
// 🔹 PARA QUÉ SIRVE ESTE ARCHIVO:
// GUARDA LOS DOCUMENTOS QUE LOS USUARIOS CREAN, JUNTO CON SU TIPO Y CONTENIDO.
// TAMBIÉN REGISTRA QUIÉN LOS HIZO Y CUÁNDO.

// 🔹 CON QUIÉN SE CONECTA:
// - SE CONECTA CON MONGODB (BASE DE DATOS) A TRAVÉS DE MONGOOSE.
// - SE RELACIONA CON EL MODELO "USER.JS" POR EL CAMPO "USERID".

// 🔹 QUIÉN LO ACTIVA:
// - OTROS ARCHIVOS DEL PROYECTO, COMO CONTROLADORES O RUTAS,
//   POR EJEMPLO CUANDO UN USUARIO CREA O CONSULTA UN DOCUMENTO.

// 🔹 QUÉ SE PUEDE MODIFICAR:
// - PUEDES AGREGAR MÁS TIPOS DE DOCUMENTOS AL ENUM.
// - PUEDES AÑADIR NUEVOS CAMPOS COMO "TÍTULO" O "DESCRIPCIÓN".
// - PUEDES CAMBIAR EL NOMBRE DEL MODELO ("DOCUMENT") SI QUIERES RENOMBRAR LA COLECCIÓN.
// - PERO **NO BORRES `USERID`, `TYPE` NI `CONTENT`**, 
//   PORQUE SON LOS DATOS PRINCIPALES PARA QUE TODO FUNCIONE BIEN.
