// services/email.service.js
import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (to, resetURL) => {
// Crear cuenta de prueba en Ethereal
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });

  const mailOptions = {
    from: '"Che Bonita" <no-reply@chebonita.com>',
    to,
    subject: "Recuperación de Contraseña",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #fff8f4; padding: 20px; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://res.cloudinary.com/imgenvironment/image/upload/v1752757729/logo_gc4vs9.webp" alt="Che Bonita" style="max-width: 180px;" />
      </div>

      <h2 style="color: #8b5c2c;">Recuperación de Contraseña</h2>
      <p style="color: #333;">Hola, hemos recibido una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el botón de abajo:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetURL}" style="padding: 12px 24px; background-color: #8b5c2c; color: #fff; text-decoration: none; border-radius: 5px;">
          Restablecer Contraseña
        </a>
      </div>

      <p style="color: #777; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña seguirá segura.</p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
      <p style="text-align: center; font-size: 12px; color: #aaa;">
        &copy; 2025 Che Bonita. Todos los derechos reservados.
      </p>
    </div>
  `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('Vista previa:', previewUrl); // Muestra URL para ver el correo
    return previewUrl; // Devolvemos la URL para usarla en el controlador
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo');
  }
};
