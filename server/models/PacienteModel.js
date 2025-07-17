import db from "../config/db.js";

class PacienteModel {
  async getPacientes() {
    // Obter dados dos pacientes cadastrados no AGHU
    const result = await db.query(`
      SELECT
        A.seq AS "internação",
        A.pac_codigo,
        C.nome,
        TO_CHAR(C.dt_nascimento, 'DD/MM/YYYY') AS "nascimento",
        C.cor,
        C.sexo,
        D.altura AS "Altura Consulta",
        E.peso AS "Peso Consulta",
        F.medicao AS "Altura Controle",
        G.medicao AS "Peso Controle",
        B.qrt_numero,
        B.lto_lto_id,
        H.criticidade_alergica,
        H.grau_certeza,
        J.descricao AS "Medicamento",
        H.agente_causador,
        I.descricao AS "Classificação Alergica"
      FROM agh.ain_internacoes AS A
      LEFT JOIN (
        SELECT 
          qrt_numero, 
          lto_lto_id,
          int_seq 
        FROM agh.ain_movimentos_internacao
        WHERE criado_em = (
          SELECT MAX(criado_em) 
          FROM agh.ain_movimentos_internacao AS mov 
          WHERE mov.int_seq = ain_movimentos_internacao.int_seq
        )
      ) AS B ON A.seq = B.int_seq
      LEFT JOIN agh.aip_pacientes AS C ON C.codigo = A.pac_codigo
      LEFT JOIN agh.aip_altura_pacientes AS D ON D.pac_codigo = A.pac_codigo
      LEFT JOIN agh.aip_peso_pacientes AS E ON E.pac_codigo = A.pac_codigo
      LEFT JOIN (
        SELECT
          X.pac_codigo,
          Y.medicao
        FROM agh.ecp_horario_controles X
        LEFT JOIN agh.ecp_controle_pacientes AS Y ON Y.hct_seq = X.seq
        WHERE 
          Y.ice_seq IN (20445, 20388, 26) AND  
          X.criado_em = (
            SELECT MAX(criado_em) 
            FROM agh.ecp_horario_controles AS controle 
            WHERE controle.pac_codigo = X.pac_codigo
          )
      ) AS F ON F.pac_codigo = A.pac_codigo
      LEFT JOIN (
        SELECT
          X.pac_codigo,
          Y.medicao
        FROM agh.ecp_horario_controles X
        LEFT JOIN agh.ecp_controle_pacientes AS Y ON Y.hct_seq = X.seq
        WHERE 
          Y.ice_seq IN (20387, 20436, 27) AND  
          X.criado_em = (
            SELECT MAX(criado_em) 
            FROM agh.ecp_horario_controles AS controle 
            WHERE controle.pac_codigo = X.pac_codigo
          )
      ) AS G ON G.pac_codigo = A.pac_codigo
      LEFT JOIN agh.aip_alergia_pacientes H ON H.pac_codigo = A.pac_codigo
      LEFT JOIN agh.mpm_alergia_usuais I ON H.aus_seq = I.seq
      LEFT JOIN agh.afa_medicamentos J ON J.mat_codigo = H.med_codigo
      WHERE A.dthr_alta_medica IS NULL
    `);

    // Insere ou Atualiza os dados dos pacientes na tabela auxiliar
    for (const row of result.rows) {
      const pacienteExistente = await db.query(
        `
        SELECT * FROM pacientes_aux WHERE pac_codigo = $1
      `,
        [row.pac_codigo]
      );

      if (pacienteExistente.rowCount === 0) {
        // INSERT
        await db.query(
          `
          INSERT INTO pacientes_aux (
            internacao, pac_codigo, nome, nascimento, cor, sexo,
            altura_consulta, peso_consulta, altura_controle, peso_controle,
            qrt_numero, lto_lto_id, criticidade_alergica, grau_certeza,
            medicamento, agente_causador, classificacao_alergica
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10,
            $11, $12, $13, $14,
            $15, $16, $17
          )
        `,
          [
            row["internação"],
            row.pac_codigo,
            row.nome,
            row.nascimento,
            row.cor,
            row.sexo,
            row["Altura Consulta"],
            row["Peso Consulta"],
            row["Altura Controle"],
            row["Peso Controle"],
            row.qrt_numero,
            row.lto_lto_id,
            row.criticidade_alergica,
            row.grau_certeza,
            row["Medicamento"],
            row.agente_causador,
            row["Classificação Alergica"],
          ]
        );
      } else {
        // UPDATE (se houver mudanças)
        const p = pacienteExistente.rows[0];

        const hasDiff =
          p.internacao !== row["internação"] ||
          p.nome !== row.nome ||
          p.nascimento !== row.nascimento ||
          p.cor !== row.cor ||
          p.sexo !== row.sexo ||
          p.altura_consulta !== row["Altura Consulta"] ||
          p.peso_consulta !== row["Peso Consulta"] ||
          p.altura_controle !== row["Altura Controle"] ||
          p.peso_controle !== row["Peso Controle"] ||
          p.qrt_numero !== row.qrt_numero ||
          p.lto_lto_id !== row.lto_lto_id ||
          p.criticidade_alergica !== row.criticidade_alergica ||
          p.grau_certeza !== row.grau_certeza ||
          p.medicamento !== row["Medicamento"] ||
          p.agente_causador !== row.agente_causador ||
          p.classificacao_alergica !== row["Classificação Alergica"];

        if (hasDiff) {
          await db.query(
            `
            UPDATE pacientes_aux SET
              internacao = $1,
              nome = $2,
              nascimento = $3,
              cor = $4,
              sexo = $5,
              altura_consulta = $6,
              peso_consulta = $7,
              altura_controle = $8,
              peso_controle = $9,
              qrt_numero = $10,
              lto_lto_id = $11,
              criticidade_alergica = $12,
              grau_certeza = $13,
              medicamento = $14,
              agente_causador = $15,
              classificacao_alergica = $16,
              data_sincronizacao = CURRENT_TIMESTAMP
            WHERE pac_codigo = $17
          `,
            [
              row["internação"],
              row.nome,
              row.nascimento,
              row.cor,
              row.sexo,
              row["Altura Consulta"],
              row["Peso Consulta"],
              row["Altura Controle"],
              row["Peso Controle"],
              row.qrt_numero,
              row.lto_lto_id,
              row.criticidade_alergica,
              row.grau_certeza,
              row["Medicamento"],
              row.agente_causador,
              row["Classificação Alergica"],
              row.pac_codigo,
            ]
          );
        }
      }
    }

    const pacientes = await db.query(`SELECT * FROM pacientes_aux`);

    return pacientes.rows;
  }

  async getPaciente(pac_codigo) {
    // Obter dados do paciente
    const result = await db.query(
      `SELECT * FROM pacientes_aux WHERE pac_codigo = $1`,
      [pac_codigo]
    );

    return result.rows[0];
  }

  async atualizarPaciente(pac_codigo, dadosAtualizados) {
    // Atualizar dados do paciente
    const {
      internacao,
      nome,
      nascimento,
      cor,
      sexo,
      altura_consulta,
      peso_consulta,
      altura_controle,
      peso_controle,
      qrt_numero,
      lto_lto_id,
      criticidade_alergica,
      grau_certeza,
      medicamento,
      agente_causador,
      classificacao_alergica,
    } = dadosAtualizados;

    const result = await db.query(
      `
      UPDATE pacientes_aux SET
        internacao = $1,
        nome = $2,
        nascimento = $3,
        cor = $4,
        sexo = $5,
        altura_consulta = $6,
        peso_consulta = $7,
        altura_controle = $8,
        peso_controle = $9,
        qrt_numero = $10,
        lto_lto_id = $11,
        criticidade_alergica = $12,
        grau_certeza = $13,
        medicamento = $14,
        agente_causador = $15,
        classificacao_alergica = $16,
        data_sincronizacao = CURRENT_TIMESTAMP
      WHERE pac_codigo = $17
      RETURNING *
      `,
      [
        internacao,
        nome,
        nascimento,
        cor,
        sexo,
        altura_consulta,
        peso_consulta,
        altura_controle,
        peso_controle,
        qrt_numero,
        lto_lto_id,
        criticidade_alergica,
        grau_certeza,
        medicamento,
        agente_causador,
        classificacao_alergica,
        pac_codigo,
      ]
    );

    return result.rows[0];
  }
}

export default PacienteModel;
