-- TIPOS USUÁRIO
CREATE TABLE IF NOT EXISTS tipos_usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- USUÁRIOS
CREATE TABLE IF NOT EXISTS usuarios (
    cpf VARCHAR(14) PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    tipo_id INTEGER REFERENCES tipos_usuario(id) NOT NULL,
    senha TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acesso TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ENDEREÇOS
CREATE TABLE IF NOT EXISTS enderecos (
    id SERIAL PRIMARY KEY,
    cpf_usuario VARCHAR(14) NOT NULL REFERENCES usuarios(cpf) ON DELETE CASCADE,
    cep VARCHAR(10) NOT NULL,
    logradouro VARCHAR(255) NOT NULL,
    bairro VARCHAR(255) NOT NULL,
    cidade VARCHAR(255) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    numero TEXT
);

-- PACIENTES
CREATE TABLE pacientes_aux (
    pac_codigo TEXT PRIMARY KEY,
    internacao INTEGER,
    nome TEXT,
    idade INTEGER,
    imc INTEGER,
    nascimento TEXT,
    cor TEXT,
    sexo TEXT,
    altura_consulta NUMERIC,
    peso_consulta NUMERIC,
    altura_controle NUMERIC,
    peso_controle NUMERIC,
    qrt_numero TEXT,
    lto_lto_id TEXT,
    criticidade_alergica TEXT,
    grau_certeza TEXT,
    medicamento TEXT,
    agente_causador TEXT,
    classificacao_alergica TEXT,
    data_sincronizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ODORES
CREATE TABLE IF NOT EXISTS odores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- QUANTIDADES DE EXSUDATO
CREATE TABLE IF NOT EXISTS quantidades_exsudato (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- TIPOS DE EXSUDATO
CREATE TABLE IF NOT EXISTS tipos_exsudato (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- ETIOLOGIAS
CREATE TABLE IF NOT EXISTS etiologias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- CLASSIFICAÇÕES DE LESÃO POR PRESSÃO
CREATE TABLE IF NOT EXISTS classificacoes_lesao_por_pressao (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- REGIÕES PERILESIONAIS
CREATE TABLE IF NOT EXISTS regioes_perilesionais (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- BORDAS DAS LESÕES
CREATE TABLE IF NOT EXISTS bordas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- CLASSIFICAÇÃO DA DOR
CREATE TABLE IF NOT EXISTS classificacoes_dor (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- TECIDOS
CREATE TABLE IF NOT EXISTS tecidos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- ESTRUTURAS NOBRES
CREATE TABLE IF NOT EXISTS estruturas_nobres (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- COBERTURAS UTILIZADAS
CREATE TABLE IF NOT EXISTS coberturas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- TIPOS FECHAMENTO DO CURATIVO
CREATE TABLE IF NOT EXISTS tipos_fechamento_curativo (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- LIMPEZA DA LESÃO
CREATE TABLE IF NOT EXISTS limpezas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- DESBRIDAMENTO
CREATE TABLE IF NOT EXISTS desbridamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
);

-- PROTEÇÕES
CREATE TABLE IF NOT EXISTS protecoes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE
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
        precisa_aprovacao BOOLEAN NOT NULL,
        presenca_tunel TEXT NOT NULL,
        possui_dor TEXT NOT NULL,
        escala_numerica_dor INTEGER CHECK (
            escala_numerica_dor >= 0
            AND escala_numerica_dor <= 10
        ),
        quantidade_exsudato_id INTEGER REFERENCES quantidades_exsudato(id),
        tipo_exsudato_id INTEGER REFERENCES tipos_exsudato(id),
        odor_id INTEGER REFERENCES odores(id),
        comprimento NUMERIC NOT NULL,
        largura NUMERIC NOT NULL,
        profundidade NUMERIC,
        localizacao TEXT NOT NULL,
        data_proxima_avaliacao TIMESTAMP NOT NULL,
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        eh_copia BOOLEAN NOT NULL DEFAULT false
);

-- 📌 DEFINIÇÃO DE RELACIONAMENTOS 
-- DEFININDO OS RELACIONAMENTOS ENTRE AS TABELAS
-- RELAÇÃO: LESÃO x LESÃO
CREATE TABLE IF NOT EXISTS historico_lesoes (
    id SERIAL PRIMARY KEY,
    lesao_original_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    -- 	a primeira lesão criada
    lesao_base_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    -- a lesão usada como base para a nova versão
    lesao_versao_id INTEGER NOT NULL UNIQUE REFERENCES lesoes(id) ON DELETE CASCADE,
    -- a nova versão criada
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RELAÇÃO: LESÃO x ETIOLOGIA
CREATE TABLE IF NOT EXISTS lesoes_etiologias (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    etiologia_id INTEGER NOT NULL REFERENCES etiologias(id) ON DELETE CASCADE
);

-- RELAÇÃO: LESÃO x CLASSIFICAÇÃO
CREATE TABLE IF NOT EXISTS lesoes_classificacoes_lesao_por_pressao (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    classificacao_id INTEGER NOT NULL REFERENCES classificacoes_lesao_por_pressao(id) ON DELETE CASCADE
);

-- RELAÇÃO: LESÃO x REGIÃO PERILESIONAL
CREATE TABLE IF NOT EXISTS lesoes_regioes_perilesionais (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    regiao_id INTEGER NOT NULL REFERENCES regioes_perilesionais(id) ON DELETE CASCADE,
    descricao_outro TEXT
);

-- RELAÇÃO: LESÃO x BORDA
CREATE TABLE IF NOT EXISTS lesoes_bordas (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    borda_id INTEGER NOT NULL REFERENCES bordas(id) ON DELETE CASCADE
);

-- RELAÇÃO: LESÃO x CLASSIFICAÇÃO DA DOR
CREATE TABLE IF NOT EXISTS lesoes_classificacoes_dor (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    classificacao_id INTEGER NOT NULL REFERENCES classificacoes_dor(id) ON DELETE CASCADE
);

-- RELAÇÃO: LESÃO x TECIDO
CREATE TABLE IF NOT EXISTS lesoes_tecidos (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    tecido_id INTEGER NOT NULL REFERENCES tecidos(id) ON DELETE CASCADE,
    percentual NUMERIC NOT NULL CHECK (
        percentual BETWEEN 0
        AND 100
    )
);

-- RELAÇÃO: TECIDO x ESTRUTURA NOBRE
CREATE TABLE IF NOT EXISTS lesoes_estruturas_nobres (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    estrutura_id INTEGER NOT NULL REFERENCES estruturas_nobres(id) ON DELETE CASCADE,
    descricao_outro TEXT
);

-- RELAÇÃO: LESÃO x COBERTURAS
CREATE TABLE IF NOT EXISTS lesoes_coberturas (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    cobertura_id INTEGER NOT NULL REFERENCES coberturas(id) ON DELETE CASCADE,
    quantidade NUMERIC NOT NULL CHECK (quantidade >= 0)
);

-- RELAÇÃO: LESÃO x TIPOS FECHAMENTO
CREATE TABLE IF NOT EXISTS lesoes_fechamento_curativo (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    fechamento_curativo_id INTEGER NOT NULL REFERENCES tipos_fechamento_curativo(id) ON DELETE CASCADE,
    quantidade NUMERIC NOT NULL CHECK (quantidade >= 0)
);

-- RELAÇÃO: LESÃO x LIMPEZA
CREATE TABLE IF NOT EXISTS lesoes_limpezas (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    limpeza_id INTEGER NOT NULL REFERENCES limpezas(id) ON DELETE CASCADE,
    descricao_outro TEXT
);

-- RELAÇÃO: LESÃO x DESBRIDAMENTO
CREATE TABLE IF NOT EXISTS lesoes_desbridamentos (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    desbridamento_id INTEGER NOT NULL REFERENCES desbridamentos(id) ON DELETE CASCADE,
    descricao_outro TEXT
);

-- RELAÇÃO: LESÃO x PROTEÇÃO
CREATE TABLE IF NOT EXISTS lesoes_protecoes (
    id SERIAL PRIMARY KEY,
    lesao_id INTEGER NOT NULL REFERENCES lesoes(id) ON DELETE CASCADE,
    protecao_id INTEGER NOT NULL REFERENCES protecoes(id) ON DELETE CASCADE,
    descricao_outro TEXT
);

-- 📌 INSERÇÃO DE VALORES 
-- INSERINDO OS VALORES DOS TIPOS DE USUÁRIO
INSERT INTO
    tipos_usuario(nome)
VALUES
    ('Acadêmico'),
    ('Residente'),
    ('Profissional');

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
    classificacoes_dor(nome)
VALUES
    ('Aguda'),
    ('Crônica'),
    ('Recorrente'),
    ('Necessidade de analgesia prévia a procedimento');

-- INSERINDO AS QUANTIDADES DE EXSUDATO
INSERT INTO
    quantidades_exsudato(nome)
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

-- INSERINDO AS COBERTURAS UTILIZADAS
INSERT INTO
    coberturas(nome)
VALUES
    ('AGE'),
    ('Alginato de Cálcio com prata placa'),
    ('Alginato de Cálcio com prata fita'),
    ('Alginato de Cálcio fita'),
    ('Carvão ativado com prata'),
    ('Cinto para estomia'),
    ('Espuma com prata grande'),
    ('Espuma com prata pequena'),
    ('Espuma com silicone e prata grande'),
    ('Espuma com silicone pequena'),
    ('Hidrofibra com prata'),
    ('Hidrogel'),
    ('Melolin'),
    ('Membracel'),
    ('Pasta hidrocoloide'),
    ('PHMB gel'),
    ('Placa de hidrocoloide fina'),
    ('Placa de hidrocoloide grossa'),
    ('Prata nanocristalina'),
    ('Rayon com petrolatum'),
    ('Filtro de carvão ativado'),
    ('Hidrocoloide bastão'),
    ('Pasta periestomal');

-- INSERINDO TIPOS DE FECHAMENTO DE CURATIVO
INSERT INTO
    tipos_fechamento_curativo(nome)
VALUES
    ('Película transparente em rolo para curativo'),
    ('Bota de Unna'),
    (' Rede tubular 3'),
    ('Rede tubular 6'),
    ('Chumaço e Atadura');

-- INSERINDO OS VALORES DE TECIDO
INSERT INTO
    tecidos(nome)
VALUES
    ('Epitelizado'),
    ('Granulação'),
    ('Hipergranulação'),
    ('Necrose úmida'),
    ('Necrose seca'),
    ('Esfacelo');

-- INSERINDO OS VALORES DAS LIMPEZAS
INSERT INTO
    limpezas(nome)
VALUES
    ('Solução para limpeza'),
    ('SF 0,9%'),
    ('Removedor de adesivos de pele'),
    ('Outro');

-- INSERINDO OS VALORES DO DESBRIDAMENTO
INSERT INTO
    desbridamentos(nome)
VALUES
    ('Slice'),
    ('Square'),
    ('Cover'),
    ('Outro');

-- INSERINDO OS VALORES DAS PROTEÇÕES
INSERT INTO
    protecoes(nome)
VALUES
    ('Hidratante'),
    ('Creme barreira'),
    (
        'Película protetora líquida não alcoólica - Spray'
    ),
    ('Lenço barreira'),
    ('Pó protetor periostomal'),
    ('Outro');