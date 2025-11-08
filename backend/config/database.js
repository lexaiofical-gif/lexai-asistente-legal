//ENLACE VITAL PARA Q BAKEND HABLE CON LA BASE DE DATOS ES COMO DECIR UN CABLE Q UNE LA APLICACION CON LOS DATOS ALMACENADOS

const mongoose = require('mongoose');   //IMPORTA A MONGOSE PARA INTERACTUAR CON MONGODB
//FUNCION CENTRAL LA Q INICIA LA CONEXION A LA BASE DE DATOS
const connectDB = async () => {
    try {
                           //USO SECRETO SE CONECTA A LA DB LEYENDO LA DIRECCIONSECRETA DE .env
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // MENSAJE DE EXITO DE CONEXION EXITOSA EN LA CONSOLA
        console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};
//PERMITE Q SERVER.JS USE ESTA FUNCION DE CONEXION
module.exports = connectDB;
