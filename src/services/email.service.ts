import nodemailer from "nodemailer"

export async function enviarEmailDeBoasVindas(destinatario: string, nome: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Seu e-mail no .env
      pass: process.env.EMAIL_PASS, // Sua senha de app no .env
    }
  })

  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #4CAF50;">🐾 Olá, ${nome}!</h2>
        <p>Seu cadastro foi realizado com sucesso! Agora você faz parte da nossa missão de transformar vidas por meio da adoção responsável e do cuidado com os animais. 💚</p>

        <p>Aqui, você pode:</p>
        <ul>
          <li>🐶 Cadastrar animais para adoção</li>
          <li>🐱 Encontrar seu novo(a) melhor amigo(a)</li>
          <li>🔐 Acessar funcionalidades exclusivas com seu perfil de usuário</li>
        </ul>

        <p>Estamos felizes por ter você conosco! Se tiver qualquer dúvida, conte com a gente. 😊</p>

        <p style="margin-top: 30px;">Com carinho,<br><strong>Equipe Adote um Pet 🐕</strong></p>
      </div>
    </div>
  `
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: "Bem-vindo!",
    html
  }

  try{
    const info = await transporter.sendMail(mailOptions)
    console.log("E-mail enviado:", info.response)
  }
  catch (error) {
    console.error("Erro ao enviar e-mail:", error)
  }
}

export async function enviarEmailRecuperacaoSenha(destinatario: string, nome: string, codigo: string){
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
        }
    })

    const html = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #4CAF50;">🔐 Olá, ${nome}!</h2>

            <p>Recebemos uma solicitação para <strong>redefinir sua senha</strong> na plataforma <strong>Adote um Pet</strong>.</p>

            <p style="font-size: 18px;">💬 <strong>Seu código de recuperação é:</strong></p>
            <div style="font-size: 24px; font-weight: bold; color: #333; margin: 10px 0 20px;">
            ${codigo}
            </div>

            <p>Este código é válido por <strong>15 minutos</strong>.</p>
            <p>Se você <strong>não solicitou</strong> essa recuperação, pode ignorar este e-mail com segurança.</p>

            <p style="margin-top: 30px;">Com carinho,  
                <br><strong>Equipe Adote um Pet 🐾</strong>
            </p>
        </div>
    </div>
    `
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: destinatario,
        subject: "🔐 Código de recuperação de senha",
        html
    }

    try{
        const info = await transporter.sendMail(mailOptions)
        console.log("E-mail enviado:", info.response)
    }
    catch (error) {
        console.error("Erro ao enviar e-mail:", error)
  }

}