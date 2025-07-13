# 🦇 Batman System - Wayne Industries Security Management v2.0

Sistema de Gerenciamento de Segurança das Indústrias Wayne desenvolvido com tema Batman - **VERSÃO COMPLETA**.

## 📋 Descrição do Projeto

Este é um sistema full stack completo para gerenciamento de recursos de segurança das Indústrias Wayne, incluindo:

### ✨ Funcionalidades Principais
- **Sistema de autenticação** com diferentes níveis de acesso
- **Gestão completa de recursos** (equipamentos, veículos, dispositivos)
- **Gestão de usuários** (apenas Admin)
- **Sistema de logs** de entrada/saída com veículos (Admin/Gerente)
- **Logs de acesso** ao sistema (Admin/Gerente)
- **Controle de inventário** com alertas de estoque baixo (apenas Admin)
- **Dashboard interativo** com filtros por categoria
- **Funcionalidade de edição** completa para todos os módulos
- **Interface responsiva** com tema Batman (preto e dourado)

### 🔐 Níveis de Acesso
- **Administrador**: Acesso total a todas as funcionalidades
- **Gerente**: Pode gerenciar recursos e visualizar logs
- **Funcionário**: Apenas visualização de recursos

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js + Express
- **Banco de Dados**: MySQL
- **Estilo**: CSS puro com tema Batman personalizado

## 📁 Estrutura do Projeto

```
batman-system-v2/
│
├── public/
│   ├── index.html         # Página de login
│   ├── dashboard.html     # Dashboard principal com todas as seções
│   ├── style.css         # Estilos completos (tema Batman)
│   └── script.js         # JavaScript principal com todas as funcionalidades
│
├── server.js             # Servidor Node.js com todas as APIs
├── db.sql               # Script completo do banco MySQL
├── package.json         # Dependências do Node.js
└── README.md           # Este arquivo
```

## 🚀 Como Instalar e Executar

### 1. Pré-requisitos
- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- Navegador web moderno

### 2. Instalação do MySQL
1. Baixe e instale o MySQL: https://dev.mysql.com/downloads/mysql/
2. Baixe o MySQL Workbench: https://dev.mysql.com/downloads/workbench/

### 3. Configuração do Banco de Dados
1. Abra o MySQL Workbench
2. Conecte-se ao seu servidor MySQL
3. Execute o arquivo `db.sql` para criar o banco e as tabelas:
   ```sql
   -- Copie e cole o conteúdo do arquivo db.sql no MySQL Workbench
   -- Ou execute via linha de comando:
   mysql -u root -p < db.sql
   ```

### 4. Instalação das Dependências
```bash
# Navegue até a pasta do projeto
cd batman-system-v2

# Instale as dependências
npm install
```

### 5. Configuração do Servidor
1. Abra o arquivo `server.js`
2. Altere as configurações do banco de dados (linha 12-17):
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: 'SUA_SENHA_AQUI', // Coloque sua senha do MySQL
       database: 'batman_system'
   });
   ```

### 6. Executar o Projeto
```bash
# Iniciar o servidor
npm start

# Ou para desenvolvimento (com auto-reload)
npm run dev
```

### 7. Acessar o Sistema
Abra seu navegador e acesse: http://localhost:3000

## 👥 Usuários de Teste

| Usuário | Senha | Nível de Acesso | Funcionalidades |
|---------|-------|----------------|-----------------|
| admin | admin123 | Administrador | Acesso total a todas as funcionalidades |
| gerente | ger123 | Gerente | Recursos + Logs (sem usuários/inventário) |
| funcionario | func123 | Funcionário | Apenas visualização de recursos |

## 🎯 Funcionalidades Detalhadas

### 🔐 Sistema de Autenticação
- Login seguro com validação
- Diferentes níveis de acesso (Admin, Gerente, Funcionário)
- Sessão persistente com localStorage
- Logs automáticos de acesso

### 📊 Dashboard Interativo
- Estatísticas em tempo real
- **NOVO**: Cards clicáveis para filtrar recursos por categoria
- Contadores por tipo de recurso
- Interface responsiva

### 🛡️ Gestão de Recursos
- **NOVO**: Funcionalidade completa de edição
- **Administradores**: Podem adicionar, editar e remover recursos
- **Gerentes**: Podem adicionar e editar recursos
- **Funcionários**: Apenas visualizar recursos
- Filtros por categoria (equipamentos, veículos, dispositivos)

### 👥 Gestão de Usuários (Admin apenas)
- **NOVO**: Cadastro completo de usuários
- **NOVO**: Edição de usuários existentes
- **NOVO**: Exclusão de usuários
- Controle de níveis de acesso
- Validação de dados

### 📋 Sistema de Logs (Admin/Gerente)
- **NOVO**: Logs de entrada/saída com veículos
- **NOVO**: Registro de data/hora de movimentação
- **NOVO**: Associação com funcionários e veículos
- **NOVO**: Logs de acesso ao sistema
- **NOVO**: Observações detalhadas

### 📦 Controle de Inventário (Admin apenas)
- **NOVO**: Cadastro completo de itens
- **NOVO**: Controle de quantidade atual e mínima
- **NOVO**: Alertas visuais para estoque baixo
- **NOVO**: Categorização de itens
- **NOVO**: Edição e exclusão de itens

### 🎨 Tipos de Recursos
- **Equipamentos**: Computadores, sistemas, ferramentas
- **Veículos**: Batmóvel, Batwing, Batboat, etc.
- **Dispositivos**: Gadgets, sensores, comunicação

### 📱 Interface Responsiva
- Design adaptável para desktop, tablet e mobile
- Tema Batman consistente em todas as telas
- Navegação intuitiva entre seções
- Animações suaves e efeitos visuais

## 🎨 Tema Visual

O sistema utiliza um tema inspirado no Batman:
- **Cores principais**: Preto (#000), Dourado (#FFD700)
- **Efeitos**: Sombras douradas, animações suaves
- **Ícones**: Font Awesome para ícones modernos
- **Fundo**: Skyline de Gotham com estrelas animadas
- **Cards**: Design moderno com bordas douradas

## 🔧 Comandos Úteis

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start

# Iniciar em modo desenvolvimento
npm run dev

# Verificar logs do MySQL
# No MySQL Workbench: 
SELECT * FROM access_logs ORDER BY timestamp DESC;
SELECT * FROM entry_exit_logs ORDER BY timestamp DESC;
SELECT * FROM inventory WHERE quantity <= min_quantity;
```

## 📊 Estrutura do Banco de Dados

### Tabela `users`
- `id`: Chave primária
- `username`: Nome de usuário único
- `password`: Senha (em produção, usar hash)
- `role`: Nível de acesso (admin/gerente/funcionario)
- `name`: Nome completo
- `created_at`, `updated_at`: Timestamps

### Tabela `recursos`
- `id`: Chave primária
- `nome`: Nome do recurso
- `tipo`: Tipo (equipamento/veiculo/dispositivo)
- `status`: Status atual
- `descricao`: Descrição detalhada
- `created_at`, `updated_at`: Timestamps

### Tabela `access_logs`
- `id`: Chave primária
- `user_id`: ID do usuário
- `action`: Ação realizada
- `details`: Detalhes da ação
- `timestamp`: Data/hora da ação

### Tabela `entry_exit_logs` (NOVA)
- `id`: Chave primária
- `user_id`: ID do funcionário
- `vehicle_id`: ID do veículo utilizado
- `action`: Tipo (entrada/saida)
- `notes`: Observações da missão
- `timestamp`: Data/hora do movimento

### Tabela `inventory` (NOVA)
- `id`: Chave primária
- `item_name`: Nome do item
- `category`: Categoria do item
- `quantity`: Quantidade atual
- `min_quantity`: Quantidade mínima
- `description`: Descrição do item
- `created_at`, `updated_at`: Timestamps

## 🚨 Solução de Problemas

### Erro de Conexão com MySQL
1. Verifique se o MySQL está rodando
2. Confirme usuário e senha no `server.js`
3. Execute o script `db.sql` completamente
4. Teste a conexão no MySQL Workbench

### Erro "Cannot GET /"
1. Certifique-se de que o servidor está rodando
2. Verifique se a porta 3000 está livre
3. Acesse http://localhost:3000

### Funcionalidades não aparecem
1. Verifique se está logado com o usuário correto
2. Admin tem acesso total
3. Gerente não vê usuários/inventário
4. Funcionário só vê recursos

### Página em branco
1. Abra o console do navegador (F12)
2. Verifique erros de JavaScript
3. Confirme se todos os arquivos estão na pasta correta

## 📈 Melhorias Implementadas na v2.0

### ✅ Funcionalidades Adicionadas
- [x] Sistema completo de cadastro/edição/exclusão de usuários
- [x] Funcionalidade de edição para todos os recursos
- [x] Logs de entrada/saída com veículos e horários
- [x] Sistema de inventário com controle de estoque
- [x] Dashboard com filtros clicáveis por categoria
- [x] Interface de navegação por abas
- [x] Controle de permissões visuais
- [x] Validações completas de formulários
- [x] Mensagens de sucesso/erro aprimoradas

### 🔒 Segurança e Permissões
- Controle rigoroso de acesso por nível de usuário
- Validações no frontend e backend
- Prevenção de ações não autorizadas
- Logs detalhados de todas as ações

### 🎨 Interface Aprimorada
- Design responsivo completo
- Animações suaves entre seções
- Cards interativos com hover effects
- Alertas visuais para estoque baixo
- Scrollbar personalizada

## 👨‍💻 Desenvolvedor

Projeto desenvolvido para as Indústrias Wayne como sistema completo de gerenciamento de segurança.

**Tecnologias**: HTML5, CSS3, JavaScript, Node.js, Express, MySQL

---

*"It's not who I am underneath, but what I do that defines me." - Batman*

## 📝 Changelog v2.0

- ✅ Adicionado sistema completo de usuários
- ✅ Implementada funcionalidade de edição para recursos
- ✅ Criado sistema de logs de entrada/saída
- ✅ Desenvolvido controle de inventário
- ✅ Implementados filtros interativos no dashboard
- ✅ Melhorada navegação com sistema de abas
- ✅ Aprimorado controle de permissões
- ✅ Otimizada interface responsiva
- ✅ Adicionadas validações completas
- ✅ Implementado sistema de notificações
