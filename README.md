# 🏛️ LexAI - Asistente Legal Inteligente

Asistente legal y tributario inteligente diseñado específicamente para PYMES en Colombia.

## 📋 Características

- 💬 Chatbot Legal Inteligente
- 📄 Generación de Documentos
- 👥 Sistema de Usuarios
- 🔐 Panel de Administrador

## 🛠️ Tecnologías

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT

### Frontend
- HTML5
- CSS3
- JavaScript Vanilla

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/TuUsuario/lexai-asistente-legal.git
cd lexai-asistente-legal
```

### 2. Instalar dependencias del backend
```bash
cd backend
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la carpeta `backend`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lexai
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRE=7d
NODE_ENV=development
```

### 4. Crear usuario administrador
```bash
node createAdmin.js
```

### 5. Iniciar el servidor backend
```bash
npm start
```

### 6. Iniciar el frontend
```bash
cd ../frontend
npx http-server -p 3000 -c-1
```

## 📖 Uso

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

### Credenciales Admin por defecto:
- **Email:** admin@lexai.co
- **Password:** admin123

## 📁 Estructura del Proyecto
```
lexai-proyecto/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── index.html
    ├── styles.css
    └── script.js
```

## 📝 Licencia

MIT License

## 👨‍💻 Autor

DAMIAN
