import express from 'express';
import { crearVerificacion, obtenerVerificaciones, obtenerVerificacionPorIdEquipo, actualizarVerificacionPorIdEquipo, eliminarVerificacionPorIdEquipo } from '../controllers/Verificacion_Controller.js';
import { verificarAutenticacion } from '../middlewares/autenticacion.js';

const router = express.Router();

/*-------------------------------------------------------------------------------*/
// Ruta para crear una nueva verificación
router.post('/verificaciones', verificarAutenticacion, crearVerificacion);
// Ruta para obtener la lista de todas las verificaciones
router.get('/verificaciones', verificarAutenticacion, obtenerVerificaciones);
// Ruta para obtener los detalles de una verificación específica por ID de equipo
router.get('/verificaciones/:id_equipo', verificarAutenticacion, obtenerVerificacionPorIdEquipo);
// Ruta para actualizar una verificación existente por ID de equipo
router.put('/verificaciones/:id_equipo', verificarAutenticacion, actualizarVerificacionPorIdEquipo);
// Ruta para eliminar una verificación existente por ID de equipo
router.delete('/verificaciones/:id_equipo', verificarAutenticacion, eliminarVerificacionPorIdEquipo);
export default router;