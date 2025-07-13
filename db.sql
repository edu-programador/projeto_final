CREATE DATABASE IF NOT EXISTS batman_system;
USE batman_system;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('admin','gerente','funcionario') NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de recursos (equipamentos, veículos, dispositivos)
CREATE TABLE IF NOT EXISTS recursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('equipamento','veiculo','dispositivo') NOT NULL,
    status VARCHAR(50) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de logs de acesso
CREATE TABLE IF NOT EXISTS access_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100),
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabela de inventário
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    min_quantity INT NOT NULL DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de logs de entrada/saída
CREATE TABLE IF NOT EXISTS entry_exit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    vehicle_id INT,
    action ENUM('entrada','saida') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES recursos(id) ON DELETE SET NULL
);

-- Limpar dados existentes (opcional)
DELETE FROM access_logs;
DELETE FROM recursos;
DELETE FROM users;

-- Usuários de exemplo
INSERT INTO users (username, password, role, name) VALUES
('admin', 'admin123', 'admin', 'Bruce Wayne'),
('gerente', 'ger123', 'gerente', 'Lucius Fox'),
('funcionario', 'func123', 'funcionario', 'Alfred Pennyworth');

-- Recursos de exemplo
INSERT INTO recursos (nome, tipo, status, descricao) VALUES
('Batmóvel', 'veiculo', 'Operacional', 'Veículo principal para patrulhamento'),
('Batcave Computer', 'equipamento', 'Online', 'Sistema central de monitoramento'),
('Grappling Hook', 'dispositivo', 'Disponível', 'Dispositivo de escalada e locomoção'),
('Batwing', 'veiculo', 'Manutenção', 'Aeronave para missões aéreas'),
('Utility Belt', 'equipamento', 'Operacional', 'Cinto com gadgets essenciais'),
('Batboat', 'veiculo', 'Operacional', 'Embarcação para missões aquáticas'),
('Batarang', 'dispositivo', 'Disponível', 'Arma de arremesso em formato de morcego');

-- Inventário de exemplo
INSERT INTO inventory (item_name, category, quantity, min_quantity, description) VALUES
('Batarangs', 'Armas', 50, 10, 'Armas de arremesso em formato de morcego'),
('Smoke Bombs', 'Dispositivos', 25, 5, 'Bombas de fumaça para fuga'),
('Grappling Hooks', 'Equipamentos', 15, 3, 'Ganchos para escalada'),
('Kevlar Suits', 'Proteção', 8, 2, 'Trajes à prova de balas'),
('Night Vision Goggles', 'Equipamentos', 12, 3, 'Óculos de visão noturna'),
('Explosive Gel', 'Dispositivos', 30, 8, 'Gel explosivo para demolições'),
('Medical Kits', 'Suprimentos', 20, 5, 'Kits de primeiros socorros');

-- Logs de entrada/saída de exemplo
INSERT INTO entry_exit_logs (user_id, vehicle_id, action, notes) VALUES
(1, 1, 'entrada', 'Patrulhamento noturno - Setor Norte'),
(1, 1, 'saida', 'Retorno da missão - Setor Norte'),
(2, 4, 'entrada', 'Manutenção preventiva'),
(3, 6, 'entrada', 'Transporte de suprimentos');
