import { sendMailToUsuarioArea, sendMailToRecoveryPasswordCustom} from "../config/nodemailer.js";
import UsuariosArea from "../models/usuario_areas.js";
import generarJWT from "../helpers/crearJWT.js";
//Dentro de la función login, puedes utilizar esta función para verificar la contraseña en la tabla usuarios_areas dentro de la base de datos
//Logica para Crud
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Por favor, proporciona correo electrónico y contraseña" });
    }

    try {
        const usuario_AreaBDD = await UsuariosArea.findOne({
            where: { email },
            attributes: ['id', 'nombre', 'apellido', 'email', 'password', 'confirmemail', 'area']
        });

        if (!usuario_AreaBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        if (!usuario_AreaBDD.confirmemail) {
            return res.status(403).json({ msg: "Por favor, verifica tu cuenta antes de iniciar sesión" });
        }

        // Verificar la contraseña utilizando el método de instancia
        const verificarPassword = await usuario_AreaBDD.matchPassword(password);

        if (!verificarPassword) {
            return res.status(401).json({ msg: "Contraseña incorrecta" });
        }

        // Generar token JWT y responder con la información del usuario
        const token = generarJWT(usuario_AreaBDD.id, "UsuariosArea");

        res.status(200).json({
            token,
            id: usuario_AreaBDD.id,
            nombre: usuario_AreaBDD.nombre,
            apellido: usuario_AreaBDD.apellido,
            email: usuario_AreaBDD.email,
            area: usuario_AreaBDD.area,
        });
    } catch (error) {
        console.error("Error al buscar el usuario: ", error);
        res.status(500).json({ msg: "Error del servidor" });
    }
};


const perfil = (req, res) => {
    try {
        // Verifica si req.usuariosAreaBDD está definido
        if (!req.usuariosAreaBDD) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Accede a los datos del usuario desde req.usuariosAreaBDD
        const { id, nombre, apellido, email, area } = req.usuariosAreaBDD;

        // Elimina campos sensibles si es necesario
        delete req.usuariosAreaBDD.token;
        delete req.usuariosAreaBDD.confirmemail;
        delete req.usuariosAreaBDD._v;

        // Responde con los datos del usuario
        res.status(200).json({ id, nombre, apellido, email, area });
    } catch (error) {
        console.error("Error al obtener perfil:", error.message);
        res.status(500).json({ msg: "Error interno del servidor al obtener perfil" });
    }
};


// Ejemplo en el controlador de registro
export const registro = async (req, res) => {
    const { nombre, apellido, email, area } = req.body;

    // Validación de campos
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    // Verificar si el correo ya está registrado
    const verificarEmailBDD = await UsuariosArea.findOne({ where: { email } });
    if (verificarEmailBDD) {
        return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });
    }

    // Generar una contraseña aleatoria
    const generatedPassword = Math.random().toString(36).slice(2);

    // Crear un nuevo usuario con la contraseña generada
    const nuevoUsuario = new UsuariosArea({
        nombre,
        apellido,
        email,
        area,
        password: generatedPassword
    });

    try {
        // Guardar el usuario en la base de datos
        await nuevoUsuario.save();

        // Generar y enviar el token de confirmación por correo electrónico
        const token = await nuevoUsuario.crearToken();

        // Enviar la contraseña generada por correo
        await sendMailToUsuarioArea(email, generatedPassword, token);

        res.status(201).json({ msg: 'Usuario registrado exitosamente. Revisa tu correo para la contraseña.' });
    } catch (error) {
        console.error("Error al registrar usuario: ", error);
        res.status(500).json({ msg: "Error al registrar usuario", error });
    }
};


const confirmEmail = async (req, res) => {
    console.log("req.params:", req.params);

    const token = req.params.token;
    if (!token) {
        return res.status(400).json({ msg: "Lo sentimos, no se puede validar la cuenta porque no se ha proporcionado un token" });
    }

    try {
        console.log("Valor del token recibido:", token);

        const usuarioAreaBDD = await UsuariosArea.findOne({ where: { token } });
        console.log("Usuario encontrado:", usuarioAreaBDD);

        if (!usuarioAreaBDD) {
            return res.status(404).json({ msg: "Token inválido o la cuenta ya ha sido confirmada previamente" });
        }

        if (usuarioAreaBDD.confirmemail) {
            return res.status(400).json({ msg: "La cuenta ya ha sido confirmada anteriormente" });
        }

        usuarioAreaBDD.confirmemail = true;
        usuarioAreaBDD.token = null;
        await usuarioAreaBDD.save();

        res.status(200).json({ msg: "Cuenta confirmada exitosamente. Ahora puedes iniciar sesión." });
    } catch (error) {
        console.error("Error al confirmar el correo electrónico:", error);
        res.status(500).json({ msg: "Error del servidor al confirmar el correo electrónico" });
    }
};

const listarUsuariosAreas =async (req,res)=>{
    try {
        // Obtener todos los usuarios de la base de datos
        const usuariosAreas = await UsuariosArea.findAll({
            attributes: { exclude: ['password'] } // Excluir el campo de contraseña si es sensible
        });

        // Verificar si se encontraron usuarios
        if (!usuariosAreas || usuariosAreas.length === 0) {
            return res.status(404).json({ msg: "No se encontraron usuarios por áreas registrados" });
        }

        // Devolver la lista de usuarios como respuesta
        res.status(200).json({ usuariosAreas });
    } catch (error) {
        console.error("Error al listar usuarios por áreas:", error);
        res.status(500).json({ msg: "Error interno del servidor al listar usuarios por áreas" });
    }
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

const actualizarPerfil = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar si el ID es un número entero válido
        if (isNaN(id)) {
            return res.status(404).json({ msg: "Lo sentimos, el identificador debe ser un número único" });
        }

        // Verificar si se proporcionaron los campos
        if (Object.values(req.body).some(value => value === undefined || value === '')) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }

        // Buscar al usuarioArea por su ID
        const Usuario_AreaBDD = await UsuariosArea.findByPk(id);

        // Verificar si se encontró por su ID
        if (!Usuario_AreaBDD) {
            return res.status(404).json({ msg: `Lo sentimos, no existe un usuario con el identificador ${id}` });
        }

        // Verificar si se está intentando cambiar el correo electrónico y si ya existe en otro usuario
        if (req.body.email && req.body.email !== Usuario_AreaBDD.email) {
            const Usuario_AreaExistente = await UsuariosArea.findOne({ where: { email: req.body.email } });
            if (Usuario_AreaExistente) {
                return res.status(400).json({ msg: "Lo sentimos, el correo ya está registrado con otro usuario" });
            }
        }

        // Actualizar los campos del Usuario por áreas
        await Usuario_AreaBDD.update(req.body);

        // Responder con éxito
        res.status(200).json({ msg: "Perfil actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar perfil:", error.message);
        res.status(500).json({ msg: "Error del servidor al actualizar perfil" });
    }
};

const actualizarPassword = async (req, res) => {
    const { id } = req.usuarioAreaBDD;

    if (!id) {
        return res.status(400).json({ msg: "ID de usuario no está definido en la solicitud" });
    }

    try {
        // Busca al usuario por su ID
        const Usuario_AreaBDD = await UsuariosArea.findByPk(id);

        // Verificar si se encontró al Usuario por área
        if (!Usuario_AreaBDD) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el usuario de área con ID ${id}` });
        }

        // Verifica si la contraseña actual es correcta
        const verificarPassword = await Usuario_AreaBDD.matchPassword(req.body.passwordactual);
        if (!verificarPassword) {
            return res.status(404).json({ msg: "Lo sentimos, la contraseña actual no es la correcta" });
        }

        // Actualizar la contraseña del usuario por áreas
        Usuario_AreaBDD.password = await Usuario_AreaBDD.encryptPassword(req.body.passwordnuevo);
        await Usuario_AreaBDD.save();

        res.status(200).json({ msg: "Contraseña actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error.message);
        res.status(500).json({ msg: "Error del servidor" });
    }
};



const recuperarPassword = async (req, res) => {
    const { email } = req.body;

    // Verificamos si se proporcionó un correo válido
    if (!email) {
        return res.status(400).json({ msg: "Debe ingresar un correo electrónico" });
    }

    try {
        // Buscar al usuario en la base de datos
        const Usuario_AreaBDD = await UsuariosArea.findOne({ where: { email } });

        // Si no se encuentra al usuario, devolver un mensaje de error
        if (!Usuario_AreaBDD) {
            return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
        }

        // Crear un token de recuperación de contraseña
        const token = await Usuario_AreaBDD.crearToken();

        // Actualizar el token en la base de datos
        Usuario_AreaBDD.token = token;
        Usuario_AreaBDD.password = ''; // Establecer la contraseña a una cadena vacía
        await Usuario_AreaBDD.save();

        // Enviar correo electrónico de recuperación de contraseña
        await sendMailToRecoveryPasswordCustom(email, token);

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

    try {
        // Validar si el usuario existe
        const usuario = await UsuariosArea.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: `Lo sentimos, no existe el usuario` });
        }

        // Eliminar el usuario por su ID
        await UsuariosArea.destroy({ where: { id } });

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