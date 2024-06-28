import Mantenimiento from '../models/Mantenimiento.js';
import Equipos from '../models/Equipos.js';
import { Op } from 'sequelize';

// Crear un nuevo registro de mantenimiento
export const crearMantenimiento = async (req, res) => {
    try {
        console.log('Inicio de la función crearMantenimiento');
        const { ul_fecha_man_in, prox_fecha_man_in, ul_fecha_man_ex, prox_fecha_man_ex, proveedor_idpr, id_equipo, comentario } = req.body;

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;
        console.log(`Usuario obtenido: ${JSON.stringify(usuario, null, 2)}`);

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para realizar esta acción" });
        }

        // Verificar permisos para el área del equipo
        if (req.usuariosAreaBDD) {
            const equipo = await Equipos.findOne({ where: { idcod: id_equipo } });
            console.log(`Equipo encontrado: ${JSON.stringify(equipo, null, 2)}`);
            if (!equipo || !equipo.idcod.startsWith(`A-${usuario.area.padStart(2, '0')}-`)) {
                return res.status(403).json({ msg: "No tienes permiso para crear un mantenimiento en esta área" });
            }
        }

        const mantenimiento = await Mantenimiento.create({
            ul_fecha_man_in,
            prox_fecha_man_in,
            ul_fecha_man_ex,
            prox_fecha_man_ex,
            proveedor_idpr,
            id_equipo,
            comentario
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
        console.log('Inicio de la función obtenerMantenimientos');
        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;
        console.log(`Usuario obtenido: ${JSON.stringify(usuario, null, 2)}`);

        if (!usuario) {
            return res.status(403).json({ msg: "No tienes permiso para acceder a estos datos" });
        }

        let mantenimientos;

        if (usuario.rol === 'superUsuario') {
            console.log('Rol de usuario: superUsuario');
            mantenimientos = await Mantenimiento.findAll();
            console.log(`Mantenimientos encontrados: ${JSON.stringify(mantenimientos, null, 2)}`);
        } else if (usuario.rol === 'UsuariosArea') {
            const areaCode = usuario.area.split(' ')[1].padStart(2, '0'); // Obtener el código del área
            console.log(`Buscando equipos para el área: A-${areaCode}-`);
            const equipos = await Equipos.findAll({
                where: {
                    idcod: {
                        [Op.like]: `A-${areaCode}-%`
                    }
                }
            });
            console.log(`Equipos encontrados: ${JSON.stringify(equipos, null, 2)}`);

            if (equipos.length === 0) {
                console.log('No se encontraron equipos para esta área');
                return res.status(404).json({ msg: "No se encontraron equipos para esta área" });
            }

            const equipoIds = equipos.map(equipo => equipo.id);
            console.log(`IDs de equipos encontrados: ${equipoIds}`);

            mantenimientos = await Mantenimiento.findAll({
                where: {
                    id_equipo: {
                        [Op.in]: equipoIds
                    }
                }
            });
            console.log(`Mantenimientos encontrados: ${JSON.stringify(mantenimientos, null, 2)}`);
        }

        if (!mantenimientos || mantenimientos.length === 0) {
            console.log('No se encontraron mantenimientos');
            return res.status(404).json({ msg: "No se encontraron mantenimientos" });
        }

        res.status(200).json(mantenimientos);
    } catch (error) {
        console.error("Error al obtener los mantenimientos:", error);
        res.status(500).json({ msg: "Error al obtener los mantenimientos" });
    }
};

// Obtener un mantenimiento por ID
export const obtenerMantenimientoPorId = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('Inicio de la función obtenerMantenimientoPorId');
        const mantenimiento = await Mantenimiento.findByPk(id);
        console.log(`Mantenimiento encontrado: ${JSON.stringify(mantenimiento, null, 2)}`);

        if (!mantenimiento) {
            return res.status(404).json({ msg: "Mantenimiento no encontrado" });
        }

        const equipo = await Equipos.findByPk(mantenimiento.id_equipo);
        console.log(`Equipo encontrado para mantenimiento: ${JSON.stringify(equipo, null, 2)}`);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;
        console.log(`Usuario obtenido: ${JSON.stringify(usuario, null, 2)}`);
        if (!usuario || (usuario.rol !== 'superUsuario' && !equipo.idcod.startswith(`A-${usuario.area.padStart(2, '0')}-`))) {
            return res.status(403).json({ msg: "No tienes permiso para acceder a este mantenimiento" });
        }

        res.status(200).json(mantenimiento);
    } catch (error) {
        console.error("Error al obtener el mantenimiento:", error);
        res.status(500).json({ msg: "Error al obtener el mantenimiento" });
    }
};

// Actualizar un mantenimiento por ID
export const actualizarMantenimiento = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('Inicio de la función actualizarMantenimiento');
        const mantenimiento = await Mantenimiento.findByPk(id);
        console.log(`Mantenimiento encontrado: ${JSON.stringify(mantenimiento, null, 2)}`);

        if (!mantenimiento) {
            return res.status(404).json({ msg: "Mantenimiento no encontrado" });
        }

        const equipo = await Equipos.findByPk(mantenimiento.id_equipo);
        console.log(`Equipo encontrado para mantenimiento: ${JSON.stringify(equipo, null, 2)}`);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;
        console.log(`Usuario obtenido: ${JSON.stringify(usuario, null, 2)}`);
        if (!usuario || (usuario.rol !== 'superUsuario' && !equipo.idcod.startsWith(`A-${usuario.area.padStart(2, '0')}-`))) {
            return res.status(403).json({ msg: "No tienes permiso para actualizar este mantenimiento" });
        }

        await mantenimiento.update(req.body);
        res.status(200).json(mantenimiento);
    } catch (error) {
        console.error("Error al actualizar el mantenimiento:", error);
        res.status(500).json({ msg: "Error al actualizar el mantenimiento" });
    }
};

// Eliminar un mantenimiento por ID
export const eliminarMantenimiento = async (req, res) => {
    const { id } = req.params;
    try {
        console.log('Inicio de la función eliminarMantenimiento');
        const mantenimiento = await Mantenimiento.findByPk(id);
        console.log(`Mantenimiento encontrado: ${JSON.stringify(mantenimiento, null, 2)}`);

        if (!mantenimiento) {
            return res.status(404).json({ msg: "Mantenimiento no encontrado" });
        }

        const equipo = await Equipos.findByPk(mantenimiento.id_equipo);
        console.log(`Equipo encontrado para mantenimiento: ${JSON.stringify(equipo, null, 2)}`);

        const usuario = req.superUsuarioBDD || req.usuariosAreaBDD;
        console.log(`Usuario obtenido: ${JSON.stringify(usuario, null, 2)}`);
        if (!usuario || (usuario.rol !== 'superUsuario' && !equipo.idcod.startsWith(`A-${usuario.area.padStart(2, '0')}-`))) {
            return res.status(403).json({ msg: "No tienes permiso para eliminar este mantenimiento" });
        }

        await mantenimiento.destroy();
        res.status(200).json({ msg: "Mantenimiento eliminado" });
    } catch (error) {
        console.error("Error al eliminar el mantenimiento:", error);
        res.status(500).json({ msg: "Error al eliminar el mantenimiento" });
    }
};
