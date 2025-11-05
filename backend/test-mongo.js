// test-mongo.js
// Este archivo solo prueba la conexión a MongoDB Atlas
// No altera tu código ni tu base de datos

const mongoose = require('mongoose');

// Reemplaza la URI con la tuya exacta de MongoDB Atlas
const uri = "mongodb+srv://innovationsasoficial_db_user:pPahOlBMd36gkSL4@cluster0.sqiltul.mongodb.net/lexai?appName=Cluster0";

// Intentamos conectar
mongoose.connect(uri)
  .then(() => {
    console.log("✅ Conexión a MongoDB Atlas exitosa!");
    process.exit(0); // Salimos con éxito
  })
  .catch((err) => {
    console.error("❌ Error de conexión:", err.message);
    process.exit(1); // Salimos con error
  });
