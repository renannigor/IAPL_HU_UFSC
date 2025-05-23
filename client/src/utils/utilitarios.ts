export class Utilitarios {
  static tiposUsuarios = ["Acadêmico", "Residente", "Profissional"] as const;

  static porcentagens = [
    ["epitelizado", "Epitelizado"],
    ["granulacao", "Granulação"],
    ["hipergranulacao", "Hipergranulação"],
    ["necroseSeca", "Necrose Seca"],
    ["necroseUmida", "Necrose Úmida"],
    ["esfacelo", "Esfacelo"],
  ] as const;

  static coberturaUtilizada = [
    ["age", "Age"],
    ["alginatoCalcioPrataPlaca", "Alginato de Cálcio com prata placa"],
    ["alginatoCalcioPrataFita", "Alginato de Cálcio com prata fita"],
    ["alginatoCalcioFita", "Alginato de Cálcio fita"],
    ["botaUnna", "Bota de unna"],
    ["carvaoAtivadoPrata", "Carvão ativado com prata"],
    ["cintoEstomia", "Cinto para estomia"],
    ["espumaPrataGrande", "Espuma com prata grande"],
    ["espumaPrataPequena", "Espuma com prata pequena"],
    ["espumaSiliconePrataGrande", "Espuma com silicone e prata grande"],
    ["espumaSiliconePequena", "Espuma com silicone pequena"],
    ["hidrofibraPrata", "Hidrofibra com prata"],
    ["hidrogel", "Hidrogel"],
    ["melolin", "Melolin"],
    ["membracel", "Membracel"],
    ["pastaHidrocoloide", "Pasta hidrocoloide"],
    ["phmbGel", "PHMB gel"],
    ["placaHidrocoloideFina", "Placa de hidrocoloide fina"],
    ["placaHidrocoloideGrossa", "Placa de hidrocoloide grossa"],
    ["prataNanocristalina", "Prata nanocristalina"],
    ["rayonPetrolatum", "Rayon com petrolatum"],
    ["filtroCarvaoAtivado", "Filtro de carvão ativado"],
    ["hidrocoloideBastao", "Hidrocoloide bastão"],
    ["pastaPeriestomal", "Pasta periestomal"],
  ] as const;

  static fechamentoCurativo = [
    ["peliculaTransparenteRoloCurativos", "Película transparente em rolo para curativos"],
    ["botaUnna", "Bota de Unna"],
    ["redeTubular3", "Rede tubular 3"],
    ["redeTubular6", "Rede tubular 6"],
    ["chumacoAtadura", "Chumaço e Atadura"],
  ] as const;

  static atributosTabelaUsuarios = [
    "nome",
    "email",
    "online",
    "possui_acesso",
    "tipo",
  ];

  static atributosTabelaPacientes = [
    "nome_completo",
    "idade",
    "data_internacao",
    "quarto",
    "unidade_internacao",
    "sexo",
    "data_avaliacao_gicpel",
  ];

  static etiologiaLesoes = [
    "Arterial",
    "Venosa",
    "Neuropática",
    "Neoplásica",
    "Autoimune",
    "Abrasão",
    "Deiscência",
    "Por umidade",
    "Contusa",
    "Laceração",
    "Lesão por Pressão",
  ];

  static classificacoesLesaoPorPressao = [
    "Estágio 1",
    "Estágio 2",
    "Estágio 3",
    "Estágio 4",
    "Não classificável",
    "Lesão tissular profunda",
    "Relacionada a dispositivo",
    "Membrana mucosa",
  ];

  static regioesPerilesionais = [
    "Sem alterações",
    "Hipocorada",
    "Hipopigmentada",
    "Hiperpigmentada",
    "Eritema",
    "Macerada",
    "Bolhas",
    "Outro",
  ];

  static bordas = [
    "Regular",
    "Irregular",
    "Aderida",
    "Descolamento",
    "Epibolia",
    "Hiperemiada",
    "Macerada",
    "Hiperqueratosa",
  ];

  static estruturasNobres = ["Músculos", "Tendões", "Ossos", "Outro"];

  static quantificacoesDor = [
    "Aguda",
    "Crônica",
    "Recorrente",
    "Necessidade de analgesia prévia a procedimento",
  ];

  static exsudato = [
    "Não exsudativa",
    "Pequena <25%",
    "Moderada 25 a 70%",
    "Abundante ≥ 70%",
  ];

  static tiposExsudato = [
    "Seroso",
    "Serosanguinolento",
    "Sanguinolento",
    "Purulento",
    "Piossanguinolento",
  ];

  static odores = [
    "Sem odor",
    "Odor característico",
    "Odor fétido",
    "Odor pútrido",
  ];
}
