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

  async obterTodasLesoesPacientes(idPaciente, cadastradoPorAcademico) {
    try {
      const result = await db.query(
        "SELECT * FROM lesoes WHERE paciente_id = $1 AND cadastrado_por_academico = $2",
        [idPaciente, cadastradoPorAcademico]
      );
      return result.rows;
    } catch (error) {
      console.error("Erro ao obter todas as lesões:", error);
    }
  },

  async obterLesao(id) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      // 1. Obtendo os dados da tabela de lesões
      const lesaoRes = await client.query(
        `SELECT * FROM lesoes WHERE id = $1`,
        [id]
      );

      const lesaoData = lesaoRes.rows[0];
      console.log(lesaoData);
      console.log(lesaoData.id);

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
      const quantificacoesDorRes = await client.query(
        `SELECT quantificacao_id FROM lesoes_quantificacoes_dor WHERE lesao_id = $1`,
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
        `SELECT desbridamento_id, descricao_outro FROM lesoes_desbridamento WHERE lesao_id = $1`,
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
      const quantificacaoDorIds = quantificacoesDorRes.rows.map(
        (e) => e.quantificacao_id
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
        quantificacoesDor: quantificacaoDorIds,
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
        nivelDor: lesaoData.escala_dor,
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
      const usuario = await Usuarios.buscarPorCPF(cpfUsuario);
      const tipoUsuario = await Usuarios.buscarTipoUsuario(usuario.tipo_id);
      const cadastradoPorAcademico = tipoUsuario[0].nome === "Acadêmico";

      const lesaoRes = await client.query(
        `INSERT INTO lesoes (
          paciente_id, criado_por, modificado_por, aprovado_por,
          cadastrado_por_academico, presenca_tunel, possui_dor, escala_dor,
          exsudato_id, tipo_exsudato_id, odor_id,
          comprimento, largura, profundidade
        ) VALUES (
          $1, $2, NULL, NULL, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        ) RETURNING id`,
        [
          idPaciente,
          cpfUsuario,
          cadastradoPorAcademico,
          dados.presencaTunel,
          dados.dor,
          dados.nivelDor,
          dados.exsudato,
          dados.tipoExsudato,
          dados.odor,
          dados.tamanho.comprimento,
          dados.tamanho.largura,
          dados.tamanho.profundidade,
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
      if (Array.isArray(dados.quantificacoesDor)) {
        for (const quantificacaoId of dados.quantificacoesDor) {
          await client.query(
            `INSERT INTO lesoes_quantificacoes_dor (lesao_id, quantificacao_id)
               VALUES ($1, $2)`,
            [lesaoId, quantificacaoId]
          );
        }
      }

      // REGIÕES PERILESIONAIS
      for (const regiaoId of dados.regioesPerilesionais) {
        const regiao = await DadosFormLesao.getRegiaoPerilesional(regiaoId);
        const isOutro = regiao[0].nome === "Outro";
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
        const estruturaNobre = await DadosFormLesao.getEstruturaNobre(
          estruturaNobreId
        );

        const isOutro = estruturaNobre[0].nome === "Outro";
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
        const protecao = await DadosFormLesao.getProtecao(protecaoId);
        const isOutro = protecao.nome === "Outro";
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
        const desbridamento = await DadosFormLesao.getDesbridamento(
          desbridamentoId
        );
        const isOutro = desbridamento.nome === "Outro";
        await client.query(
          `INSERT INTO lesoes_desbridamento (lesao_id, desbridamento_id, descricao_outro)
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
        const limpeza = await DadosFormLesao.getLimpeza(limpezaId);
        const isOutro = limpeza.nome === "Outro";
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

  async atualizarLesao(cpfUsuario, idLesao, dados) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Erro ao inserir lesão:", error);
      throw error;
    } finally {
      client.release();
    }
  },
};

export default LesaoModel;
