// Configurações globais
const API_BASE_URL = '';

// Estado global
let currentUser = null;
let currentFilter = 'todos';

// Utilitários
function showError(message, elementId = 'loginError') {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    } else {
        // Criar elemento de erro temporário
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(220, 53, 69, 0.2);
            border: 1px solid #dc3545;
            color: #ff6b6b;
            padding: 1rem;
            border-radius: 5px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (document.body.contains(errorDiv)) {
                document.body.removeChild(errorDiv);
            }
        }, 5000);
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(40, 167, 69, 0.2);
        border: 1px solid #28a745;
        color: #4caf50;
        padding: 1rem;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(successDiv);

    setTimeout(() => {
        if (document.body.contains(successDiv)) {
            document.body.removeChild(successDiv);
        }
    }, 3000);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
}

// Criar estrelas no fundo
function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}

// Sistema de Login
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            showError('Por favor, preencha todos os campos!');
            return;
        }

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('currentUser', JSON.stringify(data));
                window.location.href = 'dashboard.html';
            } else {
                showError(data.error || 'Erro ao fazer login');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        }
    });

    createStars();
}

// Sistema do Dashboard
if (document.getElementById('userName')) {
    // Verificar se o usuário está logado
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'index.html';
        //return;
    }

    // Configurar permissões visuais
    document.body.className += ` ${currentUser.role}`;

    // Exibir nome do usuário
    document.getElementById('userName').textContent = currentUser.name;

    // Navegação entre seções
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionName = this.dataset.section;

            // Atualizar botões ativos
            navButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Mostrar seção correspondente
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(`${sectionName}-section`).classList.add('active');

            // Carregar dados da seção
            loadSectionData(sectionName);
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Filtros de estatísticas
    const statCards = document.querySelectorAll('.stat-card.clickable');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const filter = this.dataset.filter;
            applyResourceFilter(filter);
        });
    });

    // Limpar filtro
    document.getElementById('clearFilter').addEventListener('click', function() {
        applyResourceFilter('todos');
    });

    // Função para aplicar filtro de recursos
    function applyResourceFilter(filter) {
        currentFilter = filter;

        // Atualizar cards ativos
        statCards.forEach(card => {
            card.classList.toggle('active', card.dataset.filter === filter);
        });

        // Atualizar título
        const titles = {
            'todos': 'Todos os Recursos',
            'equipamento': 'Equipamentos',
            'veiculo': 'Veículos',
            'dispositivo': 'Dispositivos'
        };

        document.getElementById('filterTitle').textContent = titles[filter];
        document.getElementById('clearFilter').style.display = filter === 'todos' ? 'none' : 'inline-flex';

        // Carregar recursos filtrados
        loadFilteredRecursos(filter);
    }

    // Carregar recursos filtrados
    async function loadFilteredRecursos(filter) {
        try {
            const url = filter === 'todos' ? '/api/recursos' : `/api/recursos?tipo=${filter}`;
            const response = await fetch(url);
            const recursos = await response.json();

            if (response.ok) {
                displayFilteredRecursos(recursos);
            }
        } catch (error) {
            console.error('Erro ao carregar recursos filtrados:', error);
        }
    }

    // Exibir recursos filtrados
    function displayFilteredRecursos(recursos) {
        const container = document.getElementById('filteredRecursos');

        if (recursos.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #ccc; padding: 2rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Nenhum recurso encontrado para este filtro.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = recursos.map(recurso => `
            <div class="resource-card">
                <div class="resource-header">
                    <div>
                        <div class="resource-title">${recurso.nome}</div>
                        <div class="resource-status">Status: ${recurso.status}</div>
                    </div>
                    <div class="resource-type">${recurso.tipo}</div>
                </div>
                ${recurso.descricao ? `<div class="resource-description">${recurso.descricao}</div>` : ''}
            </div>
        `).join('');
    }

    // Carregar dados da seção
    function loadSectionData(sectionName) {
        switch(sectionName) {
            case 'dashboard':
                loadStats();
                loadFilteredRecursos(currentFilter);
                break;
            case 'recursos':
                loadRecursos();
                break;
            case 'usuarios':
                if (currentUser.role === 'admin') {
                    loadUsers();
                }
                break;
            case 'logs':
                if (currentUser.role === 'admin' || currentUser.role === 'gerente') {
                    loadEntryExitLogs();
                    loadAccessLogs();
                    loadUsersForLogs();
                    loadVehiclesForLogs();
                }
                break;
            case 'inventario':
                if (currentUser.role === 'admin') {
                    loadInventory();
                }
                break;
        }
    }

    // === RECURSOS ===

    // Controle do formulário de recursos
    const addResourceBtn = document.getElementById('addResourceBtn');
    const addResourceForm = document.getElementById('addResourceForm');
    const cancelBtn = document.getElementById('cancelBtn');
    const resourceForm = document.getElementById('resourceForm');

    if (addResourceBtn) {
        addResourceBtn.addEventListener('click', function() {
            showResourceForm();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            hideResourceForm();
        });
    }

    function showResourceForm(isEdit = false, recurso = null) {
        addResourceForm.classList.remove('hidden');
        addResourceBtn.style.display = 'none';

        if (isEdit && recurso) {
            document.getElementById('formTitle').textContent = 'Editar Recurso';
            document.getElementById('submitBtnText').textContent = 'Atualizar';
            document.getElementById('editingId').value = recurso.id;
            document.getElementById('nome').value = recurso.nome;
            document.getElementById('tipo').value = recurso.tipo;
            document.getElementById('status').value = recurso.status;
            document.getElementById('descricao').value = recurso.descricao || '';
        } else {
            document.getElementById('formTitle').textContent = 'Adicionar Novo Recurso';
            document.getElementById('submitBtnText').textContent = 'Salvar';
            document.getElementById('editingId').value = '';
            resourceForm.reset();
        }
    }

    function hideResourceForm() {
        addResourceForm.classList.add('hidden');
        addResourceBtn.style.display = 'inline-flex';
        resourceForm.reset();
        document.getElementById('editingId').value = '';
    }

    // Submissão do formulário de recurso
    if (resourceForm) {
        resourceForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const editingId = document.getElementById('editingId').value;
            const formData = {
                nome: document.getElementById('nome').value.trim(),
                tipo: document.getElementById('tipo').value,
                status: document.getElementById('status').value.trim(),
                descricao: document.getElementById('descricao').value.trim()
            };

            if (!formData.nome || !formData.tipo || !formData.status) {
                showError('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            try {
                const url = editingId ? `/api/recursos/${editingId}` : '/api/recursos';
                const method = editingId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showSuccess(editingId ? 'Recurso atualizado com sucesso!' : 'Recurso adicionado com sucesso!');
                    hideResourceForm();
                    loadRecursos();
                    loadStats();
                    loadFilteredRecursos(currentFilter);
                } else {
                    showError(data.error || 'Erro ao salvar recurso');
                }
            } catch (error) {
                console.error('Erro ao salvar recurso:', error);
                showError('Erro de conexão. Verifique se o servidor está rodando.');
            }
        });
    }

    // Carregar recursos
    async function loadRecursos() {
        try {
            const response = await fetch('/api/recursos');
            const recursos = await response.json();

            if (response.ok) {
                displayRecursos(recursos);
            } else {
                showError('Erro ao carregar recursos');
            }
        } catch (error) {
            console.error('Erro ao carregar recursos:', error);
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        }
    }

    // Exibir recursos
    function displayRecursos(recursos) {
        const recursosContainer = document.getElementById('recursos');

        if (recursos.length === 0) {
            recursosContainer.innerHTML = `
                <div style="text-align: center; color: #ccc; padding: 2rem;">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Nenhum recurso cadastrado ainda.</p>
                    <p>Clique em "Adicionar Recurso" para começar.</p>
                </div>
            `;
            return;
        }

        recursosContainer.innerHTML = recursos.map(recurso => `
            <div class="resource-card">
                <div class="resource-header">
                    <div>
                        <div class="resource-title">${recurso.nome}</div>
                        <div class="resource-status">Status: ${recurso.status}</div>
                    </div>
                    <div class="resource-type">${recurso.tipo}</div>
                </div>

                ${recurso.descricao ? `<div class="resource-description">${recurso.descricao}</div>` : ''}

                <div class="resource-actions">
                    ${currentUser.role === 'admin' || currentUser.role === 'gerente' ? `
                        <button class="edit-btn" onclick="editRecurso(${recurso.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                    ` : ''}
                    ${currentUser.role === 'admin' ? `
                        <button class="delete-btn" onclick="deleteRecurso(${recurso.id})">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Função global para editar recurso
    window.editRecurso = async function(id) {
        try {
            const response = await fetch('/api/recursos');
            const recursos = await response.json();
            const recurso = recursos.find(r => r.id === id);

            if (recurso) {
                showResourceForm(true, recurso);
            }
        } catch (error) {
            console.error('Erro ao carregar recurso para edição:', error);
            showError('Erro ao carregar dados do recurso');
        }
    };

    // Função global para deletar recurso
    window.deleteRecurso = async function(id) {
        if (!confirm('Tem certeza que deseja remover este recurso?')) {
            return;
        }

        try {
            const response = await fetch(`/api/recursos/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Recurso removido com sucesso!');
                loadRecursos();
                loadStats();
                loadFilteredRecursos(currentFilter);
            } else {
                showError(data.error || 'Erro ao remover recurso');
            }
        } catch (error) {
            console.error('Erro ao remover recurso:', error);
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        }
    };

    // === USUÁRIOS ===

    // Controle do formulário de usuários
    const addUserBtn = document.getElementById('addUserBtn');
    const addUserForm = document.getElementById('addUserForm');
    const cancelUserBtn = document.getElementById('cancelUserBtn');
    const userForm = document.getElementById('userForm');

    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            showUserForm();
        });
    }

    if (cancelUserBtn) {
        cancelUserBtn.addEventListener('click', function() {
            hideUserForm();
        });
    }

    function showUserForm(isEdit = false, user = null) {
        addUserForm.classList.remove('hidden');
        addUserBtn.style.display = 'none';

        if (isEdit && user) {
            document.getElementById('userFormTitle').textContent = 'Editar Usuário';
            document.getElementById('userSubmitBtnText').textContent = 'Atualizar';
            document.getElementById('editingUserId').value = user.id;
            document.getElementById('userUsername').value = user.username;
            document.getElementById('userPassword').value = '';
            document.getElementById('userRole').value = user.role;
            document.getElementById('userNameField').value = user.name;
        } else {
            document.getElementById('userFormTitle').textContent = 'Adicionar Novo Usuário';
            document.getElementById('userSubmitBtnText').textContent = 'Salvar';
            document.getElementById('editingUserId').value = '';
            userForm.reset();
        }
    }

    function hideUserForm() {
        addUserForm.classList.add('hidden');
        addUserBtn.style.display = 'inline-flex';
        userForm.reset();
        document.getElementById('editingUserId').value = '';
    }

    // Submissão do formulário de usuário
    if (userForm) {
        userForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const editingId = document.getElementById('editingUserId').value;
            const formData = {
                username: document.getElementById('userUsername').value.trim(),
                password: document.getElementById('userPassword').value.trim(),
                role: document.getElementById('userRole').value,
                name: document.getElementById('userNameField').value.trim()
            };

            if (!formData.username || !formData.role || !formData.name) {
                showError('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            if (!editingId && !formData.password) {
                showError('Senha é obrigatória para novos usuários!');
                return;
            }

            try {
                const url = editingId ? `/api/users/${editingId}` : '/api/users';
                const method = editingId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showSuccess(editingId ? 'Usuário atualizado com sucesso!' : 'Usuário adicionado com sucesso!');
                    hideUserForm();
                    loadUsers();
                } else {
                    showError(data.error || 'Erro ao salvar usuário');
                }
            } catch (error) {
                console.error('Erro ao salvar usuário:', error);
                showError('Erro de conexão. Verifique se o servidor está rodando.');
            }
        });
    }

    // Carregar usuários
    async function loadUsers() {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            if (response.ok) {
                displayUsers(users);
            } else {
                showError('Erro ao carregar usuários');
            }
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        }
    }

    // Exibir usuários
    function displayUsers(users) {
        const usersContainer = document.getElementById('usuarios');

        if (users.length === 0) {
            usersContainer.innerHTML = `
                <div style="text-align: center; color: #ccc; padding: 2rem;">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Nenhum usuário cadastrado ainda.</p>
                </div>
            `;
            return;
        }

        usersContainer.innerHTML = users.map(user => `
            <div class="resource-card">
                <div class="resource-header">
                    <div>
                        <div class="resource-title">${user.name}</div>
                        <div class="resource-status">@${user.username}</div>
                    </div>
                    <div class="resource-type">${user.role}</div>
                </div>

                <div class="resource-description">
                    Cadastrado em: ${formatDateTime(user.created_at)}
                </div>

                <div class="resource-actions">
                    <button class="edit-btn" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    ${user.id !== currentUser.id ? `
                        <button class="delete-btn" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Função global para editar usuário
    window.editUser = async function(id) {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();
            const user = users.find(u => u.id === id);

            if (user) {
                showUserForm(true, user);
            }
        } catch (error) {
            console.error('Erro ao carregar usuário para edição:', error);
            showError('Erro ao carregar dados do usuário');
        }
    };

    // Função global para deletar usuário
    window.deleteUser = async function(id) {
        if (!confirm('Tem certeza que deseja remover este usuário?')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Usuário removido com sucesso!');
                loadUsers();
            } else {
                showError(data.error || 'Erro ao remover usuário');
            }
        } catch (error) {
            console.error('Erro ao remover usuário:', error);
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        }
    };

    // === LOGS ===

    // Controle das abas de logs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;

            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            tabContents.forEach(t => t.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });

    // Controle do formulário de entrada/saída
    const addEntryExitBtn = document.getElementById('addEntryExitBtn');
    const addEntryExitForm = document.getElementById('addEntryExitForm');
    const cancelEntryExitBtn = document.getElementById('cancelEntryExitBtn');
    const entryExitForm = document.getElementById('entryExitForm');

    if (addEntryExitBtn) {
        addEntryExitBtn.addEventListener('click', function() {
            addEntryExitForm.classList.remove('hidden');
            addEntryExitBtn.style.display = 'none';
        });
    }

    if (cancelEntryExitBtn) {
        cancelEntryExitBtn.addEventListener('click', function() {
            addEntryExitForm.classList.add('hidden');
            addEntryExitBtn.style.display = 'inline-flex';
            entryExitForm.reset();
        });
    }

    // Submissão do formulário de entrada/saída
    if (entryExitForm) {
        entryExitForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = {
                user_id: document.getElementById('logUserId').value,
                vehicle_id: document.getElementById('logVehicleId').value,
                action: document.getElementById('logAction').value,
                notes: document.getElementById('logNotes').value.trim()
            };

            if (!formData.user_id || !formData.vehicle_id || !formData.action) {
                showError('Por favor, preencha todos os campos obrigatórios!');
                return;
            }

            try {
                const response = await fetch('/api/entry-exit-logs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showSuccess('Log registrado com sucesso!');
                    addEntryExitForm.classList.add('hidden');
                    addEntryExitBtn.style.display = 'inline-flex';
                    entryExitForm.reset();
                    loadEntryExitLogs();
                } else {
                    showError(data.error || 'Erro ao registrar log');
                }
            } catch (error) {
                console.error('Erro ao registrar log:', error);
                showError('Erro de conexão. Verifique se o servidor está rodando.');
            }
        });
    }

    // Carregar usuários para logs
    async function loadUsersForLogs() {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();

            if (response.ok) {
                const select = document.getElementById('logUserId');
                if (select) {
                    select.innerHTML = '<option value="">Selecione o funcionário</option>' +
                        users.map(user => `<option value="${user.id}">${user.name}</option>`).join('');
                }
            }
        } catch (error) {
            console.error('Erro ao carregar usuários para logs:', error);
        }
    }

    // Carregar veículos para logs
    async function loadVehiclesForLogs() {
        try {
            const response = await fetch('/api/recursos?tipo=veiculo');
            const vehicles = await response.json();

            if (response.ok) {
                const select = document.getElementById('logVehicleId');
                if (select) {
                    select.innerHTML = '<option value="">Selecione o veículo</option>' +
                        vehicles.map(vehicle => `<option value="${vehicle.id}">${vehicle.nome}</option>`).join('');
                }
            }
        } catch (error) {
            console.error('Erro ao carregar veículos para logs:', error);
        }
    }

    // Carregar logs de entrada/saída
    async function loadEntryExitLogs() {
        try {
            const response = await fetch('/api/entry-exit-logs');
            const logs = await response.json();

            if (response.ok) {
                displayEntryExitLogs(logs);
            }
        } catch (error) {
            console.error('Erro ao carregar logs de entrada/saída:', error);
        }
    }

    // Exibir logs de entrada/saída
    function displayEntryExitLogs(logs) {
        const container = document.getElementById('entryExitLogs');

        if (logs.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #ccc; padding: 2rem;">
                    <i class="fas fa-clipboard-list" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Nenhum log de entrada/saída registrado ainda.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = logs.map(log => `
            <div class="log-item">
                <div class="log-header">
                    <span class="log-user">${log.user_name || 'Usuário não encontrado'}</span>
                    <span class="log-time">${formatDateTime(log.timestamp)}</span>
                </div>
                <div class="log-action">
                    <i class="fas fa-${log.action === 'entrada' ? 'sign-in-alt' : 'sign-out-alt'}"></i>
                    ${log.action.toUpperCase()}
                </div>
                <div class="log-vehicle">Veículo: ${log.vehicle_name || 'Não especificado'}</div>
                ${log.notes ? `<div class="log-details">${log.notes}</div>` : ''}
            </div>
        `).join('');
    }

    // Carregar logs de acesso
    async function loadAccessLogs() {
        try {
            const response = await fetch('/api/access-logs');
            const logs = await response.json();

            if (response.ok) {
                displayAccessLogs(logs);
            }
        } catch (error) {
            console.error('Erro ao carregar logs de acesso:', error);
        }
    }

    // Exibir logs de acesso
    function displayAccessLogs(logs) {
        const container = document.getElementById('accessLogs');

        if (logs.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; color: #ccc; padding: 2rem;">
                    <i class="fas fa-sign-in-alt" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Nenhum log de acesso registrado ainda.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = logs.map(log => `
            <div class="log-item">
                <div class="log-header">
                    <span class="log-user">${log.user_name || 'Usuário não encontrado'}</span>
                    <span class="log-time">${formatDateTime(log.timestamp)}</span>
                </div>
                <div class="log-action">
                    <i class="fas fa-sign-in-alt"></i>
                    ${log.action}
                </div>
                ${log.details ? `<div class="log-details">${log.details}</div>` : ''}
            </div>
        `).join('');
    }

    // === INVENTÁRIO ===

    // Controle do formulário de inventário
    const addInventoryBtn = document.getElementById('addInventoryBtn');
    const addInventoryForm = document.getElementById('addInventoryForm');
    const cancelInventoryBtn = document.getElementById('cancelInventoryBtn');
    const inventoryForm = document.getElementById('inventoryForm');

    if (addInventoryBtn) {
        addInventoryBtn.addEventListener('click', function() {
            showInventoryForm();
        });
    }

    if (cancelInventoryBtn) {
        cancelInventoryBtn.addEventListener('click', function() {
            hideInventoryForm();
        });
    }

    function showInventoryForm(isEdit = false, item = null) {
        addInventoryForm.classList.remove('hidden');
        addInventoryBtn.style.display = 'none';

        if (isEdit && item) {
            document.getElementById('inventoryFormTitle').textContent = 'Editar Item do Inventário';
            document.getElementById('inventorySubmitBtnText').textContent = 'Atualizar';
            document.getElementById('editingInventoryId').value = item.id;
            document.getElementById('itemName').value = item.item_name;
            document.getElementById('itemCategory').value = item.category;
            document.getElementById('itemQuantity').value = item.quantity;
            document.getElementById('itemMinQuantity').value = item.min_quantity;
            document.getElementById('itemDescription').value = item.description || '';
        } else {
            document.getElementById('inventoryFormTitle').textContent = 'Adicionar Item ao Inventário';
            document.getElementById('inventorySubmitBtnText').textContent = 'Salvar';
            document.getElementById('editingInventoryId').value = '';
            inventoryForm.reset();
        }
    }

    function hideInventoryForm() {
        addInventoryForm.classList.add('hidden');
        addInventoryBtn.style.display = 'inline-flex';
        inventoryForm.reset();
        document.getElementById('editingInventoryId').value = '';
    }

    // Submissão do formulário de inventário
    if (inventoryForm) {
        inventoryForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const editingId = document.getElementById('editingInventoryId').value;
            const formData = {
                item_name: document.getElementById('itemName').value.trim(),
                category: document.getElementById('itemCategory').value,
                quantity: parseInt(document.getElementById('itemQuantity').value),
                min_quantity: parseInt(document.getElementById('itemMinQuantity').value),
                description: document.getElementById('itemDescription').value.trim()
            };

            if (!formData.item_name || !formData.category || formData.quantity < 0 || formData.min_quantity < 0) {
                showError('Por favor, preencha todos os campos obrigatórios corretamente!');
                return;
            }

            try {
                const url = editingId ? `/api/inventory/${editingId}` : '/api/inventory';
                const method = editingId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    showSuccess(editingId ? 'Item atualizado com sucesso!' : 'Item adicionado com sucesso!');
                    hideInventoryForm();
                    loadInventory();
                } else {
                    showError(data.error || 'Erro ao salvar item');
                }
            } catch (error) {
                console.error('Erro ao salvar item:', error);
                showError('Erro de conexão. Verifique se o servidor está rodando.');
            }
        });
    }

    // Carregar inventário
    async function loadInventory() {
        try {
            const response = await fetch('/api/inventory');
            const inventory = await response.json();

            if (response.ok) {
                displayInventory(inventory);
            } else {
                showError('Erro ao carregar inventário');
            }
        } catch (error) {
            console.error('Erro ao carregar inventário:', error);
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        }
    }

    // Exibir inventário
    function displayInventory(inventory) {
        const inventoryContainer = document.getElementById('inventario');

        if (inventory.length === 0) {
            inventoryContainer.innerHTML = `
                <div style="text-align: center; color: #ccc; padding: 2rem;">
                    <i class="fas fa-boxes" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Nenhum item no inventário ainda.</p>
                    <p>Clique em "Adicionar Item" para começar.</p>
                </div>
            `;
            return;
        }

        inventoryContainer.innerHTML = inventory.map(item => {
            const isLowStock = item.quantity <= item.min_quantity;
            return `
                <div class="inventory-item ${isLowStock ? 'low-stock' : ''}">
                    ${isLowStock ? '<div class="low-stock-badge">Estoque Baixo</div>' : ''}
                    <div class="inventory-header">
                        <div>
                            <div class="inventory-name">${item.item_name}</div>
                            <div class="inventory-category">${item.category}</div>
                        </div>
                    </div>

                    <div class="inventory-quantity">
                        <span class="quantity-current">Quantidade: ${item.quantity}</span>
                        <span class="quantity-min">Mín: ${item.min_quantity}</span>
                    </div>

                    ${item.description ? `<div class="inventory-description">${item.description}</div>` : ''}

                    <div class="inventory-actions">
                        <button class="edit-btn" onclick="editInventoryItem(${item.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="delete-btn" onclick="deleteInventoryItem(${item.id})">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Função global para editar item do inventário
    window.editInventoryItem = async function(id) {
        try {
            const response = await fetch('/api/inventory');
            const inventory = await response.json();
            const item = inventory.find(i => i.id === id);

            if (item) {
                showInventoryForm(true, item);
            }
        } catch (error) {
            console.error('Erro ao carregar item para edição:', error);
            showError('Erro ao carregar dados do item');
        }
    };

    // Função global para deletar item do inventário
    window.deleteInventoryItem = async function(id) {
        if (!confirm('Tem certeza que deseja remover este item do inventário?')) {
            return;
        }

        try {
            const response = await fetch(`/api/inventory/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                showSuccess('Item removido com sucesso!');
                loadInventory();
            } else {
                showError(data.error || 'Erro ao remover item');
            }
        } catch (error) {
            console.error('Erro ao remover item:', error);
            showError('Erro de conexão. Verifique se o servidor está rodando.');
        }
    };

    // === ESTATÍSTICAS ===

    // Carregar estatísticas
    async function loadStats() {
        try {
            const response = await fetch('/api/stats');
            const stats = await response.json();

            if (response.ok) {
                document.getElementById('totalRecursos').textContent = stats.total_recursos || 0;

                // Resetar contadores
                document.getElementById('totalEquipamentos').textContent = '0';
                document.getElementById('totalVeiculos').textContent = '0';
                document.getElementById('totalDispositivos').textContent = '0';

                // Atualizar contadores por tipo
                if (stats.recursos_por_tipo) {
                    stats.recursos_por_tipo.forEach(item => {
                        const elementId = `total${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}s`;
                        const element = document.getElementById(elementId);
                        if (element) {
                            element.textContent = item.count;
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    }

    // Verificar permissões e ocultar elementos se necessário
    function checkPermissions() {
        if (currentUser.role === 'funcionario') {
            // Funcionários só podem visualizar
            if (addResourceBtn) addResourceBtn.style.display = 'none';
        }
    }

    // Inicializar dashboard
    function initDashboard() {
        createStars();
        checkPermissions();
        loadStats();
        loadFilteredRecursos(currentFilter);
    }

    // Executar inicialização
    initDashboard();

    // Atualizar dados a cada 30 segundos
    setInterval(() => {
        loadStats();
        if (document.getElementById('dashboard-section').classList.contains('active')) {
            loadFilteredRecursos(currentFilter);
        }
    }, 30000);
}

// Inicializar estrelas em qualquer página
document.addEventListener('DOMContentLoaded', function() {
    createStars();
});
