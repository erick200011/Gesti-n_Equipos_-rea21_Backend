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
            subject: "Bienvenido a IAMQ Quito - Sistema de Gestión de Equipos",
            html: `<p>Bienvenido a IAMQ Quito - Sistema de Gestión de Equipos.</p>
                   <p>Por favor, haz clic <a href="${process.env.URL_BACKEND}/confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log('Correo enviado: ' + info.response);
                resolve(info);
            }
        });
    });
};

const sendMailToRecoveryPassword = async(userMail, token) => {
    let info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userMail,
        subject: "Correo para reestablecer tu contraseña",
        html: `
        <h1>Sistema de gestión (IAMQ-QUITO 🐶 😺)</h1>
        <hr>
        <a href="${process.env.URL_BACKEND}/recuperar-password/${encodeURIComponent(token)}">Clic para reestablecer tu contraseña</a>
        <hr>
        <footer>IAMQ te da la Bienvenida!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

const sendMailToUsuarioArea = async (userMail, password, token) => {
    const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userMail,
        subject: "Correo de bienvenida",
        html: `
        <h1>Sistema de gestión de equipos (Quito-IAMQ 🐶 😺)</h1>
        <hr>
        <p>Contraseña de acceso: ${password}</p>
        <p>Por favor, haz clic <a href="${process.env.URL_BACKEND}/usuarioArea/confirmar/${encodeURIComponent(token)}">aquí</a> para confirmar tu cuenta.</p>
        <hr>
        <footer>Bienvenid@!</footer>
        `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
};

const sendMailToRecoveryPasswordCustom = async (userMail, token) => {
    try {
        let info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: userMail,
            subject: "Recuperación de contraseña",
            html: `
            <h1>Sistema de gestión (IAMQ-QUITO 🐶 😺)</h1>
            <hr>
            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="${process.env.URL_BACKEND}/usuarioArea/recuperar-password/${encodeURIComponent(token)}">Restablecer contraseña</a>
            <hr>
            <footer>IAMQ te da la Bienvenida!</footer>
            `
        });
        console.log("Correo de recuperación enviado: ", info.messageId);
    } catch (error) {
        console.error("Error al enviar el correo de recuperación:", error);
        throw new Error("Error al enviar el correo de recuperación");
    }
};

export {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMailToUsuarioArea,
    sendMailToRecoveryPasswordCustom
};
