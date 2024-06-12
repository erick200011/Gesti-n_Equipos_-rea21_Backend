import jwt from 'jsonwebtoken';
import SuperUsuario from "../models/super_usuario.js";
import UsuariosArea from "../models/usuarios_area.js"; // Asegúrate de importar tu modelo Sequelize aquí

const verificarToken = async (token) => {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken;
    } catch (error) {
        throw new Error("Formato del token no válido");
    }
};

export const verificarAutenticacion = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: "Se requiere token de autenticación" });
    }

    const token = req.headers.authorization.split(' ')[1];

    try {
        const decodedToken = await verificarToken(token);
        const { id, rol } = decodedToken;

        if (rol === "superUsuario") {
            const superUsuarioBDD = await SuperUsuario.findByPk(id, { attributes: { exclude: ['password'] } });
            if (!superUsuarioBDD) {
                throw new Error("Usuario no encontrado");
            }
            req.usuario = superUsuarioBDD.toJSON();
        } else if (rol === "usuarioArea") {
            const usuarioAreaBDD = await UsuariosArea.findByPk(id, { attributes: { exclude: ['password'] } });
            if (!usuarioAreaBDD) {
                throw new Error("Usuario por área no encontrado");
            }
            req.usuario = usuarioAreaBDD.toJSON();
        } else {
            throw new Error("Rol de usuario no válido");
        }
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
        return res.status(401).json({ msg: error.message });
    }
};
