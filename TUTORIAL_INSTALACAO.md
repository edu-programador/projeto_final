# 🦇 TUTORIAL DE INSTALAÇÃO - Batman System v2.0

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

### 1. Node.js
- Baixe em: https://nodejs.org/
- Versão recomendada: 18.x ou superior
- Para verificar se está instalado: `node --version`

### 2. MySQL
- Baixe em: https://dev.mysql.com/downloads/mysql/
- Versão recomendada: 8.0 ou superior
- MySQL Workbench (opcional, mas recomendado): https://dev.mysql.com/downloads/workbench/

## 🚀 Passo a Passo da Instalação

### PASSO 1: Preparar o Ambiente

1. **Extrair os arquivos**
   ```bash
   # Extraia o arquivo batman-system-v2.zip
   # Navegue até a pasta extraída
   cd batman-system-v2
   ```

2. **Verificar estrutura dos arquivos**
   ```
   batman-system-v2/
   ├── public/
   │   ├── index.html
   │   ├── dashboard.html
   │   ├── style.css
   │   └── script.js
   ├── server.js
   ├── db.sql
   ├── package.json
   └── README.md
   ```

### PASSO 2: Configurar o MySQL

1. **Iniciar o MySQL**
   - Windows: Iniciar através do MySQL Workbench ou Services
   - Linux/Mac: `sudo systemctl start mysql` ou `brew services start mysql`

2. **Criar o banco de dados**

   **Opção A - MySQL Workbench (Recomendado):**
   - Abra o MySQL Workbench
   - Conecte-se ao servidor local
   - Abra o arquivo `db.sql`
   - Execute todo o script (Ctrl+Shift+Enter)

   **Opção B - Linha de comando:**
   ```bash
   mysql -u root -p < db.sql
   ```

3. **Verificar se o banco foi criado**
   ```sql
   SHOW DATABASES;
   USE batman_system;
   SHOW TABLES;
   ```

### PASSO 3: Configurar o Servidor Node.js

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Configurar conexão com MySQL**
   - Abra o arquivo `server.js`
   - Localize as linhas 12-17:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: '', // COLOQUE SUA SENHA AQUI
       database: 'batman_system'
   });
   ```
   - Altere o campo `password` para sua senha do MySQL

### PASSO 4: Executar o Sistema

1. **Iniciar o servidor**
   ```bash
   npm start
   ```

2. **Verificar se está funcionando**
   - Você deve ver a mensagem: "Servidor rodando em http://localhost:3000"
   - E também: "Conectado ao MySQL!"

3. **Acessar o sistema**
   - Abra seu navegador
   - Acesse: http://localhost:3000

## 👥 Testando o Sistema

### Usuários de Teste
| Usuário | Senha | Nível | O que pode fazer |
|---------|-------|-------|------------------|
| admin | admin123 | Administrador | Tudo |
| gerente | ger123 | Gerente | Recursos + Logs |
| funcionario | func123 | Funcionário | Só visualizar |

### Teste Básico
1. **Login como Admin**
   - Usuário: `admin`
   - Senha: `admin123`

2. **Navegar pelas seções**
   - Dashboard: Ver estatísticas e filtros
   - Recursos: Adicionar/editar/remover
   - Usuários: Gerenciar usuários
   - Logs: Ver movimentações
   - Inventário: Controlar estoque

3. **Testar funcionalidades**
   - Adicionar um novo recurso
   - Registrar entrada/saída
   - Adicionar item ao inventário

## 🔧 Solução de Problemas Comuns

### ❌ Erro: "Cannot connect to MySQL"
**Solução:**
1. Verifique se o MySQL está rodando
2. Confirme usuário e senha no `server.js`
3. Teste conexão no MySQL Workbench

### ❌ Erro: "Port 3000 already in use"
**Solução:**
1. Mate o processo na porta 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID_NUMBER> /F

   # Linux/Mac
   lsof -ti:3000 | xargs kill -9
   ```

### ❌ Erro: "Module not found"
**Solução:**
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### ❌ Página em branco
**Solução:**
1. Abra F12 (Developer Tools)
2. Veja erros no Console
3. Verifique se todos os arquivos estão na pasta `public/`

### ❌ Funcionalidades não aparecem
**Solução:**
1. Verifique se está logado com usuário correto
2. Funcionário só vê recursos
3. Gerente não vê usuários/inventário
4. Apenas Admin vê tudo

## 📱 Testando Responsividade

1. **Desktop**: Resolução 1920x1080
2. **Tablet**: Pressione F12 → Toggle device toolbar
3. **Mobile**: Teste em diferentes tamanhos

## 🔒 Configurações de Segurança (Produção)

### Para usar em produção, altere:

1. **Senhas do banco**
   ```javascript
   // Use variáveis de ambiente
   password: process.env.DB_PASSWORD
   ```

2. **Hash das senhas**
   ```bash
   npm install bcrypt
   ```

3. **HTTPS**
   - Configure certificado SSL
   - Use proxy reverso (nginx)

## 📊 Monitoramento

### Logs importantes para verificar:
```sql
-- Últimos acessos
SELECT * FROM access_logs ORDER BY timestamp DESC LIMIT 10;

-- Movimentações recentes
SELECT * FROM entry_exit_logs ORDER BY timestamp DESC LIMIT 10;

-- Itens com estoque baixo
SELECT * FROM inventory WHERE quantity <= min_quantity;
```

## 🆘 Suporte

### Se algo não funcionar:

1. **Verifique os logs do servidor**
   - Olhe o terminal onde rodou `npm start`
   - Procure por mensagens de erro

2. **Verifique o console do navegador**
   - Pressione F12
   - Aba Console
   - Procure por erros em vermelho

3. **Teste a conexão com o banco**
   ```javascript
   // No MySQL Workbench, teste:
   SELECT 1;
   ```

4. **Reinicie tudo**
   ```bash
   # Pare o servidor (Ctrl+C)
   # Reinicie o MySQL
   # Execute novamente:
   npm start
   ```

## ✅ Checklist Final

- [ ] MySQL instalado e rodando
- [ ] Node.js instalado
- [ ] Banco de dados criado com `db.sql`
- [ ] Dependências instaladas (`npm install`)
- [ ] Senha do MySQL configurada no `server.js`
- [ ] Servidor iniciado (`npm start`)
- [ ] Sistema acessível em http://localhost:3000
- [ ] Login funcionando com usuários de teste
- [ ] Todas as seções navegáveis
- [ ] Funcionalidades testadas por nível de usuário

## 🎉 Pronto!

Se chegou até aqui, o sistema está funcionando perfeitamente!

Agora você pode:
- Gerenciar recursos de segurança
- Controlar usuários e permissões
- Monitorar movimentações
- Controlar inventário
- Visualizar estatísticas em tempo real

---

**Desenvolvido para Wayne Industries** 🦇
