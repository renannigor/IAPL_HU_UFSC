CREATE TABLE IF NOT EXISTS Usuarios (
    cpf VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tipo VARCHAR(50) CHECK (
        tipo IN ('Acadêmico', 'Residente', 'Profissional')
    ) NOT NULL,
    admin BOOLEAN DEFAULT FALSE,
    possui_acesso BOOLEAN DEFAULT FALSE,
    online BOOLEAN DEFAULT TRUE,
    senha TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Enderecos (
    id SERIAL PRIMARY KEY,
    cpf_usuario VARCHAR(14) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    FOREIGN KEY (cpf_usuario) REFERENCES Usuarios(cpf) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS TokensRedefinicaoSenha (
    id SERIAL PRIMARY KEY,
    email TEXT REFERENCES Usuarios(email) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL
);