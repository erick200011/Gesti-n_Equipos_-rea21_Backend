import Equipos from '../models/Equipos.js';

// Crear un nuevo equipo
export const crearEquipo = async (req, res) => {
    try {
        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;

        if (usuario.area && usuario.area !== req.body.area) {
            return res.status(403).json({ msg: "No tienes permiso para crear un equipo en esta área" });
        }

        const equipo = await Equipos.create(req.body);
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
            equipos = await Equipos.findAll({ where: { area: req.usuariosAreaBDD.area } });
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

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area !== equipo.area) {
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

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area !== equipo.area) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar este equipo" });
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

        if (req.usuariosAreaBDD && req.usuariosAreaBDD.area !== equipo.area) {
            return res.status(403).json({ msg: "No tienes permiso para eliminar este equipo" });
        }

        await equipo.destroy();
        res.status(200).json({ msg: "Equipo eliminado" });
    } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        res.status(500).json({ msg: "Error al eliminar el equipo" });
    }
};

