import "dotenv/config";
import { createTransport } from "nodemailer";

class EmailService {
  constructor() {
    this.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async enviarEmail(destinatario, assunto, mensagem) {
    try {
      const info = await this.transporter.sendMail({
        from: `"Suporte" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: assunto,
        html: mensagem,
      });
      console.log(`E-mail enviado: ${info.messageId}`);
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error);
      throw new Error("Falha no envio do e-mail");
    }
  }
}

export default new EmailService();
