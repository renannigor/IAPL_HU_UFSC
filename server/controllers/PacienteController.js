import PacienteService from "../services/PacienteService.js";

const pacientes = [
  {
    internacao: 1001,
    pac_codigo: "PAC001",
    nome: "João Silva",
    nascimento: "12/05/1980",
    cor: "Branca",
    sexo: "M",
    altura_consultada: 1.75,
    peso_consultada: 75.0,
    altura_controle: 1.75,
    peso_controle: 74.5,
    qrt_numero: 101,
    lto_lto_id: "L101",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Amoxicilina",
    agente_causador: "Penicilina",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1002,
    pac_codigo: "PAC002",
    nome: "Maria Souza",
    nascimento: "03/09/1975",
    cor: "Parda",
    sexo: "F",
    altura_consultada: 1.62,
    peso_consultada: 68.0,
    altura_controle: 1.62,
    peso_controle: 67.8,
    qrt_numero: 102,
    lto_lto_id: "L102",
    criticidade_alergica: "Média",
    grau_certeza: "Suspeita",
    medicamento: "Dipirona",
    agente_causador: "Dipirona",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1003,
    pac_codigo: "PAC003",
    nome: "Carlos Oliveira",
    nascimento: "22/11/1990",
    cor: "Negra",
    sexo: "M",
    altura_consultada: 1.8,
    peso_consultada: 85.0,
    altura_controle: 1.8,
    peso_controle: 83.0,
    qrt_numero: 103,
    lto_lto_id: "L103",
    criticidade_alergica: "Baixa",
    grau_certeza: "Não confirmada",
    medicamento: "Ibuprofeno",
    agente_causador: "Ibuprofeno",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1004,
    pac_codigo: "PAC004",
    nome: "Ana Lima",
    nascimento: "17/03/1985",
    cor: "Branca",
    sexo: "F",
    altura_consultada: 1.7,
    peso_consultada: 60.0,
    altura_controle: 1.7,
    peso_controle: 59.5,
    qrt_numero: 104,
    lto_lto_id: "L104",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Cetoprofeno",
    agente_causador: "Cetoprofeno",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1005,
    pac_codigo: "PAC005",
    nome: "Pedro Almeida",
    nascimento: "09/06/2000",
    cor: "Amarela",
    sexo: "M",
    altura_consultada: 1.78,
    peso_consultada: 72.0,
    altura_controle: 1.78,
    peso_controle: 70.5,
    qrt_numero: 105,
    lto_lto_id: "L105",
    criticidade_alergica: "Nenhuma",
    grau_certeza: "Nenhuma",
    medicamento: null,
    agente_causador: null,
    classificacao_alergica: null,
  },
  {
    internacao: 1006,
    pac_codigo: "PAC006",
    nome: "Fernanda Costa",
    nascimento: "12/01/1992",
    cor: "Indígena",
    sexo: "F",
    altura_consultada: 1.65,
    peso_consultada: 58.0,
    altura_controle: 1.65,
    peso_controle: 58.2,
    qrt_numero: 106,
    lto_lto_id: "L106",
    criticidade_alergica: "Média",
    grau_certeza: "Suspeita",
    medicamento: "Paracetamol",
    agente_causador: "Paracetamol",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1007,
    pac_codigo: "PAC007",
    nome: "Rafael Mendes",
    nascimento: "28/02/1988",
    cor: "Branca",
    sexo: "M",
    altura_consultada: 1.82,
    peso_consultada: 90.0,
    altura_controle: 1.82,
    peso_controle: 89.0,
    qrt_numero: 107,
    lto_lto_id: "L107",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Sulfa",
    agente_causador: "Sulfametoxazol",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1008,
    pac_codigo: "PAC008",
    nome: "Juliana Rocha",
    nascimento: "06/08/1995",
    cor: "Parda",
    sexo: "F",
    altura_consultada: 1.6,
    peso_consultada: 55.0,
    altura_controle: 1.6,
    peso_controle: 54.0,
    qrt_numero: 108,
    lto_lto_id: "L108",
    criticidade_alergica: "Nenhuma",
    grau_certeza: "Nenhuma",
    medicamento: null,
    agente_causador: null,
    classificacao_alergica: null,
  },
  {
    internacao: 1009,
    pac_codigo: "PAC009",
    nome: "André Gomes",
    nascimento: "01/01/1970",
    cor: "Negra",
    sexo: "M",
    altura_consultada: 1.76,
    peso_consultada: 82.0,
    altura_controle: 1.76,
    peso_controle: 81.0,
    qrt_numero: 109,
    lto_lto_id: "L109",
    criticidade_alergica: "Baixa",
    grau_certeza: "Não confirmada",
    medicamento: "AAS",
    agente_causador: "Ácido acetilsalicílico",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1010,
    pac_codigo: "PAC010",
    nome: "Patrícia Martins",
    nascimento: "14/04/1982",
    cor: "Branca",
    sexo: "F",
    altura_consultada: 1.68,
    peso_consultada: 64.0,
    altura_controle: 1.68,
    peso_controle: 63.5,
    qrt_numero: 110,
    lto_lto_id: "L110",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Lactose",
    agente_causador: "Lactose",
    classificacao_alergica: "Alimento",
  },
  {
    internacao: 1011,
    pac_codigo: "PAC011",
    nome: "Eduardo Nunes",
    nascimento: "10/07/1978",
    cor: "Negra",
    sexo: "M",
    altura_consultada: 1.74,
    peso_consultada: 77.0,
    altura_controle: 1.74,
    peso_controle: 76.0,
    qrt_numero: 111,
    lto_lto_id: "L111",
    criticidade_alergica: "Média",
    grau_certeza: "Suspeita",
    medicamento: "Glúten",
    agente_causador: "Trigo",
    classificacao_alergica: "Alimento",
  },
  {
    internacao: 1012,
    pac_codigo: "PAC012",
    nome: "Camila Ferreira",
    nascimento: "29/09/1999",
    cor: "Branca",
    sexo: "F",
    altura_consultada: 1.73,
    peso_consultada: 61.0,
    altura_controle: 1.73,
    peso_controle: 60.5,
    qrt_numero: 112,
    lto_lto_id: "L112",
    criticidade_alergica: "Baixa",
    grau_certeza: "Não confirmada",
    medicamento: null,
    agente_causador: null,
    classificacao_alergica: null,
  },
  {
    internacao: 1013,
    pac_codigo: "PAC013",
    nome: "Leandro Teixeira",
    nascimento: "11/12/1965",
    cor: "Indígena",
    sexo: "M",
    altura_consultada: 1.7,
    peso_consultada: 70.0,
    altura_controle: 1.7,
    peso_controle: 69.0,
    qrt_numero: 113,
    lto_lto_id: "L113",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Insulina",
    agente_causador: "Insulina",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1014,
    pac_codigo: "PAC014",
    nome: "Beatriz Vieira",
    nascimento: "18/02/1987",
    cor: "Amarela",
    sexo: "F",
    altura_consultada: 1.66,
    peso_consultada: 59.0,
    altura_controle: 1.66,
    peso_controle: 58.5,
    qrt_numero: 114,
    lto_lto_id: "L114",
    criticidade_alergica: "Média",
    grau_certeza: "Suspeita",
    medicamento: "Cloranfenicol",
    agente_causador: "Cloranfenicol",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1015,
    pac_codigo: "PAC015",
    nome: "Marcelo Batista",
    nascimento: "25/10/1983",
    cor: "Parda",
    sexo: "M",
    altura_consultada: 1.85,
    peso_consultada: 92.0,
    altura_controle: 1.85,
    peso_controle: 91.0,
    qrt_numero: 115,
    lto_lto_id: "L115",
    criticidade_alergica: "Baixa",
    grau_certeza: "Não confirmada",
    medicamento: "Nimesulida",
    agente_causador: "Nimesulida",
    classificacao_alergica: "Medicamento",
  },
  {
    internacao: 1016,
    pac_codigo: "PAC016",
    nome: "Sofia Pires",
    nascimento: "30/06/2002",
    cor: "Branca",
    sexo: "F",
    altura_consultada: 1.58,
    peso_consultada: 50.0,
    altura_controle: 1.58,
    peso_controle: 49.0,
    qrt_numero: 116,
    lto_lto_id: "L116",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Penicilina",
    agente_causador: "Penicilina",
    classificacao_alergica: "Medicamento",
  },
];

class PacienteController {
  static async getPacientes(req, res) {
    try {
      const pacientes = await PacienteService.getPacientes();
      res.status(200).json(pacientes);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ erro: "Erro ao obter informações dos pacientes!" });
    }
  }

  static async getPaciente(req, res) {
    try {
      const { pac_codigo } = req.params;
      const paciente = await PacienteService.getPaciente(pac_codigo);

      if (!paciente) {
        return res.status(404).json({ erro: "Paciente não encontrado." });
      }

      res.status(200).json(paciente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao obter informações do paciente!" });
    }
  }

  static async atualizarPaciente(req, res) {
    try {
      const { pac_codigo } = req.params;
      const dadosAtualizados = req.body;

      const pacienteAtualizado = await PacienteService.atualizarPaciente(
        pac_codigo,
        dadosAtualizados
      );

      if (!pacienteAtualizado) {
        return res.status(404).json({ erro: "Paciente não encontrado." });
      }

      res.status(200).json(pacienteAtualizado);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ erro: "Erro ao atualizar as informações do paciente!" });
    }
  }

  static async obterPaciente(req, res) {
    try {
      const { id } = req.params;

      const paciente = pacientes.find(
        (paciente) => paciente["pac_codigo"] == id
      );

      res.status(200).json(paciente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: "Erro ao atualizar informações pessoais!" });
    }
  }

  static async carregarTodosPacientes(req, res) {
    try {
      res.status(200).json(pacientes);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ erro: "Erro ao carregar informações dos pacientes!" });
    }
  }
}

export default PacienteController;
