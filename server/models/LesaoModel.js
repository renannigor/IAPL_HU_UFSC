import db from "../config/db.js";
import Usuarios from "./UsuarioModel.js";
import DadosFormLesao from "./DadosFormLesaoModel.js";

const LesaoModel = {
  async deletarLesao(id) {
    try {
      await db.query("DELETE FROM lesoes WHERE id = $1", [id]);
    } catch (error) {
      console.error("Erro ao deletar a lesão: ", error);
    }
  },

  async getLesoesPaciente(pacienteId, precisaAprovacao) {
    try {
      const result = await db.query(
        `
        SELECT 
          l.id,
          l.paciente_id,
          criador.nome AS nome_criador,
          modificador.nome AS nome_modificador,
          aprovador.nome AS nome_aprovador,
          l.precisa_aprovacao,
          l.presenca_tunel,
          l.possui_dor,
          l.escala_numerica_dor,
          l.comprimento,
          l.largura,
          l.profundidade,
          l.data_proxima_avaliacao,
          l.data_criacao
        FROM lesoes l
        LEFT JOIN usuarios criador ON l.criado_por = criador.cpf
        LEFT JOIN usuarios modificador ON l.modificado_por = modificador.cpf
        LEFT JOIN usuarios aprovador ON l.aprovado_por = aprovador.cpf
        WHERE l.precisa_aprovacao = $1
          AND l.paciente_id = $2
        `,
        [precisaAprovacao, pacienteId]
      );
      return result.rows;
    } catch (error) {
      console.error("Erro ao obter todas as lesões:", error);
    }
  },

  async getLesaoComNomes(id) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // 1. Lesão principal
      const lesaoRes = await client.query(
        `SELECT * FROM lesoes WHERE id = $1`,
        [id]
      );
      const lesaoData = lesaoRes.rows[0];

      // 2. Relações com JOIN para obter nomes

      const etiologiasRes = await client.query(
        `SELECT e.nome FROM lesoes_etiologias le
         JOIN etiologias e ON e.id = le.etiologia_id
         WHERE le.lesao_id = $1`,
        [id]
      );

      const classificacoesLesaoPressaoRes = await client.query(
        `SELECT c.nome FROM lesoes_classificacoes_lesao_por_pressao lcl
         JOIN classificacoes_lesao_por_pressao c ON c.id = lcl.classificacao_id
         WHERE lcl.lesao_id = $1`,
        [id]
      );

      const bordasRes = await client.query(
        `SELECT b.nome FROM lesoes_bordas lb
         JOIN bordas b ON b.id = lb.borda_id
         WHERE lb.lesao_id = $1`,
        [id]
      );

      const classificacoesDorRes = await client.query(
        `SELECT c.nome FROM lesoes_classificacoes_dor lc
         JOIN classificacoes_dor c ON c.id = lc.classificacao_id
         WHERE lc.lesao_id = $1`,
        [id]
      );

      const regioesPerilesionaisRes = await client.query(
        `SELECT r.nome, lr.descricao_outro FROM lesoes_regioes_perilesionais lr
         JOIN regioes_perilesionais r ON r.id = lr.regiao_id
         WHERE lr.lesao_id = $1`,
        [id]
      );

      const estruturasNobresRes = await client.query(
        `SELECT e.nome, le.descricao_outro FROM lesoes_estruturas_nobres le
         JOIN estruturas_nobres e ON e.id = le.estrutura_id
         WHERE le.lesao_id = $1`,
        [id]
      );

      const protecoesRes = await client.query(
        `SELECT p.nome, lp.descricao_outro FROM lesoes_protecoes lp
         JOIN protecoes p ON p.id = lp.protecao_id
         WHERE lp.lesao_id = $1`,
        [id]
      );

      const desbridamentosRes = await client.query(
        `SELECT d.nome, ld.descricao_outro FROM lesoes_desbridamentos ld
         JOIN desbridamentos d ON d.id = ld.desbridamento_id
         WHERE ld.lesao_id = $1`,
        [id]
      );

      const limpezasRes = await client.query(
        `SELECT l.nome, ll.descricao_outro FROM lesoes_limpezas ll
         JOIN limpezas l ON l.id = ll.limpeza_id
         WHERE ll.lesao_id = $1`,
        [id]
      );

      const tecidosRes = await client.query(
        `SELECT lt.tecido_id, t.nome, lt.percentual FROM lesoes_tecidos lt
         JOIN tecidos t ON t.id = lt.tecido_id
         WHERE lt.lesao_id = $1`,
        [id]
      );

      const coberturasRes = await client.query(
        `SELECT lc.cobertura_id, c.nome, lc.quantidade FROM lesoes_coberturas lc
         JOIN coberturas c ON c.id = lc.cobertura_id
         WHERE lc.lesao_id = $1`,
        [id]
      );

      const tiposFechamentoCurativoRes = await client.query(
        `SELECT lfc.fechamento_curativo_id, tfc.nome, lfc.quantidade
         FROM lesoes_fechamento_curativo lfc
         JOIN tipos_fechamento_curativo tfc ON tfc.id = lfc.fechamento_curativo_id
         WHERE lfc.lesao_id = $1`,
        [id]
      );

      // Tratando campos "outro"
      const getOutro = (res) =>
        res.rows.find((r) => r.descricao_outro)?.descricao_outro || null;

      // Mapeando listas
      const mapNomes = (res) => res.rows.map((r) => r.nome);

      const tecidos = tecidosRes.rows.map((t) => ({
        id: t.tecido_id,
        nome: t.nome,
        valor: t.percentual,
      }));

      const coberturas = coberturasRes.rows.map((c) => ({
        id: c.cobertura_id,
        nome: c.nome,
        valor: c.quantidade,
      }));

      const tiposFechamentoCurativo = tiposFechamentoCurativoRes.rows.map(
        (f) => ({
          id: f.fechamento_curativo_id,
          nome: f.nome,
          valor: f.quantidade,
        })
      );

      await client.query("COMMIT");

      return {
        bordas: mapNomes(bordasRes),
        etiologias: mapNomes(etiologiasRes),
        classificacoesLesaoPressao: mapNomes(classificacoesLesaoPressaoRes),
        classificacoesDor: mapNomes(classificacoesDorRes),
        regioesPerilesionais: regioesPerilesionaisRes.rows.map((r) => r.nome),
        estruturasNobres: estruturasNobresRes.rows.map((r) => r.nome),
        protecoes: protecoesRes.rows.map((r) => r.nome),
        desbridamentos: desbridamentosRes.rows.map((r) => r.nome),
        limpezas: limpezasRes.rows.map((r) => r.nome),
        regiaoPerilesionalOutro: getOutro(regioesPerilesionaisRes),
        estruturaNobreOutro: getOutro(estruturasNobresRes),
        protecaoOutro: getOutro(protecoesRes),
        desbridamentoOutro: getOutro(desbridamentosRes),
        limpezaOutro: getOutro(limpezasRes),
        presencaTunel: lesaoData.presenca_tunel,
        dor: lesaoData.possui_dor,
        escalaNumericaDor: lesaoData.escala_numerica_dor,
        exsudato: await DadosFormLesao.getExsudatoNome(lesaoData.exsudato_id),
        tipoExsudato: await DadosFormLesao.getTipoExsudatoNome(
          lesaoData.tipo_exsudato_id
        ),
        odor: await DadosFormLesao.getOdorNome(lesaoData.odor_id),
        tamanho: {
          comprimento: lesaoData.comprimento,
          largura: lesaoData.largura,
          profundidade: lesaoData.profundidade,
        },
        dataProximaAvaliacao: lesaoData.data_proxima_avaliacao,
        tecidos,
        coberturas,
        tiposFechamentoCurativo,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Erro ao obter lesão:", err);
      throw err;
    } finally {
      client.release();
    }
  },

  async getLesaoComIds(id) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // 1. Obtendo os dados da tabela de lesões
      const lesaoRes = await client.query(
        `SELECT * FROM lesoes WHERE id = $1`,
        [id]
      );

      const lesaoData = lesaoRes.rows[0];

      // 2. Obtendo os dados dos relacionamentos
      // ETIOLOGIAS
      const etiologiasRes = await client.query(
        `SELECT etiologia_id FROM lesoes_etiologias WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // CLASSIFICAÇÃO LESÃO POR PRESSÃO
      const classificacoesLesaoPressaoRes = await client.query(
        `SELECT classificacao_id FROM lesoes_classificacoes_lesao_por_pressao WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // BORDAS
      const bordasRes = await client.query(
        `SELECT borda_id FROM lesoes_bordas WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // QUANTIFICAÇÕES DA DOR
      const classificacoesDorRes = await client.query(
        `SELECT classificacao_id FROM lesoes_classificacoes_dor WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // REGIÕES PERILESIONAIS
      const regioesPerilesionaisRes = await client.query(
        `SELECT regiao_id, descricao_outro FROM lesoes_regioes_perilesionais WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // ESTRUTURAS NOBRES
      const estruturasNobresRes = await client.query(
        `SELECT estrutura_id, descricao_outro FROM lesoes_estruturas_nobres WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // PROTEÇÕES
      const protecoesRes = await client.query(
        `SELECT protecao_id, descricao_outro FROM lesoes_protecoes WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // DESBRIDAMENTOS
      const desbridamentosRes = await client.query(
        `SELECT desbridamento_id, descricao_outro FROM lesoes_desbridamentos WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // LIMPEZAS
      const limpezasRes = await client.query(
        `SELECT limpeza_id, descricao_outro FROM lesoes_limpezas WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // TECIDOS
      const tecidosRes = await client.query(
        `SELECT tecido_id, percentual FROM lesoes_tecidos WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // COBERTURAS
      const coberturasRes = await client.query(
        `SELECT cobertura_id, quantidade FROM lesoes_coberturas WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // TIPOS FECHAMENTO CURATIVO
      const tiposFechamentoCurativoRes = await client.query(
        `SELECT fechamento_curativo_id, quantidade FROM lesoes_fechamento_curativo WHERE lesao_id = $1`,
        [lesaoData.id]
      );

      // Obtendo os ids das opções associadas a lesão
      const etiologiaIds = etiologiasRes.rows.map((e) => e.etiologia_id);
      const classificacaoLesaoPressaoIds =
        classificacoesLesaoPressaoRes.rows.map((e) => e.classificacao_id);
      const bordaIds = bordasRes.rows.map((e) => e.borda_id);
      const classificacaoDorIds = classificacoesDorRes.rows.map(
        (e) => e.classificacao_id
      );
      const regiaoPerilesionalIds = regioesPerilesionaisRes.rows.map(
        (e) => e.regiao_id
      );
      const estruturaNobreIds = estruturasNobresRes.rows.map(
        (e) => e.estrutura_id
      );
      const protecaoIds = protecoesRes.rows.map((e) => e.protecao_id);
      const desbridamentoIds = desbridamentosRes.rows.map(
        (e) => e.desbridamento_id
      );
      const limpezaIds = limpezasRes.rows.map((e) => e.limpeza_id);

      // Obtendo o valor informado nos campos que possuiam a opção 'Outro'
      const regiaoPerilesionalOutro = regioesPerilesionaisRes.rows.find(
        (item) => item.descricao_outro !== null
      )?.descricao_outro;
      const estruturaNobreOutro = estruturasNobresRes.rows.find(
        (item) => item.descricao_outro !== null
      )?.descricao_outro;
      const protecaoOutro = protecoesRes.rows.find(
        (item) => item.descricao_outro !== null
      )?.descricao_outro;
      const desbridamentoOutro = desbridamentosRes.rows.find(
        (item) => item.descricao_outro !== null
      )?.descricao_outro;
      const limpezaOutro = limpezasRes.rows.find(
        (item) => item.descricao_outro !== null
      )?.descricao_outro;

      // Obtendo os dados de tecidos, coberturas e tiposFechamentoCurativo
      const tecidos = await this.tecidosData(tecidosRes);
      const coberturas = await this.coberturasData(coberturasRes);
      const tiposFechamentoCurativo = await this.tiposFechamentoCurativoData(
        tiposFechamentoCurativoRes
      );

      await client.query("COMMIT");
      return {
        bordas: bordaIds,
        etiologias: etiologiaIds,
        etiologias: etiologiaIds,
        classificacoesLesaoPressao: classificacaoLesaoPressaoIds,
        classificacoesDor: classificacaoDorIds,
        regioesPerilesionais: regiaoPerilesionalIds,
        estruturasNobres: estruturaNobreIds,
        limpezas: limpezaIds,
        desbridamentos: desbridamentoIds,
        protecoes: protecaoIds,
        regiaoPerilesionalOutro: regiaoPerilesionalOutro,
        estruturaNobreOutro: estruturaNobreOutro,
        protecaoOutro: protecaoOutro,
        desbridamentoOutro: desbridamentoOutro,
        limpezaOutro: limpezaOutro,
        presencaTunel: lesaoData.presenca_tunel,
        dor: lesaoData.possui_dor,
        escalaNumericaDor: lesaoData.escala_numerica_dor,
        exsudato: lesaoData.exsudato_id,
        odor: lesaoData.odor_id,
        tipoExsudato: lesaoData.tipo_exsudato_id,
        tamanho: {
          comprimento: lesaoData.comprimento,
          largura: lesaoData.largura,
          profundidade: lesaoData.profundidade,
        },
        tecidos: tecidos,
        coberturas: coberturas,
        tiposFechamentoCurativo: tiposFechamentoCurativo,
        dataProximaAvaliacao: lesaoData.data_proxima_avaliacao,
      };
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Erro ao obter lesão:", err);
      throw err;
    } finally {
      client.release();
    }
  },

  async tecidosData(tecidosRes) {
    const resultados = await Promise.all(
      tecidosRes.rows.map(async (e) => {
        const nome = await DadosFormLesao.getTecidoNome(e.tecido_id);
        return {
          id: e.tecido_id,
          nome: nome,
          valor: e.percentual,
        };
      })
    );
    return resultados;
  },

  async coberturasData(coberturasRes) {
    const resultados = await Promise.all(
      coberturasRes.rows.map(async (e) => {
        const nome = await DadosFormLesao.getCoberturaNome(e.cobertura_id);
        return {
          id: e.cobertura_id,
          nome: nome,
          valor: e.quantidade,
        };
      })
    );
    return resultados;
  },

  async tiposFechamentoCurativoData(tiposFechamentoCurativoRes) {
    const resultados = await Promise.all(
      tiposFechamentoCurativoRes.rows.map(async (e) => {
        const nome = await DadosFormLesao.getTipoFechamentoCurativoNome(
          e.fechamento_curativo_id
        );
        return {
          id: e.fechamento_curativo_id,
          nome: nome,
          valor: e.quantidade,
        };
      })
    );
    return resultados;
  },

  async cadastrarLesao(cpfUsuario, idPaciente, dados) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // 1. Inserir Lesão
      const usuario = await Usuarios.getPorCPF(cpfUsuario);
      const tipoUsuario = await Usuarios.getTipoUsuario(usuario.tipo_id);
      const precisaAprovacao = tipoUsuario[0].nome === "Acadêmico";

      const lesaoRes = await client.query(
        `INSERT INTO lesoes (
          paciente_id, criado_por, modificado_por, aprovado_por,
          precisa_aprovacao, presenca_tunel, possui_dor, escala_numerica_dor,
          exsudato_id, tipo_exsudato_id, odor_id,
          comprimento, largura, profundidade, data_proxima_avaliacao
        ) VALUES (
          $1, $2, NULL, NULL, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        ) RETURNING id`,
        [
          idPaciente,
          cpfUsuario,
          precisaAprovacao,
          dados.presencaTunel,
          dados.dor,
          dados.escalaNumericaDor,
          dados.exsudato,
          dados.tipoExsudato,
          dados.odor,
          dados.tamanho.comprimento,
          dados.tamanho.largura,
          dados.tamanho.profundidade,
          dados.dataProximaAvaliacao,
        ]
      );

      const lesaoId = lesaoRes.rows[0].id;

      // 2. Inserir associações muitos-para-muitos
      // ETIOLOGIAS
      for (const etiologiaId of dados.etiologias) {
        await client.query(
          `INSERT INTO lesoes_etiologias (lesao_id, etiologia_id)
               VALUES ($1, $2)`,
          [lesaoId, etiologiaId]
        );
      }

      // CLASSIFICAÇÃO LESÃO POR PRESSÃO
      if (Array.isArray(dados.classificacoesLesaoPressao)) {
        for (const classificacaoId of dados.classificacoesLesaoPressao) {
          await client.query(
            `INSERT INTO lesoes_classificacoes_lesao_por_pressao (lesao_id, classificacao_id)
               VALUES ($1, $2)`,
            [lesaoId, classificacaoId]
          );
        }
      }

      // BORDAS
      for (const bordaId of dados.bordas) {
        await client.query(
          `INSERT INTO lesoes_bordas (lesao_id, borda_id)
               VALUES ($1, $2)`,
          [lesaoId, bordaId]
        );
      }

      // QUANTIFICAÇÕES DA DOR
      if (Array.isArray(dados.classificacoesDor)) {
        for (const classificacaoId of dados.classificacoesDor) {
          await client.query(
            `INSERT INTO lesoes_classificacoes_dor (lesao_id, classificacao_id)
               VALUES ($1, $2)`,
            [lesaoId, classificacaoId]
          );
        }
      }

      // REGIÕES PERILESIONAIS
      for (const regiaoId of dados.regioesPerilesionais) {
        const regiaoOutroId = await DadosFormLesao.getIdOpcaoOutro(
          "regioes_perilesionais"
        );
        const isOutro = regiaoOutroId === regiaoId;
        await client.query(
          `INSERT INTO lesoes_regioes_perilesionais (lesao_id, regiao_id, descricao_outro)
               VALUES (
                 $1,
                 $2,
                 $3
               )`,
          [lesaoId, regiaoId, isOutro ? dados.regiaoPerilesionalOutro : null]
        );
      }

      // ESTRUTURAS NOBRES
      for (const estruturaNobreId of dados.estruturasNobres) {
        const estruturaNobreOutroId = await DadosFormLesao.getIdOpcaoOutro(
          "estruturas_nobres"
        );

        const isOutro = estruturaNobreOutroId === estruturaNobreId;
        await client.query(
          `INSERT INTO lesoes_estruturas_nobres (lesao_id, estrutura_id, descricao_outro)
               VALUES (
                 $1,
                 $2,
                 $3
               )`,
          [
            lesaoId,
            estruturaNobreId,
            isOutro ? dados.estruturaNobreOutro : null,
          ]
        );
      }

      // PROTEÇÕES
      for (const protecaoId of dados.protecoes) {
        const protecaoOutroId = await DadosFormLesao.getIdOpcaoOutro(
          "protecoes"
        );
        const isOutro = protecaoOutroId === protecaoId;
        await client.query(
          `INSERT INTO lesoes_protecoes (lesao_id, protecao_id, descricao_outro)
               VALUES (
                 $1,
                 $2,
                 $3
               )`,
          [lesaoId, protecaoId, isOutro ? dados.protecaoOutro : null]
        );
      }

      // DESBRIDAMENTOS
      for (const desbridamentoId of dados.desbridamentos) {
        const desbridamentoOutroId = await DadosFormLesao.getIdOpcaoOutro(
          "desbridamentos"
        );
        const isOutro = desbridamentoOutroId === desbridamentoId;
        await client.query(
          `INSERT INTO lesoes_desbridamentos (lesao_id, desbridamento_id, descricao_outro)
               VALUES (
                 $1,
                 $2,
                 $3
               )`,
          [lesaoId, desbridamentoId, isOutro ? dados.desbridamentoOutro : null]
        );
      }

      // LIMPEZAS
      for (const limpezaId of dados.limpezas) {
        const limpezaOutroId = await DadosFormLesao.getIdOpcaoOutro("limpezas");
        const isOutro = limpezaOutroId === limpezaId;
        await client.query(
          `INSERT INTO lesoes_limpezas (lesao_id, limpeza_id, descricao_outro)
               VALUES (
                 $1,
                 $2,
                 $3
               )`,
          [lesaoId, limpezaId, isOutro ? dados.limpezaOutro : null]
        );
      }

      // 3. Inserir Coberturas, Tecidos e Tipos de Fechamento de Curativo
      // TECIDOS
      for (const tecido of dados.tecidos) {
        await client.query(
          `INSERT INTO lesoes_tecidos (lesao_id, tecido_id, percentual)
               VALUES (
                 $1,
                 $2,
                 $3
               )`,
          [lesaoId, tecido.id, tecido.valor]
        );
      }

      // COBERTURAS
      for (const cobertura of dados.coberturas) {
        await client.query(
          `INSERT INTO lesoes_coberturas (lesao_id, cobertura_id, quantidade)
               VALUES (
                 $1,
                 $2,
                 $3
               )`,
          [lesaoId, cobertura.id, cobertura.valor]
        );
      }

      // TIPOS FECHAMENTO CURATIVO
      for (const tipoFechamentoCurativo of dados.tiposFechamentoCurativo) {
        await client.query(
          `INSERT INTO lesoes_fechamento_curativo (lesao_id, fechamento_curativo_id, quantidade)
               VALUES (
                 $1,
                 $2,
                 $3
               )`,
          [lesaoId, tipoFechamentoCurativo.id, tipoFechamentoCurativo.valor]
        );
      }

      await client.query("COMMIT");
      return lesaoId;
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Erro ao inserir lesão:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  async atualizarLesao(cpfUsuario, lesaoId, dados) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // 1. Atualizando a lesão
      await client.query(
        `UPDATE lesoes
         SET modificado_por = $1,
             presenca_tunel = $2,
             possui_dor = $3,
             escala_numerica_dor = $4,
             exsudato_id = $5,
             tipo_exsudato_id = $6,
             odor_id = $7,
             comprimento = $8,
             largura = $9,
             profundidade = $10,
             data_proxima_avaliacao = $11
         WHERE id = $12`,
        [
          cpfUsuario,
          dados.presencaTunel,
          dados.dor,
          dados.escalaNumericaDor,
          dados.exsudato,
          dados.tipoExsudato,
          dados.odor,
          dados.tamanho.comprimento,
          dados.tamanho.largura,
          dados.tamanho.profundidade,
          dados.dataProximaAvaliacao,
          lesaoId,
        ]
      );

      // 2. Atualizando associações muitos-para-muitos
      // ETIOLOGIAS
      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_etiologias",
        campoId: "etiologia_id",
        dadosSelecionados: dados.etiologias,
        lesaoId,
      });

      // CLASSIFICAÇÕES LESÃO POR PRESSÃO
      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_classificacoes_lesao_por_pressao",
        campoId: "classificacao_id",
        dadosSelecionados: dados.classificacoesLesaoPressao,
        lesaoId,
      });

      // REGIÕES PERILESIONAIS
      // Encontrar o id da opção cujo nome é 'Outro'
      const idOutroRegiaoPerilesional = await DadosFormLesao.getIdOpcaoOutro(
        "regioes_perilesionais"
      );

      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_regioes_perilesionais",
        campoId: "regiao_id",
        dadosSelecionados: dados.regioesPerilesionais,
        lesaoId,
        idOutro: idOutroRegiaoPerilesional,
        descricaoOutro: dados.regiaoPerilesionalOutro,
      });

      // BORDAS
      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_bordas",
        campoId: "borda_id",
        dadosSelecionados: dados.bordas,
        lesaoId,
      });

      // QUANTIFICAÇÕES DE DOR
      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_classificacoes_dor",
        campoId: "classificacao_id",
        dadosSelecionados: dados.classificacoesDor,
        lesaoId,
      });

      // ESTRUTURAS NOBRES
      // Encontrar o id da opção cujo nome é 'Outro'
      const idOutroEstruturaNobre = await DadosFormLesao.getIdOpcaoOutro(
        "estruturas_nobres"
      );

      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_estruturas_nobres",
        campoId: "estrutura_id",
        dadosSelecionados: dados.estruturasNobres,
        lesaoId,
        idOutro: idOutroEstruturaNobre,
        descricaoOutro: dados.estruturaNobreOutro,
      });

      // LIMPEZAS
      // Encontrar o id da opção cujo nome é 'Outro'
      const idOutroLimpeza = await DadosFormLesao.getIdOpcaoOutro("limpezas");

      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_limpezas",
        campoId: "limpeza_id",
        dadosSelecionados: dados.limpezas,
        lesaoId,
        idOutro: idOutroLimpeza,
        descricaoOutro: dados.limpezaOutro,
      });

      // DESBRIDAMENTOS
      // Encontrar o id da opção cujo nome é 'Outro'
      const idOutroDesbridamento = await DadosFormLesao.getIdOpcaoOutro(
        "desbridamentos"
      );

      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_desbridamentos",
        campoId: "desbridamento_id",
        dadosSelecionados: dados.desbridamentos,
        lesaoId,
        idOutro: idOutroDesbridamento,
        descricaoOutro: dados.desbridamentoOutro,
      });

      // PROTEÇÕES
      // Encontrar o id da opção cujo nome é 'Outro'
      const idOutroProtecao = await DadosFormLesao.getIdOpcaoOutro("protecoes");

      await this.atualizarRelacionamentoCheckbox({
        client,
        tabela: "lesoes_protecoes",
        campoId: "protecao_id",
        dadosSelecionados: dados.protecoes,
        lesaoId,
        idOutro: idOutroProtecao,
        descricaoOutro: dados.protecaoOutro,
      });

      // 3. Atualizando Tecidos, Cobertutas e Tipos de Fechamento de Curativo
      // TECIDOS
      for (const tecido of dados.tecidos) {
        await client.query(
          `UPDATE lesoes_tecidos
           SET percentual = $1
           WHERE lesao_id = $2 AND tecido_id = $3`,
          [tecido.valor, lesaoId, tecido.id]
        );
      }

      // COBERTURAS
      for (const cobertura of dados.coberturas) {
        await client.query(
          `UPDATE lesoes_coberturas
           SET quantidade = $1
           WHERE lesao_id = $2 AND cobertura_id = $3`,
          [cobertura.valor, lesaoId, cobertura.id]
        );
      }

      // TIPOS FECHAMENTO CURATIVO
      for (const tipoFechamentoCurativo of dados.tiposFechamentoCurativo) {
        await client.query(
          `UPDATE lesoes_fechamento_curativo
           SET quantidade = $1
           WHERE lesao_id = $2 AND fechamento_curativo_id = $3`,
          [tipoFechamentoCurativo.valor, lesaoId, tipoFechamentoCurativo.id]
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Erro ao inserir lesão:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  async atualizarRelacionamentoCheckbox({
    client,
    tabela,
    campoId,
    dadosSelecionados,
    lesaoId,
    idOutro = null,
    descricaoOutro = null,
  }) {
    const res = await client.query(
      `SELECT ${campoId} FROM ${tabela} WHERE lesao_id = $1`,
      [lesaoId]
    );

    const idsExistentes = res.rows.map((r) => r[campoId]);

    // Adicionar novos
    for (const id of dadosSelecionados) {
      const jaExiste = idsExistentes.includes(id);

      if (!jaExiste) {
        if (idOutro !== null && id === idOutro && descricaoOutro) {
          // Inserção com descrição_outro
          await client.query(
            `INSERT INTO ${tabela} (lesao_id, ${campoId}, descricao_outro) VALUES ($1, $2, $3)`,
            [lesaoId, id, descricaoOutro]
          );
        } else {
          // Inserção comum
          await client.query(
            `INSERT INTO ${tabela} (lesao_id, ${campoId}) VALUES ($1, $2)`,
            [lesaoId, id]
          );
        }
      }
    }

    // Remover os que não estão mais selecionados
    for (const id of idsExistentes) {
      if (!dadosSelecionados.includes(id)) {
        await client.query(
          `DELETE FROM ${tabela} WHERE lesao_id = $1 AND ${campoId} = $2`,
          [lesaoId, id]
        );
      }
    }

    // Atualizar descrição_outro se necessário
    if (
      idOutro !== null &&
      dadosSelecionados.includes(idOutro) &&
      descricaoOutro
    ) {
      await client.query(
        `UPDATE ${tabela} SET descricao_outro = $1 WHERE lesao_id = $2 AND ${campoId} = $3`,
        [descricaoOutro, lesaoId, idOutro]
      );
    }
  },
};

export default LesaoModel;
