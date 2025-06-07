export class Utilitarios {
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
    [
      "peliculaTransparenteRoloCurativos",
      "Película transparente em rolo para curativos",
    ],
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
}
