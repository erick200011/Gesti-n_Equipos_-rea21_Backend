import Verificacion from '../models/Verificacion.js';
import Equipos from '../models/Equipos.js';
import { Op } from 'sequelize';
import sequelize from '../database.js';

// Crear una nueva verificación
export const crearVerificacion = async (req, res) => {
    try {
        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        const { id_equipo, ver_interna, ver_externa, operativo, fuera_de_uso, dado_de_baja, observaciones, estado, elaborado, fecha_elab, revisado, fecha_rev, ul_fecha_ac } = req.body;

        const equipo = await Equipos.findOne({ where: { idcod: id_equipo } });

        if (!equipo) {
            return res.status(404).json({ msg: "Equipo no encontrado" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para crear una verificación en esta área" });
        }

        //const area = equipo.area.toLowerCase();
        const capitalizeFirstLetter = (string) => {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };
        
        const area = capitalizeFirstLetter(equipo.area);        

        const verificacion = await Verificacion.create({
            id_equipo,
            ver_interna,
            ver_externa,
            operativo,
            fuera_de_uso,
            dado_de_baja,
            observaciones,
            estado,
            elaborado,
            fecha_elab,
            revisado,
            fecha_rev,
            ul_fecha_ac,
            area
        });

        res.status(201).json(verificacion);
    } catch (error) {
        console.error("Error al crear la verificación:", error);
        res.status(500).json({ msg: "Error al crear la verificación" });
    }
};

// Obtener todas las verificaciones
export const obtenerVerificaciones = async (req, res) => {
    try {
        let verificaciones;

        if (req.superUsuarioBDD) {
            verificaciones = await Verificacion.findAll();
        } else if (req.usuariosAreaBDD) {
            verificaciones = await Verificacion.findAll({
                where: sequelize.where(
                    sequelize.fn('LOWER', sequelize.col('area')),
                    req.usuariosAreaBDD.area.toLowerCase()
                )
            });
        } else {
            return res.status(403).json({ msg: "No tienes permiso para acceder a estos datos" });
        }

        res.status(200).json(verificaciones);
    } catch (error) {
        console.error("Error al obtener las verificaciones:", error);
        res.status(500).json({ msg: "Error al obtener las verificaciones" });
    }
};

// Buscar una verificación por id_equipo
export const obtenerVerificacionPorIdEquipo = async (req, res) => {
    const { id_equipo } = req.params;
    try {
        const verificacion = await Verificacion.findOne({ where: { id_equipo } });

        if (!verificacion) {
            return res.status(404).json({ msg: "Verificación no encontrada" });
        }

        const equipo = await Equipos.findByPk(id_equipo);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para ver esta verificación" });
        }

        res.status(200).json(verificacion);
    } catch (error) {
        console.error("Error al obtener la verificación:", error);
        res.status(500).json({ msg: "Error al obtener la verificación" });
    }
};

// Actualizar una verificación por id_equipo
export const actualizarVerificacionPorIdEquipo = async (req, res) => {
    const { id_equipo } = req.params;
    try {
        const verificacion = await Verificacion.findOne({ where: { id_equipo } });

        if (!verificacion) {
            return res.status(404).json({ msg: "Verificación no encontrada" });
        }

        const equipo = await Equipos.findByPk(id_equipo);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar esta verificación" });
        }

        await verificacion.update(req.body);
        res.status(200).json(verificacion);
    } catch (error) {
        console.error("Error al actualizar la verificación:", error);
        res.status(500).json({ msg: "Error al actualizar la verificación" });
    }
};

// Eliminar una verificación por id_equipo
export const eliminarVerificacionPorIdEquipo = async (req, res) => {
    const { id_equipo } = req.params;
    try {
        const verificacion = await Verificacion.findOne({ where: { id_equipo } });

        if (!verificacion) {
            return res.status(404).json({ msg: "Verificación no encontrada" });
        }

        const equipo = await Equipos.findByPk(id_equipo);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area.toLowerCase() !== equipo.area.toLowerCase()) {
            return res.status(403).json({ msg: "No tienes permiso para eliminar esta verificación" });
        }

        await verificacion.destroy();
        res.status(200).json({ msg: "Verificación eliminada" });
    } catch (error) {
        console.error("Error al eliminar la verificación:", error);
        res.status(500).json({ msg: "Error al eliminar la verificación" });
    }
};
