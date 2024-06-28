import Equipos from '../models/Equipos.js';
import { Op } from 'sequelize';
import sequelize from '../database.js'; // Asegúrate de que la conexión a la base de datos esté configurada correctamente

// Crear un nuevo equipo
export const crearEquipo = async (req, res) => {
    try {
        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== req.body.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para crear un equipo en esta área" });
        }

        const { idcod, descripcion, marca, modelos, nserie, accesorios, fabricante, caracteristicas, con_instalacion, con_utilizacion, area, idsupus } = req.body;

        if (!idcod || !descripcion || !marca || !modelos || !nserie || !accesorios || !fabricante || !caracteristicas || !con_instalacion || !con_utilizacion || !area) {
            return res.status(400).json({ msg: "Todos los campos son obligatorios" });
        }

        const equipo = await Equipos.create({
            idcod,
            descripcion,
            marca,
            modelos,
            nserie,
            accesorios,
            fabricante,
            caracteristicas,
            con_instalacion,
            con_utilizacion,
            area,
            idsupus
        });

        res.status(201).json(equipo);
    } catch (error) {
        console.error("Error al crear el equipo:", error);
        res.status(500).json({ msg: "Error al crear el equipo" });
    }
};

// Obtener todos los equipos
export const obtenerEquipos = async (req, res) => {
    try {
        let equipos;

        if (req.superUsuarioBDD) {
            equipos = await Equipos.findAll();
        } else if (req.usuariosAreaBDD) {
            equipos = await Equipos.findAll({ 
                where: sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('area')), 
                    req.usuariosAreaBDD.area.toLowerCase()
                )
            });
        } else {
            return res.status(403).json({ msg: "No tienes permiso para acceder a estos datos" });
        }

        res.status(200).json(equipos);
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        res.status(500).json({ msg: "Error al obtener los equipos" });
    }
};

// Obtener un equipo por id
export const obtenerEquipoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const equipo = await Equipos.findByPk(id);

        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para acceder a este equipo" });
        }

        res.status(200).json(equipo);
    } catch (error) {
        console.error("Error al obtener el equipo:", error);
        res.status(500).json({ msg: "Error al obtener el equipo" });
    }
};

// Actualizar un equipo por id
export const actualizarEquipo = async (req, res) => {
    const { id } = req.params;
    try {
        const equipo = await Equipos.findByPk(id);

        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;
        
        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar este equipo" });
        }

        // Verificar que usuarioArea no cambie el área del equipo
        if (req.usuariosAreaBDD && req.body.area && req.body.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para cambiar el área de este equipo" });
        }

        await equipo.update(req.body);
        res.status(200).json(equipo);
    } catch (error) {
        console.error("Error al actualizar el equipo:", error);
        res.status(500).json({ msg: "Error al actualizar el equipo" });
    }
};

// Eliminar un equipo por id
export const eliminarEquipo = async (req, res) => {
    const { id } = req.params;
    try {
        const equipo = await Equipos.findByPk(id);

        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;
        
        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para eliminar este equipo" });
        }

        await equipo.destroy();
        res.status(200).json({ msg: "Equipo eliminado" });
    } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        res.status(500).json({ msg: "Error al eliminar el equipo" });
    }
};
