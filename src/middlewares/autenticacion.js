import jwt from 'jsonwebtoken';
import SuperUsuario  from "../models/super_usuario.js"; // Asegúrate de importar tu modelo Sequelize aquí
import UsuariosArea from '../models/usuario_areas.js';

const verificarAutenticacion = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(404).json({ msg: "Lo sentimos, debes proporcionar un token" });
    }

    const { authorization } = req.headers;

    try {
        const token = authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const { id, rol } = decodedToken;

        if (rol === "superUsuario") {
            const superUsuarioBDD = await SuperUsuario.findByPk(id, { attributes: { exclude: ['password'] } });

            if (!superUsuarioBDD) {
                return res.status(404).json({ msg: "Lo sentimos, el usuario no se encuentra registrado" });
            }

            req.superUsuarioBDD = superUsuarioBDD.toJSON(); // Convertir el modelo Sequelize a objeto JSON
            next();
        } else {
            req.usuariosAreaBDD = await UsuariosArea.findById(id).lean().select("password")
        }
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
        return res.status(404).json({ msg: "Formato del token no válido" });
    }
};

export default verificarAutenticacion;
