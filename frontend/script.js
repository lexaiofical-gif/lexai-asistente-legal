// ========================================
// CONFIGURACIÓN Y ESTADO GLOBAL
// ========================================
const API_URL = 'https://lexai-asistente-legal.onrender.com/api';
let state = {
    currentUser: null,
    token: null
};


// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const data = await apiRequest('/auth/login', 'POST', { email, password });
        
        if (data.success) {
            await initializeUserSession(data.token, data.user);
        }
    } catch (error) {
        showError('login-error', error.message);
    }
});






// ========================================
// UTILIDADES
// ========================================
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const view = document.getElementById(viewId);
    if (view) {
        view.classList.remove('hidden');
    }
    
    if (viewId === 'dashboard-view') {
        if (!state.currentUser || !state.token) {
            showView('login-view');
            return;
        }
        updateDashboardUI();
        showDashboardSection('chat-section');
    }
    
    if (viewId === 'admin-view') {
        if (!state.currentUser || state.currentUser.role !== 'admin') {
            showView('dashboard-view');
            return;
        }
        updateAdminUI();
        showAdminSection('admin-users-section');
    }
}

function showDashboardSection(sectionId) {
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Actualizar navegación activa
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.sidebar .nav-link[onclick*="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Cargar datos según la sección
    if (sectionId === 'chat-section') loadChatHistory();
    if (sectionId === 'docs-section') loadUserDocuments();
    if (sectionId === 'profile-section') renderProfile();
}

function showAdminSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Actualizar navegación activa
    document.querySelectorAll('.sidebar .nav-link-admin').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.sidebar .nav-link-admin[onclick*="${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Cargar datos según la sección
    if (sectionId === 'admin-users-section') loadAllUsers();
    if (sectionId === 'admin-chat-section') loadAllChatHistory();
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        setTimeout(() => {
            element.textContent = '';
        }, 5000);
    }
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        setTimeout(() => {
            element.textContent = '';
        }, 5000);
    }
}

// ========================================
// AUTENTICACIÓN
// ========================================
async function apiRequest(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    if (state.token) {
        options.headers['Authorization'] = `Bearer ${state.token}`;
    }
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error en la solicitud');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Registro
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const data = await apiRequest('/auth/register', 'POST', { name, email, password });
        
        if (data.success) {
            // Guardar userId para verificación
            document.getElementById('verify-user-id').value = data.userId;
            
            // Mostrar vista de verificación
            showView('verify-view');
            
            // Mostrar mensaje
            showSuccess('verify-success', 'Código enviado a ' + email);
        }
    } catch (error) {
        showError('register-error', error.message);
    }
});

// Logout
function handleLogout() {
    state.token = null;
    state.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showView('intro-view');
}

// Recuperar contraseña (simulado)
document.getElementById('recover-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('recover-email').value;
    showSuccess('recover-message', `Si el correo ${email} existe, recibirás instrucciones para recuperar tu contraseña.`);
});

// ========================================
// DASHBOARD
// ========================================
function updateDashboardUI() {
    if (!state.currentUser) return;
    
    const adminLink = document.getElementById('admin-link-li');
    if (state.currentUser.role === 'admin') {
        adminLink.classList.remove('hidden');
    } else {
        adminLink.classList.add('hidden');
    }
}

function renderProfile() {
    const user = state.currentUser;
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    
    const roleEl = document.getElementById('profile-role');
    roleEl.textContent = user.role === 'admin' ? 'Administrador' : 'Usuario';
    roleEl.className = 'badge ' + user.role;
    
    const joinedDate = new Date(user.joined).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('profile-joined').textContent = joinedDate;
}
// Cambiar contraseña
document.getElementById('change-password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const messageEl = document.getElementById('password-change-message');
    
    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
        messageEl.textContent = 'Las contraseñas no coinciden';
        messageEl.style.color = 'var(--danger)';
        return;
    }
    
    try {
        const data = await apiRequest('/auth/change-password', 'PUT', {
            currentPassword,
            newPassword
        });
        
        if (data.success) {
            messageEl.textContent = '✅ Contraseña cambiada correctamente. Se ha enviado un email de confirmación.';
            messageEl.style.color = 'var(--success)';
            
            // Limpiar formulario
            document.getElementById('change-password-form').reset();
        }
    } catch (error) {
        messageEl.textContent = '❌ ' + error.message;
        messageEl.style.color = 'var(--danger)';
    }
});

// ========================================
// CHATBOT
// ========================================
async function loadChatHistory() {
    try {
        const data = await apiRequest('/chat/history', 'GET');
        
        const chatHistory = document.getElementById('chat-history');
        chatHistory.innerHTML = `<div class="bot-bubble">Hola ${state.currentUser.name}, soy LexAI. ¿En qué puedo ayudarte hoy sobre la legislación colombiana?</div>`;
        
        if (data.success && data.data) {
            data.data.reverse().forEach(entry => {
                addChatBubble(entry.query, 'user', false);
                addChatBubble(entry.response, 'bot', entry.reference, false);
            });
        }
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

function addChatBubble(text, sender, reference = null, scroll = true) {
    const chatHistory = document.getElementById('chat-history');
    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble');
    
    if (sender === 'user') {
        bubble.classList.add('user-bubble');
        bubble.textContent = text;
    } else {
        bubble.classList.add('bot-bubble');
        bubble.innerHTML = text;
        
        if (reference) {
            const refEl = document.createElement('p');
            refEl.classList.add('bot-reference');
            refEl.textContent = `Referencia: ${reference}`;
            bubble.appendChild(refEl);
        }
    }
    
    chatHistory.appendChild(bubble);
    
    if (scroll) {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}

document.getElementById('chat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const input = document.getElementById('chat-input');
    const query = input.value.trim();
    
    if (!query) return;
    
    addChatBubble(query, 'user');
    input.value = '';
    
    try {
        const data = await apiRequest('/chat/query', 'POST', { query });
        
        if (data.success) {
            setTimeout(() => {
                addChatBubble(data.data.response, 'bot', data.data.reference);
            }, 500);
        }
    } catch (error) {
        addChatBubble('Lo siento, hubo un error al procesar tu consulta. Por favor intenta nuevamente.', 'bot');
    }
});

// Quick replies
document.getElementById('chat-quick-replies').addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-reply-btn')) {
        const query = e.target.dataset.query || e.target.textContent;
        document.getElementById('chat-input').value = query;
        document.getElementById('chat-form').dispatchEvent(new Event('submit'));
    }
});

// ========================================
// DOCUMENTOS
// ========================================
let currentTemplates = {};

async function loadTemplates() {
    try {
        const data = await apiRequest('/documents/templates', 'GET');
        
        if (data.success) {
            data.data.forEach(template => {
                currentTemplates[template.id] = template;
            });
        }
    } catch (error) {
        console.error('Error loading templates:', error);
    }
}

async function loadUserDocuments() {
    try {
        const data = await apiRequest('/documents/my-documents', 'GET');
        
        const tableBody = document.getElementById('doc-history-table');
        tableBody.innerHTML = '';
        
        if (!data.success || data.count === 0) {
            tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #6b7280;">No has generado documentos aún.</td></tr>';
            return;
        }
        
        data.data.forEach(doc => {
            const date = new Date(doc.timestamp).toLocaleString('es-CO');
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.type}</td>
                <td>${date}</td>
                <td>
                    <button onclick="viewDocument('${doc._id}')"><i class="fas fa-eye"></i> Ver</button>
                    <button onclick="downloadDocument('${doc._id}', '${doc.type}')" style="color: var(--success);"><i class="fas fa-download"></i> Descargar</button>
                    <button onclick="deleteDocument('${doc._id}')" class="delete-btn"><i class="fas fa-trash"></i> Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading documents:', error);
    }
}

function showDocGenerator(templateType) {
    const template = currentTemplates[templateType];
    if (!template) return;
    
    document.getElementById('doc-modal-title').textContent = `Generar: ${template.name}`;
    document.getElementById('doc-template-type').value = templateType;
    
    const fieldsContainer = document.getElementById('doc-form-fields');
    fieldsContainer.innerHTML = '';
    
    template.fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        
        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        
        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
            input.rows = 3;
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }
        
        input.id = field.id;
        input.name = field.id;
        input.required = true;
        
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        fieldsContainer.appendChild(formGroup);
    });
    
    document.getElementById('doc-generator-modal').classList.remove('hidden');
}

function closeDocGenerator() {
    document.getElementById('doc-generator-modal').classList.add('hidden');
}

document.getElementById('doc-generator-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const templateType = document.getElementById('doc-template-type').value;
    const template = currentTemplates[templateType];
    
    const formData = {};
    template.fields.forEach(field => {
        formData[field.id] = document.getElementById(field.id).value;
    });
    
    try {
        const data = await apiRequest('/documents/generate', 'POST', {
            templateType,
            data: formData
        });
        
        if (data.success) {
            closeDocGenerator();
            loadUserDocuments();
            
            // Descargar automáticamente
            downloadDocumentContent(data.data.content, `${template.name}.txt`);
        }
    } catch (error) {
        alert('Error al generar el documento: ' + error.message);
    }
});

async function viewDocument(docId) {
    try {
        const data = await apiRequest(`/documents/${docId}`, 'GET');
        
        if (data.success) {
            document.getElementById('doc-viewer-title').textContent = data.data.type;
            document.getElementById('doc-viewer-content').textContent = data.data.content;
            document.getElementById('doc-viewer-modal').classList.remove('hidden');
        }
    } catch (error) {
        alert('Error al cargar el documento: ' + error.message);
    }
}

function closeDocViewer() {
    document.getElementById('doc-viewer-modal').classList.add('hidden');
}

async function downloadDocument(docId, docType) {
    try {
        const data = await apiRequest(`/documents/${docId}`, 'GET');
        
        if (data.success) {
            downloadDocumentContent(data.data.content, `${docType}.txt`);
        }
    } catch (error) {
        alert('Error al descargar el documento: ' + error.message);
    }
}

function downloadDocumentContent(content, filename) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function deleteDocument(docId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) {
        return;
    }
    
    try {
        const data = await apiRequest(`/documents/${docId}`, 'DELETE');
        
        if (data.success) {
            loadUserDocuments();
        }
    } catch (error) {
        alert('Error al eliminar el documento: ' + error.message);
    }
}

// ========================================
// PANEL DE ADMINISTRADOR
// ========================================
function updateAdminUI() {
    loadAllUsers();
}

async function loadAllUsers() {
    try {
        const data = await apiRequest('/auth/users', 'GET');
        
        const tableBody = document.getElementById('admin-users-table');
        tableBody.innerHTML = '';
        
        if (!data.success || data.count === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6b7280;">No hay usuarios registrados.</td></tr>';
            return;
        }
        
        data.users.forEach(user => {
            const isCurrentUser = user._id === state.currentUser.id;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>
                    <select onchange="updateUserRole('${user._id}', this.value)" ${isCurrentUser ? 'disabled' : ''}>
                        <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuario</option>
                        <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </td>
                <td>
                    <button onclick="deleteUser('${user._id}')" class="delete-btn" ${isCurrentUser ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function updateUserRole(userId, newRole) {
    try {
        const data = await apiRequest(`/auth/users/${userId}/role`, 'PUT', { role: newRole });
        
        if (data.success) {
            loadAllUsers();
        }
    } catch (error) {
        alert('Error al actualizar el rol: ' + error.message);
    }
}

async function deleteUser(userId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        return;
    }
    
    try {
        const data = await apiRequest(`/auth/users/${userId}`, 'DELETE');
        
        if (data.success) {
            loadAllUsers();
        }
    } catch (error) {
        alert('Error al eliminar el usuario: ' + error.message);
    }
}

async function loadAllChatHistory() {
    try {
        const data = await apiRequest('/chat/history/all', 'GET');
        
        const tableBody = document.getElementById('admin-chat-table');
        tableBody.innerHTML = '';
        
        if (!data.success || data.count === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #6b7280;">No hay consultas en el historial.</td></tr>';
            return;
        }
        
        data.data.forEach(entry => {
            const userName = entry.userId ? entry.userId.name : 'Usuario eliminado';
            const userEmail = entry.userId ? entry.userId.email : entry.userEmail;
            const date = new Date(entry.timestamp).toLocaleString('es-CO');
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userName} (${userEmail})</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${entry.query}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">${entry.response}</td>
                <td>${date}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading chat history:', error);
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si hay sesión guardada
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
        state.token = savedToken;
        state.currentUser = JSON.parse(savedUser);
        
        // Cargar plantillas inmediatamente
        await loadTemplates();
        
        // Verificar que el token sea válido
        try {
            await apiRequest('/auth/me', 'GET');
            showView('dashboard-view');
        } catch (error) {
            // Token inválido, limpiar y mostrar intro
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.token = null;
            state.currentUser = null;
            showView('intro-view');
        }
    } else {
        showView('intro-view');
    }
});

// Cargar plantillas cuando se inicia sesión o se registra
async function initializeUserSession(token, user) {
    state.token = token;
    state.currentUser = user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    await loadTemplates();
    showView('dashboard-view');
}
// Verificar código
document.getElementById('verify-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('verify-user-id').value;
    const code = document.getElementById('verification-code').value.trim();
    
    if (code.length !== 6) {
        showError('verify-error', 'El código debe tener 6 dígitos');
        return;
    }
    
    try {
        const data = await apiRequest('/auth/verify-code', 'POST', { userId, code });
        
        if (data.success) {
            showSuccess('verify-success', '✅ ¡Cuenta verificada! Redirigiendo...');
            document.getElementById('verification-code').value = '';
            
            setTimeout(async () => {
                await initializeUserSession(data.token, data.user);
            }, 2000);
        }
    } catch (error) {
        showError('verify-error', error.message);
    }
});

// Reenviar código
async function resendVerificationCode() {
    const userId = document.getElementById('verify-user-id').value;
    
    try {
        const data = await apiRequest('/auth/resend-code', 'POST', { userId });
        
        if (data.success) {
            showSuccess('verify-success', '✅ ' + data.message);
            document.getElementById('verification-code').value = '';
        }
    } catch (error) {
        showError('verify-error', error.message);
    }
}