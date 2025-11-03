const Document = require('../models/Document');

// Plantillas de documentos
const docTemplates = {
    'contrato': {
        name: 'Contrato de Prestación de Servicios',
        fields: [
            { id: 'contratante_nombre', label: 'Nombre del Contratante', type: 'text' },
            { id: 'contratante_cc', label: 'CC Contratante', type: 'text' },
            { id: 'contratista_nombre', label: 'Nombre del Contratista', type: 'text' },
            { id: 'contratista_cc', label: 'CC Contratista', type: 'text' },
            { id: 'objeto', label: 'Objeto del Contrato', type: 'textarea' },
            { id: 'valor', label: 'Valor del Contrato', type: 'text' },
            { id: 'plazo', label: 'Plazo de Ejecución', type: 'text' },
            { id: 'ciudad', label: 'Ciudad', type: 'text' }
        ],
        generator: (data) => {
            return `
═══════════════════════════════════════════════════════════════
                CONTRATO DE PRESTACIÓN DE SERVICIOS
═══════════════════════════════════════════════════════════════

Entre los suscritos a saber: ${data.contratante_nombre}, identificado(a) con 
C.C. ${data.contratante_cc}, quien en adelante se denominará EL CONTRATANTE, 
y ${data.contratista_nombre}, identificado(a) con C.C. ${data.contratista_cc}, 
quien en adelante se denominará EL CONTRATISTA, se ha convenido celebrar el 
presente contrato de prestación de servicios, el cual se regirá por las 
siguientes cláusulas:

───────────────────────────────────────────────────────────────
CLÁUSULA PRIMERA - OBJETO DEL CONTRATO
───────────────────────────────────────────────────────────────

El objeto del presente contrato es: ${data.objeto}

───────────────────────────────────────────────────────────────
CLÁUSULA SEGUNDA - VALOR Y FORMA DE PAGO
───────────────────────────────────────────────────────────────

El valor total del presente contrato es de ${data.valor} pesos colombianos 
($${data.valor}), que serán pagados según las condiciones acordadas entre 
las partes.

───────────────────────────────────────────────────────────────
CLÁUSULA TERCERA - PLAZO DE EJECUCIÓN
───────────────────────────────────────────────────────────────

El plazo de ejecución del presente contrato será de ${data.plazo}, contados 
a partir de la firma del presente documento o según lo acordado entre las 
partes.

───────────────────────────────────────────────────────────────
CLÁUSULA CUARTA - OBLIGACIONES DEL CONTRATISTA
───────────────────────────────────────────────────────────────

EL CONTRATISTA se obliga a:
1. Cumplir con el objeto del contrato con la debida diligencia y 
   profesionalismo.
2. Realizar las actividades dentro del plazo establecido.
3. Mantener comunicación constante con EL CONTRATANTE sobre el avance 
   de las actividades.
4. Responder por la calidad del servicio prestado.

───────────────────────────────────────────────────────────────
CLÁUSULA QUINTA - OBLIGACIONES DEL CONTRATANTE
───────────────────────────────────────────────────────────────

EL CONTRATANTE se obliga a:
1. Realizar el pago del valor acordado en los plazos establecidos.
2. Proporcionar la información necesaria para la ejecución del contrato.
3. Colaborar con EL CONTRATISTA en lo necesario para el desarrollo del 
   objeto contractual.

───────────────────────────────────────────────────────────────
CLÁUSULA SEXTA - INDEPENDENCIA Y AUTONOMÍA
───────────────────────────────────────────────────────────────

EL CONTRATISTA actuará con autonomía técnica y directiva en la ejecución 
del objeto contractual, sin que exista subordinación laboral con EL 
CONTRATANTE. Este contrato es de naturaleza civil/comercial y no genera 
relación laboral alguna.

───────────────────────────────────────────────────────────────
CLÁUSULA SÉPTIMA - LEGISLACIÓN APLICABLE
───────────────────────────────────────────────────────────────

El presente contrato se rige por las disposiciones del Código Civil y el 
Código de Comercio colombianos en todo lo no previsto en este documento.

───────────────────────────────────────────────────────────────

Para constancia, se firma en ${data.ciudad}, a los ___ días del mes de 
_______ del año _____.


_________________________                    _________________________
EL CONTRATANTE                              EL CONTRATISTA
${data.contratante_nombre}                  ${data.contratista_nombre}
C.C. ${data.contratante_cc}                 C.C. ${data.contratista_cc}


═══════════════════════════════════════════════════════════════
              Generado por LexAI - Asistente Legal
═══════════════════════════════════════════════════════════════
`;
        }
    },
    'certificado': {
        name: 'Certificado Laboral',
        fields: [
            { id: 'empresa_nombre', label: 'Nombre de la Empresa', type: 'text' },
            { id: 'empresa_nit', label: 'NIT Empresa', type: 'text' },
            { id: 'empleado_nombre', label: 'Nombre del Empleado', type: 'text' },
            { id: 'empleado_cc', label: 'CC Empleado', type: 'text' },
            { id: 'cargo', label: 'Cargo', type: 'text' },
            { id: 'fecha_ingreso', label: 'Fecha de Ingreso', type: 'date' },
            { id: 'fecha_retiro', label: 'Fecha de Retiro (opcional)', type: 'date' },
            { id: 'salario', label: 'Salario Actual/Final', type: 'text' },
            { id: 'ciudad', label: 'Ciudad', type: 'text' }
        ],
        generator: (data) => {
            const estadoLaboral = data.fecha_retiro ? 
                `desde el ${data.fecha_ingreso} hasta el ${data.fecha_retiro}` : 
                `desde el ${data.fecha_ingreso} y continúa laborando hasta la fecha`;
            
            return `
═══════════════════════════════════════════════════════════════
                       CERTIFICADO LABORAL
═══════════════════════════════════════════════════════════════

${data.empresa_nombre}
NIT: ${data.empresa_nit}

LA SUSCRITA REPRESENTANTE LEGAL DE ${data.empresa_nombre.toUpperCase()}

───────────────────────────────────────────────────────────────
CERTIFICA QUE:
───────────────────────────────────────────────────────────────

${data.empleado_nombre}, identificado(a) con cédula de ciudadanía 
No. ${data.empleado_cc}, labora/laboró en nuestra empresa ${estadoLaboral}.

CARGO DESEMPEÑADO: ${data.cargo}

Durante su vinculación con la empresa, el(la) trabajador(a) devengó un 
salario de ${data.salario} pesos mensuales ($${data.salario}).

El(la) trabajador(a) se desempeñó con responsabilidad, honestidad y 
dedicación en las funciones asignadas a su cargo, cumpliendo a cabalidad 
con las obligaciones contractuales y demostrando compromiso con la 
organización.

───────────────────────────────────────────────────────────────

La presente certificación se expide a solicitud del interesado(a) en la 
ciudad de ${data.ciudad}, a los ___ días del mes de _______ del año _____.

Cordialmente,


_________________________
Representante Legal
${data.empresa_nombre}
NIT: ${data.empresa_nit}


═══════════════════════════════════════════════════════════════
              Generado por LexAI - Asistente Legal
═══════════════════════════════════════════════════════════════
`;
        }
    },
    'carta': {
        name: 'Carta de Renuncia',
        fields: [
            { id: 'empleado_nombre', label: 'Su Nombre Completo', type: 'text' },
            { id: 'empleado_cc', label: 'Su Cédula', type: 'text' },
            { id: 'cargo', label: 'Su Cargo', type: 'text' },
            { id: 'empresa_nombre', label: 'Nombre de la Empresa', type: 'text' },
            { id: 'destinatario', label: 'Destinatario (Jefe/RRHH)', type: 'text' },
            { id: 'fecha_retiro', label: 'Fecha de Retiro', type: 'date' },
            { id: 'ciudad', label: 'Ciudad', type: 'text' }
        ],
        generator: (data) => {
            return `
═══════════════════════════════════════════════════════════════
                        CARTA DE RENUNCIA
═══════════════════════════════════════════════════════════════

${data.ciudad}, ___ de _______ de _____

Señor(a)
${data.destinatario}
${data.empresa_nombre}
Ciudad

Respetado(a) señor(a):

───────────────────────────────────────────────────────────────

Por medio de la presente, yo ${data.empleado_nombre}, identificado(a) con 
cédula de ciudadanía No. ${data.empleado_cc}, quien actualmente me 
desempeño como ${data.cargo} en ${data.empresa_nombre}, presento mi 
RENUNCIA VOLUNTARIA E IRREVOCABLE al cargo que ocupo.

La fecha efectiva de mi retiro será el ${data.fecha_retiro}, dando 
cumplimiento al preaviso establecido por la ley y el reglamento interno 
de trabajo.

Agradezco profundamente la oportunidad brindada para formar parte de 
esta organización y el apoyo recibido durante mi tiempo de servicio. 
Ha sido una experiencia enriquecedora tanto a nivel profesional como 
personal.

Me comprometo a realizar una adecuada entrega del cargo, garantizando 
la continuidad de las funciones asignadas y a colaborar en el proceso 
de transición para que mi retiro no afecte el normal desarrollo de las 
actividades de la empresa.

Quedo atento(a) a los trámites administrativos correspondientes para la 
liquidación y paz y salvo respectivos, así como a cualquier procedimiento 
adicional que deba cumplir.

Reitero mis agradecimientos y les deseo muchos éxitos en sus proyectos 
futuros.

Cordialmente,


_________________________
${data.empleado_nombre}
C.C. ${data.empleado_cc}
Cargo: ${data.cargo}


═══════════════════════════════════════════════════════════════
              Generado por LexAI - Asistente Legal
═══════════════════════════════════════════════════════════════
`;
        }
    }
};

// @desc    Generar documento
// @route   POST /api/documents/generate
// @access  Private
exports.generateDocument = async (req, res) => {
    try {
        const { templateType, data } = req.body;

        if (!templateType || !docTemplates[templateType]) {
            return res.status(400).json({
                success: false,
                message: 'Tipo de documento inválido'
            });
        }

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Datos del documento requeridos'
            });
        }

        const template = docTemplates[templateType];
        const content = template.generator(data);

        // Guardar documento en la base de datos
        const document = await Document.create({
            userId: req.user._id,
            type: template.name,
            content: content
        });

        res.status(201).json({
            success: true,
            data: {
                id: document._id,
                type: document.type,
                content: document.content,
                timestamp: document.timestamp
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al generar el documento',
            error: error.message
        });
    }
};

// @desc    Obtener plantillas disponibles
// @route   GET /api/documents/templates
// @access  Private
exports.getTemplates = async (req, res) => {
    try {
        const templates = Object.keys(docTemplates).map(key => ({
            id: key,
            name: docTemplates[key].name,
            fields: docTemplates[key].fields
        }));

        res.status(200).json({
            success: true,
            data: templates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las plantillas',
            error: error.message
        });
    }
};

// @desc    Obtener documentos del usuario
// @route   GET /api/documents/my-documents
// @access  Private
exports.getUserDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los documentos',
            error: error.message
        });
    }
};

// @desc    Obtener un documento específico
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Documento no encontrado'
            });
        }

        // Verificar que el documento pertenezca al usuario o sea admin
        if (document.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para acceder a este documento'
            });
        }

        res.status(200).json({
            success: true,
            data: document
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el documento',
            error: error.message
        });
    }
};

// @desc    Eliminar documento
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({
                success: false,
                message: 'Documento no encontrado'
            });
        }

        // Verificar que el documento pertenezca al usuario
        if (document.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'No autorizado para eliminar este documento'
            });
        }

        await document.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Documento eliminado correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el documento',
            error: error.message
        });
    }
};