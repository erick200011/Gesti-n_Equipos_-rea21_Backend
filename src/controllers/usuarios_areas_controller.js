import { sendMailToUsuarioArea, sendMailToRecoveryPassword, sendMailToUser } from "../config/nodemailer.js";
import UsuariosArea from "../models/usuario_areas.js";
import generarJWT from "../helpers/crearJWT.js";
//Dentro de la función login, puedes utilizar esta función para verificar la contraseña en la tabla usuarios_areas dentro de la base de datos
//Logica para Crud
const login = async (req, res) => {
    const { email, password } = req.body;
    if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos, debes llenar todos los campos" });

    try {
        const Usuario_AreaBDD = await UsuariosArea.findOne({
            where: { email },
            attributes: ['id', 'nombre', 'apellido', 'email', 'password', 'confirmemail', 'area']
        });

        if (!Usuario_AreaBDD) return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
        if (!Usuario_AreaBDD.confirmemail) return res.status(403).json({ msg: "Lo sentimos, primero debe verificar la cuenta" });

        // Verificar la contraseña utilizando el método de la instancia
        const verificarPassword = await Usuario_AreaBDD.matchPassword(password);
        console.log('contraseña', verificarPassword);
        if (!verificarPassword) return res.status(404).json({ msg: "Lo sentimos, la contraseña es incorrecta" });

        

        const token = generarJWT(Usuario_AreaBDD.id, "UsuariosArea");

        // Si la contraseña coincide, puedes proceder con el inicio de sesión exitoso
        res.status(200).json({
            token,
            id: Usuario_AreaBDD.id,
            nombre: Usuario_AreaBDD.nombre,
            apellido: Usuario_AreaBDD.apellido,
            email: Usuario_AreaBDD.email,
            area: Usuario_AreaBDD.area,
        });
    } catch (error) {
        console.error("Error al buscar el usuario: ", error);
        res.status(500).json({ msg: "Error del servidor" });
    }
};

export { login };



const perfil=(req,res)=>{
    delete req.Usuario_AreaBDD.token
    delete req.Usuario_AreaBDD.confirmemail
    delete req.Usuario_AreaBDD._v
    res.status(200).json(req.Usuario_AreaBDD)
}

// Ejemplo en el controlador de registro
const registro = async (req, res) => {
    const { email, password } = req.body;
    // Validación de campos
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Verificar si el correo ya está registrado
    const verificarEmailBDD = await UsuariosArea.findOne({ where: { email } });
    if (verificarEmailBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
    }

    // Crear un nuevo usuario sin guardarlo en la base de datos todavía
    const nuevoUsuario = new UsuariosArea(req.body);
    nuevoUsuario.password = await nuevoUsuario.encryptPassword(password);

    // Generar y enviar el token de confirmación por correo electrónico
    try {
        const token = await nuevoUsuario.crearToken();  // Esperar la resolución de la Promesa
        await sendMailToUser(email, token);
        //console.log("El correo se envió");
    } catch (error) {
        console.error("Error al generar el token o enviar el correo:", error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    }

    // Responder al cliente para que revise su correo electrónico
    res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });

    // Una vez que el usuario confirme su correo electrónico, guardar el usuario en la base de datos
    // (Esto podría hacerse en otro controlador que maneje la confirmación del correo electrónico)
    // await nuevoUsuario.save();
};


const confirmEmail = async (req, res) => {
    console.log("req.params:", req.params);

    const token = req.params.token;
    if (!token) {
        return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
    }

    try {
        console.log("Valor del token recibido:", token);

        const usuarioAreaBDD = await UsuariosArea.findOne({ where: { token } });
        console.log("Usuario encontrado:", usuarioAreaBDD);

        if (!usuarioAreaBDD) {
            return res.status(404).json({ msg: "Token inválido o la cuenta ya ha sido confirmada" });
        }

        if (usuarioAreaBDD.confirmemail) {
            return res.status(400).json({ msg: "La cuenta ya ha sido confirmada" });
        }

        usuarioAreaBDD.confirmemail = true;
        usuarioAreaBDD.token = null;
        await usuarioAreaBDD.save();

        res.status(200).json({ msg: "Cuenta confirmada y token eliminado. Puedes iniciar sesión." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error del servidor al confirmar el correo electrónico" });
    }
};



const listarUsuariosAreas =(req,res)=>{
    res.status(200).json({res:'Lista de los usuarios por areas registrados'})
};

const detalleUsuarioArea= async(req,res)=>{
    const {id} = req.params;

    try{
        // Verificamos si el identificador ID es un entero válido
        if (isNaN(id)){
            return res.status(404).json({ msg: "Lo sentimos, el identificador deber ser un número entero"});
        }
        // Buscar al Usuario por si ID 
        const Usuario_AreaBDD = await UsuariosArea.findByPk(id, { attributes: {exclude:['password']}});

        //Verifica si se encontrón al super usuario
        if (!Usuario_AreaBDD){
            return res.status(404).json({mgs: "Lo sentimos, no existe el usuario por area"})
        }

        //Si se encuentra, responder al cliente con los detaller del Usuario por Areas
        res.status(200).json({mgs: Usuario_AreaBDD});
    }catch(erro){
        res.status(500).json({mgs: "Error del servidor"});
    }
};

const actualizarPerfil = async (req,res) => {
    const {id}= req.params;

    try{
        //Verifica si el ID es un número entero válido
        if (isNaN(id)){
            return res.status(404).json({mgs:"Lo sentimos el identificador debe ser un número único"})
        }

        //Verifica si se proporcionaron los campos
        if (Object.values(req.body).some(value=> value === undefined || value === '')){
            return res.status(400).json({msg: "Lo sentimos, debes llenar todos los campos"});
        }

        //Busca al usuarioArea por su ID
        const Usuario_AreaBDD =await UsuariosArea.findByPk(id);

        //Verifica si se encontró por su ID
        if(!Usuario_AreaBDD){
            return res.status(404).json({mgs:`Lo sentimos, no existe un usuario con el identificador ${id}`});
        }

        // Verificar si se está intentando cambiar el correo electrónico y si ya existe en otro usuario
        if (req.body.email && req.body.email !== Usuario_AreaBDD.email){
            const Usuario_AreaExistente = await UsuariosArea.findOne({where: {email: req.body.email}});
            if(Usuario_AreaExistente){
                return res.status(400).json({mgs: "Lo sentimos, el correo ya esta registrado con otro usuario"});

            }
        }

        // Actualiza los campos del Usuario por areas
        await Usuario_AreaBDD.update(req.body);
    }catch(error){
        res.status(500).json({msg: "Error del servidor"});
    }
};

const actualizarPassword = async (req, res)=>{
    const {id} = req.Usuario_AreaBDD; // Obtener  el ID del usuario por area desde la solicitud

    try{
        //Busca al usuario por su ID
        const Usuario_AreaBDD = await UsuariosArea.findByPk(id);

        // Verificar si se encontró al Usuario por area
        if(!Usuario_AreaBDD){
            return res.status(404).json({msg: `Lo sentimos, no existe el usuario de área con ID ${id}`})
        }

        //Verifica si la contraseña actal es correcta
        const verificarPassword = await Usuario_AreaBDD.matchPassword(req.body.passwordactual) ;
        if (!verificarPassword){
            return res.status(404).json({mgs: "Lo sentimos, la contraseña actual no es la correcta "})
        }

        //Actualizar la contraseña se usuario por areas
        Usuario_AreaBDD.password = await Usuario_AreaBDD.encryptPassword(req.body.passwordnuevo);
        await Usuario_AreaBDD.save();

        res.status(200).json({mgs:"Contraseña actualizada correctamente"});
    }catch(error){
        console.error("Error al actualizar la contraseña:", error.message);
        res.status(500).json({mgs:"Error del servidor"});
    }
};

const recuperarPassword = async (req, res)=>{
    const{email}= req.body;
    // Verificamos si se proporciono un corre válido
    if (!email){
        return res.status(400).json({msg: "Deber ingresar un correo electrónico"})
    }

    try{
        // Buscar al usuario en la base de datos
        const Usuario_AreaBDD = await UsuariosArea.findOne({where:{email}});

        //Si no se encuentra al usurio, devolver un mensaje de error
        if(!Usuario_AreaBDD){
            return res.status(404).json({mgs: "Lo sentimos, el usuario no se encuetra registrado"});
        }

        //Crear un token de recuperación de contraseña
        const token = await Usuario_AreaBDD.crearToken();

        //Actualizar el token en la base de datos
        Usuario_AreaBDD.token=token;
        Usuario_AreaBDD.password= ''; //// Establecer la contraseña a una cadena vacía
        await Usuario_AreaBDD.save();

        // Enviar correo eléctronico de recuperación de contraseña
        await sendMailToRecoveryPassword(email, token);

        //Respuesta existosa
        res.status(200).json({msg:"Revisa tu correo electrónico para restablecer tu contraseña"})
    }catch(error){
        // Menejar errores
        console.error('Error al recuperar contraseña:', error.message);
        res.status(500).json({msg: "Error interno del servidor"});
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
        const Usuario_AreaBDD = await UsuariosArea.findOne({ where: { token } });

        // Verificar si se encontró al usuario y si el token coincide
        if (!Usuario_AreaBDD || Usuario_AreaBDD.token !== token) {
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
        const Usuario_AreaBDD = await UsuariosArea.findOne({ where: { token: req.params.token } });
        // Verificar si se encontró al usuario y si el token coincide
        if (!Usuario_AreaBDD || Usuario_AreaBDD.token !== req.params.token) {
            return res.status(404).json({ msg: "Lo sentimos, no se puede validar la cuenta" });
        }

        // Actualizar el token y la contraseña del usuario
        Usuario_AreaBDD.token = null;
        Usuario_AreaBDD.password = await Usuario_AreaBDD.encryptPassword(password);

        // Guardar los cambios en la base de datos
        await Usuario_AreaBDD.save();

        res.status(200).json({ msg: "¡Felicitaciones, ya puedes iniciar sesión con tu nueva contraseña!" });
    } catch (error) {
        // Manejar errores
        console.error('Error al actualizar la contraseña:', error.message);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    const { salida } = req.body;

    // Validación de campos
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    try {
        // Validar si el usuario existe
        const usuario = await UsuariosArea.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el usuario del área ${id}` });
        }

        // Actualizar el usuario por su ID
        await UsuariosArea.update({ salida: Date.parse(salida), estado: false }, { where: { id } });

        // Responder al cliente indicando que el usuario ha sido eliminado
        res.status(200).json({ msg: "Usuario del área eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};


export default {
    login,
    perfil,
    registro,
    confirmEmail,
    listarUsuariosAreas,
    detalleUsuarioArea,
    actualizarPerfil,
    actualizarPassword,
    recuperarPassword,
    comprobarTokenPasword,
    nuevoPassword,
    eliminarUsuario
};