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
    idade: 45,
    imc: 24.49,
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
    idade: 49,
    imc: 25.91,
  },
  {
    internacao: 1003,
    pac_codigo: "PAC003",
    nome: "Carlos Oliveira",
    nascimento: "20/07/1990",
    cor: "Negra",
    sexo: "M",
    altura_consultada: 1.8,
    peso_consultada: 85.0,
    altura_controle: 1.8,
    peso_controle: 84.0,
    qrt_numero: 103,
    lto_lto_id: "L103",
    criticidade_alergica: "Baixa",
    grau_certeza: "Confirmada",
    medicamento: "Ibuprofeno",
    agente_causador: "Ibuprofeno",
    classificacao_alergica: "Medicamento",
    idade: 34,
    imc: 26.23,
  },
  {
    internacao: 1004,
    pac_codigo: "PAC004",
    nome: "Ana Costa",
    nascimento: "11/11/1965",
    cor: "Branca",
    sexo: "F",
    altura_consultada: 1.58,
    peso_consultada: 60.0,
    altura_controle: 1.58,
    peso_controle: 59.5,
    qrt_numero: 104,
    lto_lto_id: "L104",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Paracetamol",
    agente_causador: "Paracetamol",
    classificacao_alergica: "Medicamento",
    idade: 58,
    imc: 24.03,
  },
  {
    internacao: 1005,
    pac_codigo: "PAC005",
    nome: "Lucas Lima",
    nascimento: "05/01/2000",
    cor: "Amarela",
    sexo: "M",
    altura_consultada: 1.7,
    peso_consultada: 70.0,
    altura_controle: 1.7,
    peso_controle: 69.8,
    qrt_numero: 105,
    lto_lto_id: "L105",
    criticidade_alergica: "Média",
    grau_certeza: "Suspeita",
    medicamento: "Cetoprofeno",
    agente_causador: "Cetoprofeno",
    classificacao_alergica: "Medicamento",
    idade: 25,
    imc: 24.22,
  },
  {
    internacao: 1006,
    pac_codigo: "PAC006",
    nome: "Fernanda Ribeiro",
    nascimento: "30/03/1988",
    cor: "Branca",
    sexo: "F",
    altura_consultada: 1.65,
    peso_consultada: 72.0,
    altura_controle: 1.65,
    peso_controle: 71.5,
    qrt_numero: 106,
    lto_lto_id: "L106",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Tramadol",
    agente_causador: "Tramadol",
    classificacao_alergica: "Medicamento",
    idade: 37,
    imc: 26.45,
  },
  {
    internacao: 1007,
    pac_codigo: "PAC007",
    nome: "Ricardo Alves",
    nascimento: "14/02/1995",
    cor: "Negra",
    sexo: "M",
    altura_consultada: 1.78,
    peso_consultada: 82.0,
    altura_controle: 1.78,
    peso_controle: 81.6,
    qrt_numero: 107,
    lto_lto_id: "L107",
    criticidade_alergica: "Baixa",
    grau_certeza: "Suspeita",
    medicamento: "Codeína",
    agente_causador: "Codeína",
    classificacao_alergica: "Medicamento",
    idade: 30,
    imc: 25.88,
  },
  {
    internacao: 1008,
    pac_codigo: "PAC008",
    nome: "Beatriz Martins",
    nascimento: "08/08/1982",
    cor: "Parda",
    sexo: "F",
    altura_consultada: 1.68,
    peso_consultada: 64.0,
    altura_controle: 1.68,
    peso_controle: 63.7,
    qrt_numero: 108,
    lto_lto_id: "L108",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Ácido acetilsalicílico",
    agente_causador: "AAS",
    classificacao_alergica: "Medicamento",
    idade: 42,
    imc: 22.68,
  },
  {
    internacao: 1009,
    pac_codigo: "PAC009",
    nome: "Eduardo Fernandes",
    nascimento: "27/12/1978",
    cor: "Branca",
    sexo: "M",
    altura_consultada: 1.73,
    peso_consultada: 90.0,
    altura_controle: 1.73,
    peso_controle: 89.5,
    qrt_numero: 109,
    lto_lto_id: "L109",
    criticidade_alergica: "Média",
    grau_certeza: "Confirmada",
    medicamento: "Nimesulida",
    agente_causador: "Nimesulida",
    classificacao_alergica: "Medicamento",
    idade: 46,
    imc: 30.06,
  },
  {
    internacao: 1010,
    pac_codigo: "PAC010",
    nome: "Larissa Teixeira",
    nascimento: "22/06/1998",
    cor: "Indígena",
    sexo: "F",
    altura_consultada: 1.6,
    peso_consultada: 58.0,
    altura_controle: 1.6,
    peso_controle: 57.8,
    qrt_numero: 110,
    lto_lto_id: "L110",
    criticidade_alergica: "Alta",
    grau_certeza: "Confirmada",
    medicamento: "Metformina",
    agente_causador: "Metformina",
    classificacao_alergica: "Medicamento",
    idade: 27,
    imc: 22.66,
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
