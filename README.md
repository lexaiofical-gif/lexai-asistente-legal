🏛️ LEXAI - ASISTENTE LEGAL INTELIGENTE

DESCRIPCIÓN:
LEXAI ES UN ASISTENTE LEGAL Y TRIBUTARIO DISEÑADO ESPECÍFICAMENTE PARA PYMES EN COLOMBIA. PERMITE REALIZAR CONSULTAS LEGALES, GENERAR DOCUMENTOS AUTOMÁTICAMENTE, Y ADMINISTRAR USUARIOS DE MANERA SEGURA Y RÁPIDA.

📋 CARACTERÍSTICAS PRINCIPALES
💬 CHATBOT LEGAL INTELIGENTE: RESPUESTAS RÁPIDAS CON REFERENCIAS LEGALES EXACTAS.
📄 GENERACIÓN DE DOCUMENTOS: PLANTILLAS DINÁMICAS Y PERSONALIZABLES.
👥 SISTEMA DE USUARIOS: REGISTRO, LOGIN, ROLES (USER / ADMIN).
🔐 PANEL DE ADMINISTRADOR: GESTIÓN DE USUARIOS, CHATS Y DOCUMENTOS.
🛠️ TECNOLOGÍAS USADAS Y POR QUÉ

BACKEND:

NODE.JS: LENGUAJE ASÍNCRONO Y NO BLOQUEANTE, IDEAL PARA MANEJAR MUCHAS SOLICITUDES RÁPIDAS.
EXPRESS.JS: FRAMEWORK MINIMALISTA PARA DEFINIR RUTAS Y ENDPOINTS.
MONGODB + MONGOOSE: BASE DE DATOS NOSQL FLEXIBLE, RÁPIDA Y FÁCIL DE ESCALAR. MONGOOSE PERMITE DEFINIR MODELOS Y VALIDACIONES.

JWT: AUTENTICACIÓN Y SESIONES SEGURAS.
BCRYPTJS: ENCRIPTACIÓN DE CONTRASEÑAS PARA SEGURIDAD.

FRONTEND:
HTML5 + CSS3 + JAVASCRIPT VANILLA: INTERFAZ INTERACTIVA, SPA FUNCIONAL Y LIGERA.
DECISIÓN DE VANILLA JS: MANTENER EL PROYECTO LIGERO Y DEMOSTRAR DOMINIO DE LOS FUNDAMENTOS DE JAVASCRIPT.

MOTIVO DE USO DE ESTA PILA:
USAR JAVASCRIPT EN TODO EL PROYECTO PERMITE UNA UNIFORMIDAD ("JAVASCRIPT EVERYWHERE"), FÁCIL MANTENIMIENTO Y RAPIDEZ EN DESARROLLO.

📁 ESTRUCTURA DEL PROYECTO
LEXAI-PROYECTO/
├── BACKEND/
│   ├── CONFIG/           # CONEXIÓN A DB Y VARIABLES DE ENTORNO
│   ├── CONTROLLERS/      # LÓGICA DE CHAT, DOCUMENTOS Y AUTH
│   ├── MIDDLEWARE/       # SEGURIDAD (JWT, ROLES)
│   ├── MODELS/           # MODELOS USER, CHATHISTORY, DOCUMENT
│   ├── ROUTES/           # RUTAS API (AUTH, CHAT, DOCUMENTS)
│   └── SERVER.JS         # ARCHIVO PRINCIPAL QUE INICIA EL SERVIDOR
└── FRONTEND/
    ├── INDEX.HTML        # INTERFAZ PRINCIPAL
    ├── STYLES.CSS        # ESTILOS
    └── SCRIPT.JS         # LÓGICA DE FRONTEND Y COMUNICACIÓN CON BACKEND

🚀 INSTALACIÓN

INSTALAR DEPENDENCIAS DEL BACKEND:


INICIAR BACKEND:
npm start


INICIAR FRONTEND:
npx http-server -p 3000 -c-1


URLs DE USO:

FRONTEND: http://localhost:3000

BACKEND API: http://localhost:5000

🔐 SEGURIDAD

JWT PARA AUTENTICACIÓN Y SESIONES.

BCRYPTJS PARA ENCRIPTAR CONTRASEÑAS.

MIDDLEWARE PROTECT Y AUTHORIZE PARA RUTAS SENSIBLES Y ROLES.

CADA USUARIO SOLO ACCEDE A SU INFORMACIÓN (userId EN CHATS Y DOCUMENTOS).

🏗️ ARQUITECTURA

MVC (MODELO-VISTA-CONTROLADOR):

MODELOS: ESTRUCTURA DE DATOS (MONGOOSE)

CONTROLADORES: LÓGICA DE NEGOCIO

VISTA: FRONTEND (HTML/CSS/JS)

MODELO DE DATOS: 1 USUARIO → N CHATS / N DOCUMENTOS.

📖 FUNCIONAMIENTO PRINCIPAL

USUARIO INTERACTÚA EN EL FRONTEND.

SCRIPT.JS ENVÍA PETICIONES AL BACKEND (/API/AUTH, /API/CHAT, /API/DOCUMENTS).

EL BACKEND PROCESA LA SOLICITUD USANDO LOS CONTROLLERS Y ACCEDE A MONGODB.

LA RESPUESTA SE REGRESA AL FRONTEND Y SE ACTUALIZA LA INTERFAZ.

❓ PREGUNTAS 

1. ¿POR QUÉ USÓ JAVASCRIPT (NODE.JS) PARA TODO EL PROYECTO?
UNIFORMIDAD: MISMO LENGUAJE EN FRONTEND Y BACKEND.
NODE.JS ES ASÍNCRONO Y NO BLOQUEANTE, IDEAL PARA CHATBOT Y CONSULTAS RÁPIDAS.

2. ¿POR QUÉ VANILLA JS EN LUGAR DE REACT O VUE?
PROYECTO LIGERO, SIN DEPENDENCIAS.
DEMUESTRA DOMINIO DE FUNDAMENTOS Y CONSTRUCCIÓN DE SPA.

3. FUNCIONES DE EXPRESS Y MONGOOSE:
EXPRESS: DEFINE RUTAS Y ENDPOINTS DE LA API.
MONGOOSE: MODELADO DE DATOS Y VALIDACIONES PARA MONGODB.

4. ¿POR QUÉ MONGODB Y NO SQL?
DATOS FLEXIBLES (CHATS, DOCUMENTOS).
RELACIÓN 1:N SIMPLE, RÁPIDO Y FÁCIL DE CONFIGURAR.

5. ¿CÓMO SE CONECTA LA BASE DE DATOS?
CENTRALIZADA EN database.js. LEE MONGODB_URI DE .ENV Y SE EJECUTA EN server.js.

7. PATRÓN ARQUITECTÓNICO USADO:
MVC PARA SEPARACIÓN DE RESPONSABILIDADES: MODELOS → CONTROLADORES → FRONTEND.

7. SEGURIDAD Y SESIONES:
JWT + BCRYPTJS.
Middleware PROTECT Y AUTHORIZE.
TOKEN GUARDADO EN LOCALSTORAGE Y ENVIADO EN CADA PETICIÓN.

LO Q AHI EN CADA CARPETA  
(Carpeta frontend)
📁index.html → Define todas las vistas y formularios de la SPA.
Se puede editar: estructura de vistas, formularios, IDs, textos, botones.
📁styles.css → Controla la apariencia visual del sistema.
Se puede editar: colores, tipografías, tamaños, disposición de elementos, animaciones.
📁script.js → Controla la interacción, navegación, conexión con la API, autenticación y roles.
Se puede editar: lógica de envío de datos, validaciones, manejo de tokens, interacción de usuario, panel Admin.

⚙️ BACKEND (Carpeta backend)

📁server.js → Inicia servidor Express, configura middlewares y monta rutas.
Se puede editar: puerto, middlewares globales, endpoints importados, configuración del servidor.

📁.env → Variables de entorno como MONGODB_URI, JWT_SECRET, JWT_EXPIRE.
Se puede editar: URL de la base de datos, claves secretas, expiración de tokens, configuración de producción o desarrollo.

📁config/database.js → Función connectDB que conecta MongoDB usando Mongoose.
Se puede editar: lógica de conexión, opciones de Mongoose, manejo de errores de conexión.

📁models/User.js → Esquema de usuario (nombre, email, contraseña, roles).
Se puede editar: campos del usuario, validaciones, roles permitidos.

📁models/ChatHistory.js → Esquema de historial de chats vinculado a usuario.
Se puede editar: campos de chat, referencias legales, timestamps.

📁models/Document.js → Esquema de documentos generados vinculado a usuario.
Se puede editar: campos del documento, tipos de documento, formato de almacenamiento.

📁middleware/authMiddleware.js → Funciones protect y authorize para seguridad y roles.
Se puede editar: reglas de acceso, roles permitidos, validación de tokens.

📁routes/authRoutes.js → Endpoints de autenticación (login, CRUD Admin).
Se puede editar: rutas de login, registro, endpoints para roles administrativos.

📁routes/chatRoutes.js → Endpoints del chatbot.
Se puede editar: rutas de consulta de chat, filtros o lógica de búsqueda de keywords.

📁routes/documentRoutes.js → Endpoints de generación y gestión de documentos.
Se puede editar: rutas para crear, descargar, listar documentos.

📁controllers/authController.js → Lógica de login, registro y JWT.
Se puede editar: generación de tokens, validación de credenciales, lógica de administración.

📁controllers/chatController.js → Lógica del chatbot.
Se puede editar: cómo se buscan respuestas, manejo de keywords, referencias legales.

📁controllers/documentController.js → Lógica de generación de documentos.
Se puede editar: plantillas, inyección de datos, formato final del documento.

🎯 VENTAJAS DEL PROYECTO

SOLUCIÓN REAL PARA PYMES QUE NO TIENEN ASESORÍA LEGAL.
RESPUESTAS RÁPIDAS, REFERENCIAS LEGALES PRECISAS.
GENERACIÓN AUTOMÁTICA DE DOCUMENTOS PERSONALIZABLES.
ESCALABLE: MVC + API RESTFUL + MONGODB.
INTERFAZ MODERNA Y LIGERA.

👨‍💻 AUTOR

DAMIAN G.
https://lexai-asistente-legal.vercel.app/# 

📝 LICENCIA

SUPER DAMIAN 1.1
