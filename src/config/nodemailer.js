// nodemailer.js
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

const sendMailToUser = (userMail, token) => {
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: process.env.SMTP_USER,
            to: userMail,
            subject: "Verifica tu cuenta",
            html: `<p>Hola, haz clic <a href="${process.env.URL_BACKEND}/confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error(error);
                reject(error); // Rechazar la Promesa en caso de error
            } else {
                console.log('Correo enviado: ' + info.response);
                resolve(info); // Resolver la Promesa en caso de éxito
            }
        });
    });
};

// send mail with defined transport object
const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
    from: 'epalomo154@gmail.com',
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>Sistema de gestión (IAMQ-QUITO 🐶 😺)</h1>
    <hr>
    <a href=${process.env.URL_BACKEND}recuperar-password/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>IAMQ te da la Bienvenida!</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    
}
