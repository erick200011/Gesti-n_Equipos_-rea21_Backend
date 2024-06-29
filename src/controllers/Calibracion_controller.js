import Calibracion from '../models/Calibracion.js';
import Equipos from '../models/Equipos.js';
import { Op } from 'sequelize';
import sequelize from '../database.js';

// Crear una nueva calibración
export const crearCalibracion = async (req, res) => {
    try {
        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        const { ul_fecha_cal_in, prox_fecha_cal_in, ul_fecha_cal_ex, prox_fecha_cal_ex, idcod_calibracion, comentarios } = req.body;

        const equipo = await Equipos.findOne({ where: { idcod: idcod_calibracion } });

        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para crear una calibración en esta área" });
        }

        const area = equipo.area.toLowerCase();

        const calibracion = await Calibracion.create({
            ul_fecha_cal_in,
            prox_fecha_cal_in,
            ul_fecha_cal_ex,
            prox_fecha_cal_ex,
            idcod_calibracion,
            comentarios,
            area
        });

        res.status(201).json(calibracion);
    } catch (error) {
        console.error("Error al crear la calibración:", error);
        res.status(500).json({ msg: "Error al crear la calibración" });
    }
};

// Obtener todas las calibraciones
export const obtenerCalibraciones = async (req, res) => {
    try {
        let calibraciones;

        if (req.superUsuarioBDD) {
            calibraciones = await Calibracion.findAll();
        } else if (req.usuariosAreaBDD) {
            calibraciones = await Calibracion.findAll({
                where: sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('area')),
                    req.usuariosAreaBDD.area.toLowerCase()
                )
            });
        } else {
            return res.status(403).json({ msg: "No tienes permiso para acceder a estos datos" });
        }

        res.status(200).json(calibraciones);
    } catch (error) {
        console.error("Error al obtener las calibraciones:", error);
        res.status(500).json({ msg: "Error al obtener las calibraciones" });
    }
};

// Buscar una calibración por idcod_calibracion
export const obtenerCalibracionPorIdCod = async (req, res) => {
    const { idcod_calibracion } = req.params;
    try {
        const calibracion = await Calibracion.findOne({ where: { idcod_calibracion } });

        if (!calibracion) {
            return res.status(404).json({ msg: "Calibración no encontrada" });
        }

        const equipo = await Equipos.findByPk(idcod_calibracion);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para ver esta calibración" });
        }

        res.status(200).json(calibracion);
    } catch (error) {
        console.error("Error al obtener la calibración:", error);
        res.status(500).json({ msg: "Error al obtener la calibración" });
    }
};

// Actualizar una calibración por idcod_calibracion
export const actualizarCalibracionPorIdCod = async (req, res) => {
    const { idcod_calibracion } = req.params;
    try {
        const calibracion = await Calibracion.findOne({ where: { idcod_calibracion } });

        if (!calibracion) {
            return res.status(404).json({ msg: "Calibración no encontrada" });
        }

        const equipo = await Equipos.findByPk(idcod_calibracion);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar esta calibración" });
        }

        await calibracion.update(req.body);
        res.status(200).json(calibracion);
    } catch (error) {
        console.error("Error al actualizar la calibración:", error);
        res.status(500).json({ msg: "Error al actualizar la calibración" });
    }
};

// Eliminar una calibración por idcod_calibracion
export const eliminarCalibracionPorIdCod = async (req, res) => {
    const { idcod_calibracion } = req.params;
    try {
        const calibracion = await Calibracion.findOne({ where: { idcod_calibracion } });

        if (!calibracion) {
            return res.status(404).json({ msg: "Calibración no encontrada" });
        }

        const equipo = await Equipos.findByPk(idcod_calibracion);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para eliminar esta calibración" });
        }

        await calibracion.destroy();
        res.status(200).json({ msg: "Calibración eliminada" });
    } catch (error) {
        console.error("Error al eliminar la calibración:", error);
        res.status(500).json({ msg: "Error al eliminar la calibración" });
    }
};
