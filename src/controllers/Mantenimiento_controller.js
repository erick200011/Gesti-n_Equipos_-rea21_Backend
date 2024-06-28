import Mantenimiento from '../models/Mantenimiento.js';
import Equipos from '../models/Equipos.js';
import { Op } from 'sequelize';
import sequelize from '../database.js'; // Asegúrate de importar sequelize

// Crear un nuevo registro de mantenimiento
export const crearMantenimiento = async (req, res) => {
    try {
        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        const { ul_fecha_man_in, prox_fecha_man_in, ul_fecha_man_ex, prox_fecha_man_ex, proveedor_idpr, id_equipo, comentario } = req.body;

        // Verificar si el equipo ya tiene un mantenimiento registrado
        const mantenimientoExistente = await Mantenimiento.findOne({ where: { id_equipo } });
        if (mantenimientoExistente) {
            return res.status(400).json({ msg: "El equipo ya tiene un mantenimiento registrado" });
        }

        const equipo = await Equipos.findOne({ where: { idcod: id_equipo } });

        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para crear un mantenimiento en esta área" });
        }

        const area = equipo.area.toLowerCase(); // Convertir el área a minúsculas

        const mantenimiento = await Mantenimiento.create({
            ul_fecha_man_in,
            prox_fecha_man_in,
            ul_fecha_man_ex,
            prox_fecha_man_ex,
            proveedor_idpr,
            id_equipo,
            comentario,
            area
        });

        res.status(201).json(mantenimiento);
    } catch (error) {
        console.error("Error al crear el mantenimiento:", error);
        res.status(500).json({ msg: "Error al crear el mantenimiento" });
    }
};

// Obtener todos los registros de mantenimiento
export const obtenerMantenimientos = async (req, res) => {
    try {
        let mantenimientos;

        if (req.superUsuarioBDD) {
            mantenimientos = await Mantenimiento.findAll();
        } else if (req.usuariosAreaBDD) {
            mantenimientos = await Mantenimiento.findAll({
                where: sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('area')),
                    req.usuariosAreaBDD.area.toLowerCase()
                )
            });
        } else {
            return res.status(403).json({ msg: "No tienes permiso para acceder a estos datos" });
        }

        res.status(200).json(mantenimientos);
    } catch (error) {
        console.error("Error al obtener los mantenimientos:", error);
        res.status(500).json({ msg: "Error al obtener los mantenimientos" });
    }
};

// Buscar un mantenimiento por id_equipo
export const obtenerMantenimientoPorIdEquipo = async (req, res) => {
    const { id_equipo } = req.params;
    try {
        const mantenimiento = await Mantenimiento.findOne({ where: { id_equipo } });

        if (!mantenimiento) {
            return res.status(404).json({ msg: "Mantenimiento no encontrado" });
        }

        const equipo = await Equipos.findByPk(id_equipo);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para ver este mantenimiento" });
        }

        res.status(200).json(mantenimiento);
    } catch (error) {
        console.error("Error al obtener el mantenimiento:", error);
        res.status(500).json({ msg: "Error al obtener el mantenimiento" });
    }
};


// Actualizar un mantenimiento por id_equipo
export const actualizarMantenimientoPorIdEquipo = async (req, res) => {
    const { id_equipo } = req.params;
    try {
        const mantenimiento = await Mantenimiento.findOne({ where: { id_equipo } });

        if (!mantenimiento) {
            return res.status(404).json({ msg: "Mantenimiento no encontrado" });
        }

        const equipo = await Equipos.findByPk(id_equipo);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar este mantenimiento" });
        }

        await mantenimiento.update(req.body);
        res.status(200).json(mantenimiento);
    } catch (error) {
        console.error("Error al actualizar el mantenimiento:", error);
        res.status(500).json({ msg: "Error al actualizar el mantenimiento" });
    }
};


// Eliminar un mantenimiento por id_equipo
export const eliminarMantenimientoPorIdEquipo = async (req, res) => {
    const { id_equipo } = req.params;
    try {
        const mantenimiento = await Mantenimiento.findOne({ where: { id_equipo } });

        if (!mantenimiento) {
            return res.status(404).json({ msg: "Mantenimiento no encontrado" });
        }

        const equipo = await Equipos.findByPk(id_equipo);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para eliminar este mantenimiento" });
        }

        await mantenimiento.destroy();
        res.status(200).json({ msg: "Mantenimiento eliminado" });
    } catch (error) {
        console.error("Error al eliminar el mantenimiento:", error);
        res.status(500).json({ msg: "Error al eliminar el mantenimiento" });
    }
};
