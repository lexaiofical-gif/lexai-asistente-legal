const ChatHistory = require('../models/ChatHistory');

// Reglas del chatbot (Base de conocimiento)
const chatRules = [
    { 
        keywords: ["pyme", "pequeña", "mediana", "empresa", "pequena"], 
        response: "Una PYME (Pequeña y Mediana Empresa) en Colombia se clasifica según sus ingresos por actividades ordinarias anuales. Microempresa: hasta 23.563 UVT, Pequeña empresa: entre 23.563 y 204.995 UVT, Mediana empresa: entre 204.995 y 1.736.565 UVT.", 
        reference: "Decreto 957 de 2019, Ley 905 de 2004" 
    },
    { 
        keywords: ["iva", "impuesto valor agregado", "impuesto al valor"], 
        response: "El IVA (Impuesto sobre el Valor Agregado) es un impuesto nacional sobre el consumo. La tarifa general en Colombia es del 19%. Existen tarifas diferenciales del 5% y bienes y servicios excluidos o exentos. Se declara bimestralmente.", 
        reference: "Estatuto Tributario, Art. 420 y ss., Decreto 1625 de 2016" 
    },
    { 
        keywords: ["renta", "impuesto de renta", "impuesto renta"], 
        response: "El impuesto de renta para personas jurídicas (sociedades) en Colombia tiene una tarifa general del 35% para el año gravable 2023. Las personas naturales tributan según su rango de ingresos con tarifas progresivas. Se declara anualmente.", 
        reference: "Estatuto Tributario, Art. 240, Ley 2277 de 2022" 
    },
    { 
        keywords: ["rut", "registro único tributario", "registro unico tributario", "registro tributario"], 
        response: "El RUT (Registro Único Tributario) es el mecanismo para identificar, ubicar y clasificar a los sujetos de obligaciones administradas por la DIAN. Es obligatorio para todas las personas y entidades que realicen actividades económicas en Colombia.", 
        reference: "Decreto 1625 de 2016, Resolución 000012 de 2021 DIAN" 
    },
    { 
        keywords: ["contrato", "prestación", "servicios", "prestacion"], 
        response: "Un contrato de prestación de servicios es de carácter civil o comercial, no laboral. Se pacta para una labor específica, el contratista asume sus propios riesgos y no hay subordinación. No genera prestaciones sociales pero sí debe haber afiliación a seguridad social.", 
        reference: "Código Civil Art. 1495, Código de Comercio, Código Sustantivo del Trabajo" 
    },
    { 
        keywords: ["sas", "sociedad acciones simplificada", "sociedad por acciones simplificada", "sociedad acciones"], 
        response: "La SAS (Sociedad por Acciones Simplificada) es el tipo societario más común en Colombia. Se crea mediante documento privado, puede tener uno o más accionistas, responsabilidad limitada al monto de sus aportes, duración indefinida y gran flexibilidad administrativa.", 
        reference: "Ley 1258 de 2008" 
    },
    { 
        keywords: ["factura", "facturación electrónica", "facturacion electronica", "factura electronica", "facturacion"], 
        response: "La facturación electrónica es obligatoria en Colombia. Debe generarse a través de un proveedor tecnológico autorizado por la DIAN, contener requisitos legales específicos y transmitirse electrónicamente. Sustituye completamente la factura en papel.", 
        reference: "Decreto 358 de 2020, Resolución 000042 de 2020 DIAN" 
    },
    { 
        keywords: ["salario", "salario mínimo", "smlv", "minimo", "salario minimo"], 
        response: "El salario mínimo legal mensual vigente (SMLMV) para 2024 en Colombia es de $1.300.000. El auxilio de transporte para 2024 es de $162.000. Estos valores se ajustan anualmente mediante decreto del gobierno nacional.", 
        reference: "Decreto 2613 de 2023" 
    },
    { 
        keywords: ["liquidación", "liquidacion", "cerrar empresa", "disolver sociedad"], 
        response: "La liquidación de una sociedad implica: cesación de actividades, pago de pasivos, venta de activos, distribución del remanente entre socios. Debe nombrarse liquidador, inscribirse en Cámara de Comercio y cumplir proceso establecido por ley.", 
        reference: "Código de Comercio Art. 218 a 274" 
    },
    { 
        keywords: ["retefuente", "retención en la fuente", "retencion", "retención"], 
        response: "La retención en la fuente es un mecanismo de recaudo anticipado de impuestos. El pagador retiene un porcentaje del pago y lo consigna a la DIAN. Aplica para renta, IVA, industria y comercio. Las tarifas varían según el concepto.", 
        reference: "Estatuto Tributario Art. 365 y ss." 
    },
    { 
        keywords: ["hola", "saludo", "buenos días", "buenas tardes", "buenos dias", "buenas", "hey", "holi"], 
        response: "¡Hola! Soy LexAI, tu asistente legal y tributario. Estoy aquí para ayudarte con consultas sobre legislación colombiana, especialmente en temas tributarios y comerciales para PYMES. ¿En qué puedo asistirte hoy?", 
        reference: "LexAI Asistente" 
    },
    { 
        keywords: ["gracias", "muchas gracias", "excelente", "perfecto", "bien"], 
        response: "¡Con gusto! Estoy aquí para ayudarte. Si tienes más preguntas sobre temas legales o tributarios en Colombia, no dudes en consultarme.", 
        reference: "LexAI Asistente" 
    }
];

// @desc    Procesar consulta de chatbot
// @route   POST /api/chat/query
// @access  Private
exports.processQuery = async (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Por favor ingrese una consulta'
            });
        }

        const normalizedQuery = query.trim().toLowerCase();
        
        // Buscar respuesta en las reglas
        let botResponse = {
            response: "Lo siento, no pude entender tu consulta específica. Te recomiendo reformular tu pregunta sobre temas como: IVA, Impuesto de Renta, RUT, PYMES, contratos, facturación electrónica, sociedades SAS, salario mínimo, retención en la fuente o liquidación de empresas. ¿Puedo ayudarte con alguno de estos temas?",
            reference: "LexAI Asistente"
        };

        for (const rule of chatRules) {
            if (rule.keywords.some(keyword => normalizedQuery.includes(keyword))) {
                botResponse = {
                    response: rule.response,
                    reference: rule.reference
                };
                break;
            }
        }

        // Guardar en el historial
        const chatEntry = await ChatHistory.create({
            userId: req.user._id,
            userEmail: req.user.email,
            query: query.trim(),
            response: botResponse.response,
            reference: botResponse.reference
        });

        res.status(200).json({
            success: true,
            data: {
                query: query.trim(),
                response: botResponse.response,
                reference: botResponse.reference,
                timestamp: chatEntry.timestamp
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al procesar la consulta',
            error: error.message
        });
    }
};

// @desc    Obtener historial de chat del usuario
// @route   GET /api/chat/history
// @access  Private
exports.getUserChatHistory = async (req, res) => {
    try {
        const history = await ChatHistory.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el historial',
            error: error.message
        });
    }
};

// @desc    Obtener todo el historial de chat (solo admin)
// @route   GET /api/chat/history/all
// @access  Private/Admin
exports.getAllChatHistory = async (req, res) => {
    try {
        const history = await ChatHistory.find()
            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .limit(500);

        res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el historial',
            error: error.message
        });
    }
};