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
    },
    // ⚡ NUEVAS REGLAS AÑADIDAS ⚡
    { 
        keywords: ["camara de comercio", "registro mercantil", "matricula mercantil"], 
        response: "Toda empresa o persona natural que realice actividades comerciales en Colombia debe registrarse en la Cámara de Comercio de su jurisdicción. Este registro da existencia legal al negocio y debe renovarse cada año antes del 31 de marzo.", 
        reference: "Código de Comercio, Art. 26 a 33" 
    },
    { 
        keywords: ["seguridad social", "eps", "pensión", "arl", "salud"], 
        response: "Todo contratista independiente en Colombia debe estar afiliado al sistema de seguridad social: EPS (salud), ARL (riesgos laborales) y fondo de pensiones. El pago de aportes se hace mediante la planilla PILA, calculado sobre el 40% del ingreso mensual.", 
        reference: "Ley 100 de 1993, Decreto 1072 de 2015" 
    },
    { 
        keywords: ["niif", "contabilidad", "estados financieros", "normas internacionales"], 
        response: "Las NIIF (Normas Internacionales de Información Financiera) establecen los principios contables para la presentación de estados financieros en Colombia. Las PYMES aplican una versión simplificada conocida como NIIF para PYMES.", 
        reference: "Decreto 2420 de 2015 y sus modificaciones" 
    },
    { 
        keywords: ["dian", "declaracion", "plazo", "impuestos"], 
        response: "La DIAN es la entidad encargada de la administración y control de impuestos nacionales. Los plazos para declarar varían según el tipo de impuesto y el NIT del contribuyente. Es importante revisar el calendario tributario de cada año.", 
        reference: "Resolución 000165 de 2023 DIAN" 
    },
    { 
        keywords: ["empleado", "contrato laboral", "trabajador", "prestaciones sociales"], 
        response: "Un contrato laboral implica subordinación, salario y cumplimiento de horario. El empleador debe pagar prestaciones sociales: cesantías, intereses, prima de servicios, vacaciones y seguridad social. Todo contrato laboral debe formalizarse por escrito.", 
        reference: "Código Sustantivo del Trabajo, Art. 22 a 65" 
    },
    {
    keywords: ["ica", "industria y comercio", "impuesto municipal", "retencion ica"],
    response: "El ICA (Impuesto de Industria y Comercio) es un tributo municipal que grava las actividades comerciales, industriales o de servicios realizadas en una jurisdicción. La tarifa varía según el municipio y la actividad económica.",
    reference: "Decreto 1333 de 1986, Acuerdos Municipales"
    },
     ///////////////////
    {
    keywords: ["regimen simple", "simple tributacion", "rst", "régimen simple de tributación"],
    response: "El Régimen Simple de Tributación (RST) es un sistema alternativo que unifica varios impuestos nacionales y municipales. Facilita el cumplimiento tributario y reduce cargas para pequeños empresarios con ingresos menores a 100.000 UVT anuales.",
    reference: "Ley 1943 de 2018, Ley 2010 de 2019, Estatuto Tributario Art. 903 y ss."
},
{
    keywords: ["firma digital", "firma electronica", "documento electronico", "certificado digital"],
    response: "Las firmas digitales y electrónicas tienen validez jurídica en Colombia siempre que cumplan con los principios de autenticidad e integridad. Se usan para contratos, facturas electrónicas y trámites ante entidades públicas.",
    reference: "Ley 527 de 1999, Decreto 2364 de 2012"
},
{
    keywords: ["derechos de autor", "propiedad intelectual", "marca", "patente", "registro de marca"],
    response: "Los derechos de autor protegen obras literarias, artísticas y de software. Las marcas y patentes se registran ante la Superintendencia de Industria y Comercio (SIC) y otorgan derechos exclusivos de uso al titular.",
    reference: "Ley 23 de 1982, Decisión Andina 351 de 1993"
},
{
    keywords: ["cesantias", "cesantía", "cesantia", "intereses cesantias"],
    response: "Las cesantías equivalen a un mes de salario por cada año trabajado y deben consignarse en un fondo antes del 14 de febrero de cada año. Los intereses sobre cesantías son del 12% anual.",
    reference: "Código Sustantivo del Trabajo, Art. 249 y ss."
},
{
    keywords: ["prima", "prima de servicios", "pago prima", "fechas prima"],
    response: "La prima de servicios se paga dos veces al año: en junio y en diciembre. Corresponde a 15 días de salario por cada semestre trabajado y aplica para todos los trabajadores con contrato laboral.",
    reference: "Código Sustantivo del Trabajo, Art. 306"
},
{
    keywords: ["vacaciones", "descanso remunerado", "dias de vacaciones"],
    response: "Todo trabajador tiene derecho a 15 días hábiles consecutivos de vacaciones por cada año laborado. Pueden ser compensadas parcialmente en dinero con acuerdo entre las partes.",
    reference: "Código Sustantivo del Trabajo, Art. 186"
},
{
    keywords: ["arl", "riesgos laborales", "accidente laboral", "afiliacion arl"],
    response: "La ARL cubre accidentes y enfermedades laborales. Todo trabajador o contratista debe estar afiliado según su nivel de riesgo, que va de clase I a clase V. El aporte lo realiza el empleador o contratante.",
    reference: "Ley 1562 de 2012, Decreto 1072 de 2015"
},
{
    keywords: ["contabilidad", "libros contables", "revisor fiscal", "obligaciones contables"],
    response: "Las empresas deben llevar contabilidad conforme a las NIIF y conservar los libros contables actualizados. Las sociedades por acciones deben tener revisor fiscal si superan los topes de activos o ingresos establecidos por ley.",
    reference: "Código de Comercio, Art. 19 y 207"
},
{
    keywords: ["banco", "cuenta empresarial", "cuenta bancaria", "abrir cuenta"],
    response: "Toda empresa debe tener una cuenta bancaria a nombre de la persona jurídica o natural comerciante. Es obligatoria para facturación, pagos y cumplimiento tributario formal ante la DIAN.",
    reference: "Circular Básica Jurídica Superfinanciera"
},
{
    keywords: ["contratista", "honorarios", "pagos independientes", "planilla pila"],
    response: "Los contratistas deben facturar o expedir cuenta de cobro por sus servicios, pagar su seguridad social mediante la planilla PILA y estar registrados en el RUT si sus ingresos superan los topes establecidos.",
    reference: "Decreto 1072 de 2015, Estatuto Tributario Art. 437"
},
{
    keywords: ["inversion extranjera", "remesa", "transferencia internacional", "repatriacion"],
    response: "La inversión extranjera en Colombia está permitida en la mayoría de sectores. Debe registrarse ante el Banco de la República para garantizar la repatriación de utilidades y el reintegro de capital.",
    reference: "Decreto 2080 de 2000, Resolución Externa 8 de 2000"
},
{
    keywords: ["emprendedor", "crear negocio", "startup", "empresa nueva"],
    response: "Los emprendedores pueden registrar una empresa como persona natural o crear una SAS. Se recomienda iniciar con el RUT, Cámara de Comercio y facturación electrónica. También existen beneficios en programas como iNNpulsa y Fondo Emprender.",
    reference: "Ley 2069 de 2020, Ley 1258 de 2008"
},
{
    keywords: ["licencia de funcionamiento", "uso de suelo", "permiso municipal"],
    response: "Antes de operar un establecimiento de comercio, se debe verificar el uso de suelo ante la Alcaldía y tramitar la licencia de funcionamiento cuando sea requerida según la actividad económica.",
    reference: "Decreto 1879 de 2008, Normas municipales"
},
{
    keywords: ["pension", "jubilacion", "retiro laboral", "colpensiones", "afp"],
    response: "El sistema pensional en Colombia tiene dos regímenes: el público (Colpensiones) y el privado (AFP). Los hombres se pensionan a los 62 años y las mujeres a los 57, con mínimo 1.300 semanas cotizadas.",
    reference: "Ley 100 de 1993, Ley 797 de 2003"
},
{
    keywords: ["contrato confidencialidad", "nda", "acuerdo de confidencialidad"],
    response: "El acuerdo de confidencialidad (NDA) protege información sensible entre partes que colaboran o negocian. Establece las condiciones de uso, protección y sanciones por divulgación indebida.",
    reference: "Código de Comercio, Art. 863 y ss., Ley 1581 de 2012"
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