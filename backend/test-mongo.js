require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conexión a MongoDB Atlas exitosa!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  });
