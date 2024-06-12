import express from 'express';
import { crearEquipo, obtenerEquipos, obtenerEquipoPorId, actualizarEquipo, eliminarEquipo } from '../controllers/Equipos_controller.js';
import { verificarAutenticacion} from '../middlewares/autenticacion.js';

const router = express.Router();

/*-------------------------------------------------------------------------------*/
// Ruta para crear un nuevo equipo
router.post('/equipos', verificarAutenticacion, crearEquipo);
// Ruta para obtener la lista de todos los equipos
router.get('/equipos', verificarAutenticacion, obtenerEquipos);
// Ruta para obtener los detalles de un equipo específico por ID
router.get('/equipos/:id', verificarAutenticacion, obtenerEquipoPorId);
// Ruta para actualizar un equipo existente por ID
router.put('/equipos/:id', verificarAutenticacion, actualizarEquipo);
// Ruta para eliminar un equipo existente por ID
router.delete('/equipos/:id', verificarAutenticacion, eliminarEquipo);
/*-------------------------------------------------------------------------------*/
export default router;
