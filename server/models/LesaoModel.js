import db from "../config/db.js";
import Usuarios from "./UserModel.js";

const LesaoModel = {
  async obterTodasLesoesPacientes(idPaciente, cadastradoPorAcademico) {
    try {
      const result = await db.query(
        "SELECT * FROM lesoes WHERE id_paciente = $1 AND cadastrado_por_academico = $2",
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
      // Buscar dados principais da lesão com campos explicitados para evitar conflito
      const res = await client.query(
        `
            SELECT 
              l.*, 
              t.id AS tecido_id, t.epitelizado, t.granulacao, t.hipergranulacao, 
              t.necrose_seca, t.necrose_umida, t.esfacelo,
              c.age, c.alginato_calcio_prata_placa, c.alginato_calcio_prata_fita,
              c.alginato_calcio_fita, c.bota_unna AS c_bota_unna, c.carvao_ativado_prata, 
              c.cinto_estomia, c.espuma_prata_grande, c.espuma_prata_pequena,
              c.espuma_silicone_prata_grande, c.espuma_silicone_pequena,
              c.hidrofibra_prata, c.hidrogel, c.melolin, c.membracel, 
              c.pasta_hidrocoloide, c.phmb_gel, c.placa_hidrocoloide_fina, 
              c.placa_hidrocoloide_grossa, c.prata_nanocristalina, c.rayon_petrolatum, 
              c.filtro_carvao_ativado, c.hidrocoloide_bastao, c.pasta_periestomal,
              f.pelicula_transparente_rolo_curativos, f.bota_unna AS f_bota_unna,
              f.rede_tubular_3, f.rede_tubular_6, f.chumaco_atadura
            FROM lesoes l
            LEFT JOIN tecidos t ON l.tecido_id = t.id
            LEFT JOIN cobertura_utilizada c ON l.cobertura_utilizada_id = c.id
            LEFT JOIN fechamento_curativo f ON l.fechamento_curativo_id = f.id
            WHERE l.id = $1
          `,
        [id]
      );

      if (res.rowCount === 0) {
        throw new Error("Lesão não encontrada");
      }

      const lesao = res.rows[0];

      // Função auxiliar para buscar nomes de tabelas relacionadas
      const fetchRelacionamento = async (
        tabela,
        coluna,
        colunaRelacionamento
      ) => {
        const result = await client.query(
          `
              SELECT r.${coluna} FROM ${tabela} r
              JOIN lesoes_${tabela} lr ON lr.${colunaRelacionamento} = r.id
              WHERE lr.lesao_id = $1
            `,
          [id]
        );
        return result.rows.map((row) => row[coluna]);
      };

      const fetchEstruturasNobres = async () => {
        const result = await client.query(
          `
            SELECT en.nome
            FROM estruturas_nobres en
            JOIN tecidos_estruturas_nobres ten ON ten.estrutura_id = en.id
            JOIN tecidos t ON t.id = ten.tecido_id
            WHERE t.id = $1
          `,
          [lesao.tecido_id]
        );
        return result.rows.map((row) => row.nome);
      };

      const [
        etiologias,
        classificacoesLesaoPressao,
        regioesPerilesionais,
        bordas,
        quantificacoesDor,
        estruturasNobres,
      ] = await Promise.all([
        fetchRelacionamento("etiologias", "nome", "etiologia_id"),
        fetchRelacionamento(
          "classificacoes_lesao_por_pressao",
          "nome",
          "classificacao_id"
        ),
        fetchRelacionamento("regioes_perilesionais", "nome", "regiao_id"),
        fetchRelacionamento("bordas", "nome", "borda_id"),
        fetchRelacionamento("quantificacoes_dor", "nome", "quantificacao_id"),
        fetchEstruturasNobres(),
      ]);

      // Buscar descrição_outro da região perilesional
      const regiaoOutroRes = await client.query(
        `
            SELECT descricao_outro FROM lesoes_regioes_perilesionais
            WHERE lesao_id = $1 AND descricao_outro IS NOT NULL LIMIT 1
          `,
        [id]
      );
      const outraRegiaoPerilesional =
        regiaoOutroRes.rows[0]?.descricao_outro ?? null;

      // Buscar descrição_outro da estrutura nobre
      const estruturaOutroRes = await client.query(
        `
            SELECT descricao_outro FROM tecidos_estruturas_nobres
            WHERE tecido_id = $1 AND descricao_outro IS NOT NULL LIMIT 1
          `,
        [lesao.tecido_id]
      );
      const outraEstruturaNobre =
        estruturaOutroRes.rows[0]?.descricao_outro ?? null;

      // Buscar exsudato, tipo exsudato e odor
      const exsudato = await client.query(
        `SELECT nome FROM exsudatos WHERE id = $1`,
        [lesao.exsudato]
      );

      const tipoExsudato = await client.query(
        `SELECT nome FROM tipos_exsudato WHERE id = $1`,
        [lesao.tipo_exsudato]
      );

      const odor = await client.query(`SELECT nome FROM odores WHERE id = $1`, [
        lesao.odor,
      ]);

      return {
        etiologias,
        classificacoesLesaoPressao,
        regioesPerilesionais,
        outraRegiaoPerilesional,
        bordas,
        tecido: {
          estruturasNobres,
          outraEstruturaNobre,
          epitelizado: lesao.epitelizado,
          granulacao: lesao.granulacao,
          hipergranulacao: lesao.hipergranulacao,
          necroseSeca: lesao.necrose_seca,
          necroseUmida: lesao.necrose_umida,
          esfacelo: lesao.esfacelo,
        },
        dor: lesao.possui_dor,
        nivelDor: lesao.escala_dor,
        quantificacoesDor,
        exsudato: exsudato.rows[0].nome,
        tipoExsudato: tipoExsudato.rows[0].nome,
        odor: odor.rows[0].nome,
        tamanho: {
          comprimento: lesao.comprimento,
          largura: lesao.largura,
          profundidade: lesao.profundidade,
        },
        coberturaUtilizada: {
          age: lesao.age,
          alginatoCalcioPrataPlaca: lesao.alginato_calcio_prata_placa,
          alginatoCalcioPrataFita: lesao.alginato_calcio_prata_fita,
          alginatoCalcioFita: lesao.alginato_calcio_fita,
          botaUnna: lesao.c_bota_unna,
          carvaoAtivadoPrata: lesao.carvao_ativado_prata,
          cintoEstomia: lesao.cinto_estomia,
          espumaPrataGrande: lesao.espuma_prata_grande,
          espumaPrataPequena: lesao.espuma_prata_pequena,
          espumaSiliconePrataGrande: lesao.espuma_silicone_prata_grande,
          espumaSiliconePequena: lesao.espuma_silicone_pequena,
          hidrofibraPrata: lesao.hidrofibra_prata,
          hidrogel: lesao.hidrogel,
          melolin: lesao.melolin,
          membracel: lesao.membracel,
          pastaHidrocoloide: lesao.pasta_hidrocoloide,
          phmbGel: lesao.phmb_gel,
          placaHidrocoloideFina: lesao.placa_hidrocoloide_fina,
          placaHidrocoloideGrossa: lesao.placa_hidrocoloide_grossa,
          prataNanocristalina: lesao.prata_nanocristalina,
          rayonPetrolatum: lesao.rayon_petrolatum,
          filtroCarvaoAtivado: lesao.filtro_carvao_ativado,
          hidrocoloideBastao: lesao.hidrocoloide_bastao,
          pastaPeriestomal: lesao.pasta_periestomal,
        },
        fechamentoCurativo: {
          peliculaTransparenteRoloCurativos:
            lesao.pelicula_transparente_rolo_curativos,
          botaUnna: lesao.f_bota_unna,
          redeTubular3: lesao.rede_tubular_3,
          redeTubular6: lesao.rede_tubular_6,
          chumacoAtadura: lesao.chumaco_atadura,
        },
      };
    } catch (err) {
      console.error("Erro ao obter lesão:", err);
      throw err;
    } finally {
      client.release();
    }
  },

  async cadastrarLesao(cpfUsuario, idPaciente, dados) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      // 1. Inserir tecido
      const tecidoRes = await client.query(
        `INSERT INTO tecidos (
              epitelizado, granulacao, hipergranulacao,
              necrose_seca, necrose_umida, esfacelo
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          dados.tecido.epitelizado,
          dados.tecido.granulacao,
          dados.tecido.hipergranulacao,
          dados.tecido.necroseSeca,
          dados.tecido.necroseUmida,
          dados.tecido.esfacelo,
        ]
      );
      const tecidoId = tecidoRes.rows[0].id;

      // 2. Inserir cobertura utilizada
      const c = dados.coberturaUtilizada;
      const coberturaRes = await db.query(
        `INSERT INTO cobertura_utilizada (
              age, alginato_calcio_prata_placa, alginato_calcio_prata_fita, alginato_calcio_fita,
              bota_unna, carvao_ativado_prata, cinto_estomia, espuma_prata_grande, espuma_prata_pequena,
              espuma_silicone_prata_grande, espuma_silicone_pequena, hidrofibra_prata, hidrogel, melolin,
              membracel, pasta_hidrocoloide, phmb_gel, placa_hidrocoloide_fina, placa_hidrocoloide_grossa,
              prata_nanocristalina, rayon_petrolatum, filtro_carvao_ativado, hidrocoloide_bastao, pasta_periestomal
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
              $21, $22, $23, $24
            ) RETURNING id`,
        Object.values(c)
      );
      const coberturaId = coberturaRes.rows[0].id;

      // 3. Inserir fechamento do curativo
      const f = dados.fechamentoCurativo;
      const fechamentoRes = await client.query(
        `INSERT INTO fechamento_curativo (
              pelicula_transparente_rolo_curativos, bota_unna,
              rede_tubular_3, rede_tubular_6, chumaco_atadura
            ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [
          f.peliculaTransparenteRoloCurativos,
          f.botaUnna,
          f.redeTubular3,
          f.redeTubular6,
          f.chumacoAtadura,
        ]
      );
      const fechamentoId = fechamentoRes.rows[0].id;

      // 4. Inserir lesão
      const usuario = await Usuarios.buscarPorCPF(cpfUsuario);
      const cadastradoPorAcademico = usuario.tipo == "Acadêmico";
      const lesaoRes = await client.query(
        `INSERT INTO lesoes (
              id_paciente, criado_por, modificado_por, aprovado_por,
              cadastrado_por_academico, possui_dor, escala_dor,
              exsudato, tipo_exsudato, odor,
              comprimento, largura, profundidade,
              tecido_id, cobertura_utilizada_id, fechamento_curativo_id
            ) VALUES (
              $1, $2, NULL, NULL,
              $3, $4, $5,
              (SELECT id FROM exsudatos WHERE nome = $6),
              (SELECT id FROM tipos_exsudato WHERE nome = $7),
              (SELECT id FROM odores WHERE nome = $8),
              $9, $10, $11,
              $12, $13, $14
            ) RETURNING id`,
        [
          idPaciente,
          cpfUsuario,
          cadastradoPorAcademico,
          dados.dor,
          dados.nivelDor ?? null,
          dados.exsudato,
          dados.tipoExsudato,
          dados.odor,
          dados.tamanho.comprimento,
          dados.tamanho.largura,
          dados.tamanho.profundidade,
          tecidoId,
          coberturaId,
          fechamentoId,
        ]
      );
      const lesaoId = lesaoRes.rows[0].id;

      // 5. Inserir associações muitos-para-muitos
      // ETIOLOGIAS
      for (const nome of dados.etiologias) {
        await client.query(
          `INSERT INTO lesoes_etiologias (lesao_id, etiologia_id)
               VALUES ($1, (SELECT id FROM etiologias WHERE nome = $2))`,
          [lesaoId, nome]
        );
      }

      // CLASSIFICAÇÃO LESÃO POR PRESSÃO
      if (Array.isArray(dados.classificacoesLesaoPressao)) {
        for (const nome of dados.classificacoesLesaoPressao) {
          await client.query(
            `INSERT INTO lesoes_classificacoes_lesao_por_pressao (lesao_id, classificacao_id)
               VALUES ($1, (SELECT id FROM classificacoes_lesao_por_pressao WHERE nome = $2))`,
            [lesaoId, nome]
          );
        }
      }

      // REGIÕES PERILESIONAIS
      for (const nome of dados.regioesPerilesionais) {
        const isOutro = nome === "Outro";
        await client.query(
          `INSERT INTO lesoes_regioes_perilesionais (lesao_id, regiao_id, descricao_outro)
               VALUES (
                 $1,
                 (SELECT id FROM regioes_perilesionais WHERE nome = $2),
                 $3
               )`,
          [lesaoId, nome, isOutro ? dados.outraRegiaoPerilesional : null]
        );
      }

      // BORDAS
      for (const nome of dados.bordas) {
        await client.query(
          `INSERT INTO lesoes_bordas (lesao_id, borda_id)
               VALUES ($1, (SELECT id FROM bordas WHERE nome = $2))`,
          [lesaoId, nome]
        );
      }

      // QUANTIFICAÇÕES DA DOR
      if (Array.isArray(dados.quantificacoesDor)) {
        for (const nome of dados.quantificacoesDor) {
          await client.query(
            `INSERT INTO lesoes_quantificacoes_dor (lesao_id, quantificacao_id)
               VALUES ($1, (SELECT id FROM quantificacoes_dor WHERE nome = $2))`,
            [lesaoId, nome]
          );
        }
      }

      // ESTRUTURAS NOBRES
      for (const nome of dados.tecido.estruturasNobres) {
        const isOutro = nome === "Outro";
        await client.query(
          `INSERT INTO tecidos_estruturas_nobres (tecido_id, estrutura_id, descricao_outro)
               VALUES (
                 $1,
                 (SELECT id FROM estruturas_nobres WHERE nome = $2),
                 $3
               )`,
          [tecidoId, nome, isOutro ? dados.tecido.outraEstruturaNobre : null]
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

      // 1. Atualizar os dados simples da lesão na tabela lesoes
      // Pega os IDs relacionados (exsudato, tipo_exsudato, odor) a partir dos nomes enviados em dados
      const exsudatoId = await getIdByName(client, "exsudatos", dados.exsudato);
      const tipoExsudatoId = await getIdByName(
        client,
        "tipos_exsudato",
        dados.tipoExsudato
      );
      const odorId = await getIdByName(client, "odores", dados.odor);

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Erro ao inserir lesão:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Função auxiliar para buscar ID pelo nome
  async getIdByName(client, tabela, nome) {
    const res = await client.query(`SELECT id FROM ${tabela} WHERE nome = $1`, [
      nome,
    ]);
    return res.rows.length ? res.rows[0].id : null;
  },
};

export default LesaoModel;
