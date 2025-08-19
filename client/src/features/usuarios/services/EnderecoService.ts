import axios from "axios";

class EnderecoService {
  static async obterEndereco(cep: string) {
    try {
      const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      if (data.erro) return null;
      return data;
    } catch {
      return null;
    }
  }
}

export default EnderecoService;
