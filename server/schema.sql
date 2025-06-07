-- USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
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

-- ENDEREÇOS
CREATE TABLE IF NOT EXISTS enderecos (
    id SERIAL PRIMARY KEY,
    cpf_usuario VARCHAR(14) NOT NULL,
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    numero VARCHAR(10) NOT NULL,
    FOREIGN KEY (cpf_usuario) REFERENCES usuarios(cpf) ON DELETE CASCADE
);

-- TOKENS DE REDEFINIÇÃO DE SENHA
CREATE TABLE IF NOT EXISTS tokens_redefinicao_senha (
    id SERIAL PRIMARY KEY,
    email TEXT REFERENCES usuarios(email) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

-- TECIDOS
CREATE TABLE IF NOT EXISTS tecidos (
    id SERIAL PRIMARY KEY,
    epitelizado INTEGER NOT NULL,
    granulacao INTEGER NOT NULL,
    hipergranulacao INTEGER NOT NULL,
    necrose_umida INTEGER NOT NULL,
    necrose_seca INTEGER NOT NULL,
    esfacelo INTEGER NOT NULL
);

-- COBERTURA UTILIZADA
CREATE TABLE IF NOT EXISTS cobertura_utilizada (
    id SERIAL PRIMARY KEY,
    age INTEGER NOT NULL,
    alginato_calcio_prata_placa INTEGER NOT NULL,
    alginato_calcio_prata_fita INTEGER NOT NULL,
    alginato_calcio_fita INTEGER NOT NULL,
    bota_unna INTEGER NOT NULL,
    carvao_ativado_prata INTEGER NOT NULL,
    cinto_estomia INTEGER NOT NULL,
    espuma_prata_grande INTEGER NOT NULL,
    espuma_prata_pequena INTEGER NOT NULL,
    espuma_silicone_prata_grande INTEGER NOT NULL,
    espuma_silicone_pequena INTEGER NOT NULL,
    hidrofibra_prata INTEGER NOT NULL,
    hidrogel INTEGER NOT NULL,
    melolin INTEGER NOT NULL,
    membracel INTEGER NOT NULL,
    pasta_hidrocoloide INTEGER NOT NULL,
    phmb_gel INTEGER NOT NULL,
    placa_hidrocoloide_fina INTEGER NOT NULL,
    placa_hidrocoloide_grossa INTEGER NOT NULL,
    prata_nanocristalina INTEGER NOT NULL,
    rayon_petrolatum INTEGER NOT NULL,
    filtro_carvao_ativado INTEGER NOT NULL,
    hidrocoloide_bastao INTEGER NOT NULL,
    pasta_periestomal INTEGER NOT NULL
);

-- FECHAMENTO DO CURATIVO
CREATE TABLE IF NOT EXISTS fechamento_curativo (
    id SERIAL PRIMARY KEY,
    pelicula_transparente_rolo_curativos INTEGER NOT NULL,
    bota_unna INTEGER NOT NULL,
    rede_tubular_3 INTEGER NOT NULL,
    rede_tubular_6 INTEGER NOT NULL,
    chumaco_atadura INTEGER NOT NULL
);

-- LESÕES
CREATE TABLE IF NOT EXISTS lesoes (
    id SERIAL PRIMARY KEY,
    paciente_id TEXT NOT NULL,
    criado_por VARCHAR(14) REFERENCES usuarios(cpf) ON DELETE
    SET
        NULL,
        modificado_por VARCHAR(14) REFERENCES usuarios(cpf) ON DELETE
    SET
        NULL,
        aprovado_por VARCHAR(14) REFERENCES usuarios(cpf) ON DELETE
    SET
        NULL,
        cadastrado_por_academico BOOLEAN NOT NULL,
        presenca_tunel TEXT NOT NULL,
        possui_dor TEXT NOT NULL,
        escala_dor INTEGER CHECK (
            escala_dor >= 1
            AND escala_dor <= 10
        ),
        exsudato INTEGER REFERENCES exsudatos(id),
        tipo_exsudato INTEGER REFERENCES tipos_exsudato(id),
        odor INTEGER REFERENCES odores(id),
        comprimento INTEGER NOT NULL,
        largura INTEGER NOT NULL,
        profundidade INTEGER NOT NULL,
        tecido_id INTEGER REFERENCES tecidos(id),
        cobertura_utilizada_id INTEGER REFERENCES cobertura_utilizada(id),
        fechamento_curativo_id INTEGER REFERENCES fechamento_curativo(id)
);

-- ODORES
CREATE TABLE IF NOT EXISTS odores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- EXSUDATOS
CREATE TABLE IF NOT EXISTS exsudatos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- TIPOS DE EXSUDATO
CREATE TABLE IF NOT EXISTS tipos_exsudato (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- ETIOLOGIAS
CREATE TABLE IF NOT EXISTS etiologias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- CLASSIFICAÇÕES DE LESÃO POR PRESSÃO
CREATE TABLE IF NOT EXISTS classificacoes_lesao_por_pressao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- REGIÕES PERILESIONAIS
CREATE TABLE IF NOT EXISTS regioes_perilesionais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- BORDAS DAS LESÕES
CREATE TABLE IF NOT EXISTS bordas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- QUANTIFICAÇÕES DA DOR
CREATE TABLE IF NOT EXISTS quantificacoes_dor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- ESTRUTURAS NOBRES
CREATE TABLE IF NOT EXISTS estruturas_nobres (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- LIMPEZA DA LESÃO
CREATE TABLE IF NOT EXISTS limpeza (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- DESBRIDAMENTO
CREATE TABLE IF NOT EXISTS desbridamento (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- PROTEÇÃO
CREATE TABLE IF NOT EXISTS protecao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL
);

-- 📌 DEFINIÇÃO DE RELACIONAMENTOS 
-- DEFININDO OS RELACIONAMENTOS ENTRE AS TABELAS
-- RELAÇÃO: LESÃO x ETIOLOGIA
CREATE TABLE IF NOT EXISTS lesoes_etiologias (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER REFERENCES lesoes(id) ON DELETE CASCADE,
    etiologia_id INTEGER REFERENCES etiologias(id)
);

-- RELAÇÃO: LESÃO x CLASSIFICAÇÃO
CREATE TABLE IF NOT EXISTS lesoes_classificacoes_lesao_por_pressao (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER REFERENCES lesoes(id) ON DELETE CASCADE,
    classificacao_id INTEGER REFERENCES classificacoes_lesao_por_pressao(id)
);

-- RELAÇÃO: LESÃO x REGIÃO PERILESIONAL
CREATE TABLE IF NOT EXISTS lesoes_regioes_perilesionais (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER REFERENCES lesoes(id) ON DELETE CASCADE,
    regiao_id INTEGER REFERENCES regioes_perilesionais(id),
    descricao_outro TEXT
);

-- RELAÇÃO: LESÃO x BORDA
CREATE TABLE IF NOT EXISTS lesoes_bordas (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER REFERENCES lesoes(id) ON DELETE CASCADE,
    borda_id INTEGER REFERENCES bordas(id)
);

-- RELAÇÃO: LESÃO x QUANTIFICAÇÃO DE DOR
CREATE TABLE IF NOT EXISTS lesoes_quantificacoes_dor (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER REFERENCES lesoes(id) ON DELETE CASCADE,
    quantificacao_id INTEGER REFERENCES quantificacoes_dor(id)
);

-- RELAÇÃO: TECIDO x ESTRUTURA NOBRE
CREATE TABLE IF NOT EXISTS tecidos_estruturas_nobres (
    id SERIAL PRIMARY KEY,
    tecido_id INTEGER REFERENCES tecidos(id) ON DELETE CASCADE,
    estrutura_id INTEGER REFERENCES estruturas_nobres(id),
    descricao_outro TEXT
);

-- RELAÇÃO: LESÃO x LIMPEZA
CREATE TABLE IF NOT EXISTS lesoes_limpeza (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER REFERENCES lesoes(id) ON DELETE CASCADE,
    limpeza_id INTEGER REFERENCES limpeza(id),
    descricao_outro TEXT
);

-- RELAÇÃO: LESÃO x DESBRIDAMENTO
CREATE TABLE IF NOT EXISTS lesoes_desbridamento (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER REFERENCES lesoes(id) ON DELETE CASCADE,
    desbridamento_id INTEGER REFERENCES desbridamento(id),
    descricao_outro TEXT
);

-- RELAÇÃO: LESÃO x PROTEÇÃO
CREATE TABLE IF NOT EXISTS lesoes_protecao (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER REFERENCES lesoes(id) ON DELETE CASCADE,
    protecao_id INTEGER REFERENCES protecao(id),
    descricao_outro TEXT
);

-- 📌 INSERÇÃO DE VALORES 
-- INSERINDO OS VALORES DAS ETIOLOGIAS
INSERT INTO
    etiologias(nome)
VALUES
    ('Arterial'),
    ('Venosa'),
    ('Neuropática'),
    ('Neoplásica'),
    ('Autoimune'),
    ('Abrasão'),
    ('Deiscência'),
    ('Fricção'),
    ('Por umidade'),
    ('Contusa'),
    ('Laceração'),
    ('Lesão por Pressão');

-- INSERINDO OS VALORES DAS CLASSIFICAÇÕES DE LESÃO POR PRESSÃO
INSERT INTO
    classificacoes_lesao_por_pressao(nome)
VALUES
    ('Estágio 1'),
    ('Estágio 2'),
    ('Estágio 3'),
    ('Estágio 4'),
    ('Não classificável'),
    ('Lesão tissular profunda'),
    ('Relacionada a dispositivo'),
    ('Membrana mucosa');

-- INSERINDO OS VALORES DAS REGIÕES PERILESIONAIS
INSERT INTO
    regioes_perilesionais(nome)
VALUES
    ('Sem alterações'),
    ('Hipocorada'),
    ('Hipopigmentada'),
    ('Hiperpigmentada'),
    ('Eritema'),
    ('Macerada'),
    ('Bolhas'),
    ('Outro');

-- INSERINDO OS VALORES DAS BORDAS
INSERT INTO
    bordas(nome)
VALUES
    ('Regular'),
    ('Irregular'),
    ('Aderida'),
    ('Descolamento'),
    ('Epibolia'),
    ('Hiperemiada'),
    ('Macerada'),
    ('Hiperqueratosa');

-- INSERINDO OS VALORES DAS ESTRUTURAS NOBRES
INSERT INTO
    estruturas_nobres(nome)
VALUES
    ('Músculos'),
    ('Tendões'),
    ('Ossos'),
    ('Outro');

-- INSERINDO AS QUANTIFICAÇÕES DE DOR
INSERT INTO
    quantificacoes_dor(nome)
VALUES
    ('Aguda'),
    ('Crônica'),
    ('Recorrente'),
    ('Necessidade de analgesia prévia a procedimento');

-- INSERINDO OS EXSUDATOS
INSERT INTO
    exsudatos(nome)
VALUES
    ('Não exsudativa'),
    ('Pequena <25%'),
    ('Moderada 25 a 70%'),
    ('Abundante ≥ 70%');

-- INSERINDO OS TIPOS DE EXSUDATOS
INSERT INTO
    tipos_exsudato(nome)
VALUES
    ('Seroso'),
    ('Serosanguinolento'),
    ('Sanguinolento'),
    ('Purulento'),
    ('Piossanguinolento');

-- INSERINDO OS ODORES
INSERT INTO
    odores(nome)
VALUES
    ('Sem odor'),
    ('Odor característico'),
    ('Odor fétido'),
    ('Odor pútrido');

-- INSERINDO OS VALORES DAS LIMPEZAS
INSERT INTO
    limpeza(nome)
VALUES
    ('Solução para limpeza'),
    ('SF 0,9%'),
    ('Removedor de adesivos de pele'),
    ('Outro');

-- INSERINDO OS VALORES DO DESBRIDAMENTO
INSERT INTO
    desbridamento(nome)
VALUES
    ('Slice'),
    ('Square'),
    ('Cover'),
    ('Outro');

-- INSERINDO OS VALORES DAS PROTEÇÕES
INSERT INTO
    protecao(nome)
VALUES
    ('Hidratante'),
    ('Creme barreira'),
    (
        'Película protetora líquida não alcoólica - Spray'
    ),
    ('Lenço barreira'),
    ('Pó protetor periostomal'),
    ('Outro');