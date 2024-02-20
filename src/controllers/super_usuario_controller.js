import  { sendMailToUser, sendMailToRecoveryPassword} from "../config/nodemailer.js";
import SuperUsuario  from "../models/super_usuario.js";

const login =(req,res)=>{
    res.status(200).json({res:'login del super_usuario'})
}
const perfil=(req,res)=>{
    res.status(200).json({res:'perfil del super_usuario'})
}
const registro = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    const verificarEmailBDD = await SuperUsuario.findOne({ where: { email: email } });
    if (verificarEmailBDD) return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
    
    // Crear un nuevo usuario sin guardarlo en la base de datos todavía
    const nuevoUsuario = new SuperUsuario(req.body);
    nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);

    // Generar y enviar el token de confirmación por correo electrónico
    const token = nuevoUsuario.crearToken();
    try{
        sendMailToUser(email, token);
        console.log("El correo se envio")
    }catch{
        console.log("correo no enviado")
    }

    // Responder al cliente para que revise su correo electrónico
    res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });

    // Una vez que el usuario confirme su correo electrónico, guardar el usuario en la base de datos
    // (Esto podría hacerse en otro controlador que maneje la confirmación del correo electrónico)
    // await nuevoUsuario.save();
};

const confirmEmail = async (req, res) => {
    if (!req.params.token) return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    const superUsuarioBDD = await SuperUsuario.findOne({ where: { token: req.params.token } });
    if (!superUsuarioBDD?.token) return res.status(404).json({ msg: "La cuenta ya ha sido confirmada" });
    superUsuarioBDD.token = null;
    superUsuarioBDD.confirmEmail = true;
    await superUsuarioBDD.save();
    
   
    
    res.status(200).json({ msg: "Token confirmado, ya puedes iniciar sesión" });
     // Guardar el usuario en la base de datos una vez que se confirme el correo electrónico
     await nuevoUsuario.save();
};

const listarSuperUsuarios = (req,res)=>{
    res.status(200).json({res:'lista de super_usuario registrados'})
}
const detalleSuperUsuarios = (req,res)=>{
    res.status(200).json({res:'detalle de un usuario registrado'})
}
const actualizarPerfil = (req,res)=>{
    res.status(200).json({res:'actualizar perfil de un super_usuario registrado'})
}
const actualizarPassword = (req,res)=>{
    res.status(200).json({res:'actualizar password de un super_usuario registrado'})
}
const recuperarPassword = async (req, res) => {
    const { email } = req.body;

    // Verificar si se proporcionó un correo electrónico
    if (!email) {
        return res.status(400).json({ msg: "Debes proporcionar un correo electrónico" });
    }

    try {
        // Buscar al usuario en la base de datos
        const superUsuarioBDD = await SuperUsuario.findOne({ where: { email } });

        // Si no se encuentra al usuario, devolver un mensaje de error
        if (!superUsuarioBDD) {
            return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
        }

        // Crear un token de recuperación de contraseña
        const token = await superUsuarioBDD.crearToken();

        // Actualizar el token en la base de datos
        superUsuarioBDD.token = token;
        await superUsuarioBDD.save();

        // Enviar correo electrónico de recuperación de contraseña
        await sendMailToRecoveryPassword(email, token);

        // Respuesta exitosa
        res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu contraseña" });
    } catch (error) {
        // Manejar errores
        console.error('Error al recuperar contraseña:', error.message);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const comprobarTokenPasword = async (req, res) => {
    const token = req.params.token;

    // Verificar si se proporcionó un token en los parámetros de la solicitud
    if (!token) {
        return res.status(404).json({ msg: "Lo sentimos, no se proporcionó un token válido" });
    }

    try {
        // Buscar al usuario en la base de datos utilizando el token
        const superUsuarioBDD = await SuperUsuario.findOne({ where: { token } });

        // Verificar si se encontró al usuario y si el token coincide
        if (!superUsuarioBDD || superUsuarioBDD.token !== token) {
            return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
        }

        // La cuenta ha sido validada, puedes realizar las operaciones necesarias aquí si es necesario

        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" });
    } catch (error) {
        // Manejar errores
        console.error('Error al comprobar el token de contraseña:', error.message);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const nuevoPassword = async (req, res) => {
    const { password, confirmpassword } = req.body;

    // Verificar si se llenaron todos los campos
    if (Object.values(req.body).includes("")) {
        return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Verificar si las contraseñas coinciden
    if (password !== confirmpassword) {
        return res.status(404).json({ msg: "Lo sentimos, las contraseñas no coinciden" });
    }

    try {
        // Buscar al usuario en la base de datos utilizando el token
        const superUsuarioBDD = await SuperUsuario.findOne({ where: { token: req.params.token } });

        // Verificar si se encontró al usuario y si el token coincide
        if (!superUsuarioBDD || superUsuarioBDD.token !== req.params.token) {
            return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
        }

        // Actualizar el token y la contraseña del usuario
        superUsuarioBDD.token = null;
        superUsuarioBDD.password = await superUsuarioBDD.encryptPassword(password);

        // Guardar los cambios en la base de datos
        await superUsuarioBDD.save();

        res.status(200).json({ msg: "¡Felicitaciones, ya puedes iniciar sesión con tu nueva contraseña!" });
    } catch (error) {
        // Manejar errores
        console.error('Error al actualizar la contraseña:', error.message);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

export default {
    login,
    perfil,
    registro,
    confirmEmail,
    listarSuperUsuarios,
    detalleSuperUsuarios,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword
};