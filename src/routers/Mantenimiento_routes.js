import express from 'express';
import { crearMantenimiento, obtenerMantenimientos, obtenerMantenimientoPorId, actualizarMantenimiento, eliminarMantenimiento } from '../controllers/Mantenimiento_controller.js';
import { verificarAutenticacion } from '../middlewares/autenticacion.js';

const router = express.Router();

/*-------------------------------------------------------------------------------*/
// Ruta para crear un nuevo mantenimiento
router.post('/mantenimientos', verificarAutenticacion, crearMantenimiento);
// Ruta para obtener la lista de todos los mantenimientos
router.get('/mantenimientos', verificarAutenticacion, obtenerMantenimientos);
// Ruta para obtener los detalles de un mantenimiento específico por ID
router.get('/mantenimientos/:id', verificarAutenticacion, obtenerMantenimientoPorId);
// Ruta para actualizar un mantenimiento existente por ID
router.put('/mantenimientos/:id', verificarAutenticacion, actualizarMantenimiento);
// Ruta para eliminar un mantenimiento existente por ID
router.delete('/mantenimientos/:id', verificarAutenticacion, eliminarMantenimiento);
/*-------------------------------------------------------------------------------*/

export default router;
