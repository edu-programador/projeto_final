const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'edu123', // ALTERE AQUI para sua senha do MySQL
    database: 'batman_system'
});

// Conectar ao banco
db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

// Rota de login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, results) => {
            if (err) {
                console.error('Erro no login:', err);
                return res.status(500).json({ error: 'Erro no servidor' });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Usuário ou senha inválidos' });
            }

            const user = results[0];

            // Log de acesso
            db.query(
                'INSERT INTO access_logs (user_id, action, details) VALUES (?, ?, ?)',
                [user.id, 'LOGIN', `Login realizado por ${user.name}`],
                (logErr) => {
                    if (logErr) console.error('Erro ao registrar log:', logErr);
                }
            );

            res.json({ 
                username: user.username, 
                role: user.role, 
                name: user.name,
                id: user.id
            });
        }
    );
});

// Listar usuários (apenas admin)
app.get('/api/users', (req, res) => {
    db.query('SELECT id, username, role, name, created_at FROM users ORDER BY created_at DESC', (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        res.json(results);
    });
});

// Adicionar usuário (apenas admin)
app.post('/api/users', (req, res) => {
    const { username, password, role, name } = req.body;

    db.query(
        'INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)',
        [username, password, role, name],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Nome de usuário já existe' });
                }
                console.error('Erro ao adicionar usuário:', err);
                return res.status(500).json({ error: 'Erro ao adicionar usuário' });
            }
            res.json({ id: result.insertId, message: 'Usuário adicionado com sucesso!' });
        }
    );
});

// Atualizar usuário (apenas admin)
app.put('/api/users/:id', (req, res) => {
    const { username, password, role, name } = req.body;
    const { id } = req.params;

    db.query(
        'UPDATE users SET username=?, password=?, role=?, name=? WHERE id=?',
        [username, password, role, name, id],
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Nome de usuário já existe' });
                }
                console.error('Erro ao atualizar usuário:', err);
                return res.status(500).json({ error: 'Erro ao atualizar usuário' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.json({ message: 'Usuário atualizado com sucesso!' });
        }
    );
});

// Remover usuário (apenas admin)
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover usuário:', err);
            return res.status(500).json({ error: 'Erro ao remover usuário' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário removido com sucesso!' });
    });
});

// Listar recursos
app.get('/api/recursos', (req, res) => {
    const { tipo } = req.query;
    let query = 'SELECT * FROM recursos';
    let params = [];

    if (tipo && tipo !== 'todos') {
        query += ' WHERE tipo = ?';
        params.push(tipo);
    }

    query += ' ORDER BY created_at DESC';

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao buscar recursos:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        res.json(results);
    });
});

// Adicionar recurso
app.post('/api/recursos', (req, res) => {
    const { nome, tipo, status, descricao } = req.body;

    db.query(
        'INSERT INTO recursos (nome, tipo, status, descricao) VALUES (?, ?, ?, ?)',
        [nome, tipo, status, descricao],
        (err, result) => {
            if (err) {
                console.error('Erro ao adicionar recurso:', err);
                return res.status(500).json({ error: 'Erro ao adicionar recurso' });
            }
            res.json({ id: result.insertId, message: 'Recurso adicionado com sucesso!' });
        }
    );
});

// Atualizar recurso
app.put('/api/recursos/:id', (req, res) => {
    const { nome, tipo, status, descricao } = req.body;
    const { id } = req.params;

    db.query(
        'UPDATE recursos SET nome=?, tipo=?, status=?, descricao=? WHERE id=?',
        [nome, tipo, status, descricao, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar recurso:', err);
                return res.status(500).json({ error: 'Erro ao atualizar recurso' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Recurso não encontrado' });
            }

            res.json({ message: 'Recurso atualizado com sucesso!' });
        }
    );
});

// Remover recurso
app.delete('/api/recursos/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM recursos WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover recurso:', err);
            return res.status(500).json({ error: 'Erro ao remover recurso' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recurso não encontrado' });
        }

        res.json({ message: 'Recurso removido com sucesso!' });
    });
});

// Rota para estatísticas (dashboard)
app.get('/api/stats', (req, res) => {
    const stats = {};

    // Contar recursos por tipo
    db.query('SELECT tipo, COUNT(*) as count FROM recursos GROUP BY tipo', (err, results) => {
        if (err) {
            console.error('Erro ao buscar estatísticas:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }

        stats.recursos_por_tipo = results;

        // Contar total de recursos
        db.query('SELECT COUNT(*) as total FROM recursos', (err2, results2) => {
            if (err2) {
                console.error('Erro ao contar recursos:', err2);
                return res.status(500).json({ error: 'Erro no servidor' });
            }

            stats.total_recursos = results2[0].total;

            // Contar usuários
            db.query('SELECT COUNT(*) as total FROM users', (err3, results3) => {
                if (err3) {
                    console.error('Erro ao contar usuários:', err3);
                    return res.status(500).json({ error: 'Erro no servidor' });
                }

                stats.total_usuarios = results3[0].total;
                res.json(stats);
            });
        });
    });
});

// Logs de entrada/saída
app.get('/api/entry-exit-logs', (req, res) => {
    const query = `
        SELECT eel.*, u.name as user_name, r.nome as vehicle_name 
        FROM entry_exit_logs eel
        LEFT JOIN users u ON eel.user_id = u.id
        LEFT JOIN recursos r ON eel.vehicle_id = r.id
        ORDER BY eel.timestamp DESC
        LIMIT 100
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar logs de entrada/saída:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        res.json(results);
    });
});

// Adicionar log de entrada/saída
app.post('/api/entry-exit-logs', (req, res) => {
    const { user_id, vehicle_id, action, notes } = req.body;

    db.query(
        'INSERT INTO entry_exit_logs (user_id, vehicle_id, action, notes) VALUES (?, ?, ?, ?)',
        [user_id, vehicle_id, action, notes],
        (err, result) => {
            if (err) {
                console.error('Erro ao adicionar log:', err);
                return res.status(500).json({ error: 'Erro ao adicionar log' });
            }
            res.json({ id: result.insertId, message: 'Log adicionado com sucesso!' });
        }
    );
});

// Inventário
app.get('/api/inventory', (req, res) => {
    db.query('SELECT * FROM inventory ORDER BY item_name', (err, results) => {
        if (err) {
            console.error('Erro ao buscar inventário:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        res.json(results);
    });
});

// Adicionar item ao inventário
app.post('/api/inventory', (req, res) => {
    const { item_name, category, quantity, min_quantity, description } = req.body;

    db.query(
        'INSERT INTO inventory (item_name, category, quantity, min_quantity, description) VALUES (?, ?, ?, ?, ?)',
        [item_name, category, quantity, min_quantity, description],
        (err, result) => {
            if (err) {
                console.error('Erro ao adicionar item:', err);
                return res.status(500).json({ error: 'Erro ao adicionar item' });
            }
            res.json({ id: result.insertId, message: 'Item adicionado com sucesso!' });
        }
    );
});

// Atualizar item do inventário
app.put('/api/inventory/:id', (req, res) => {
    const { item_name, category, quantity, min_quantity, description } = req.body;
    const { id } = req.params;

    db.query(
        'UPDATE inventory SET item_name=?, category=?, quantity=?, min_quantity=?, description=? WHERE id=?',
        [item_name, category, quantity, min_quantity, description, id],
        (err, result) => {
            if (err) {
                console.error('Erro ao atualizar item:', err);
                return res.status(500).json({ error: 'Erro ao atualizar item' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }

            res.json({ message: 'Item atualizado com sucesso!' });
        }
    );
});

// Remover item do inventário
app.delete('/api/inventory/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM inventory WHERE id=?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao remover item:', err);
            return res.status(500).json({ error: 'Erro ao remover item' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Item não encontrado' });
        }

        res.json({ message: 'Item removido com sucesso!' });
    });
});

// Logs de acesso (para admin/gerente)
app.get('/api/access-logs', (req, res) => {
    const query = `
        SELECT al.*, u.name as user_name 
        FROM access_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ORDER BY al.timestamp DESC
        LIMIT 100
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar logs de acesso:', err);
            return res.status(500).json({ error: 'Erro no servidor' });
        }
        res.json(results);
    });
});

// Fallback para SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Para parar o servidor, pressione Ctrl+C');
});
