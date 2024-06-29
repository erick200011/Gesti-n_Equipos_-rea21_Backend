import express from 'express';
import { crearCalibracion, obtenerCalibraciones, obtenerCalibracionPorIdCod, actualizarCalibracionPorIdCod, eliminarCalibracionPorIdCod } from '../controllers/Calibracion_controller.js';
import { verificarAutenticacion } from '../middlewares/autenticacion.js';

const router = express.Router();

/*-------------------------------------------------------------------------------*/
// Ruta para crear una nueva calibración
router.post('/calibraciones', verificarAutenticacion, crearCalibracion);
// Ruta para obtener la lista de todas las calibraciones
router.get('/calibraciones', verificarAutenticacion, obtenerCalibraciones);
// Ruta para obtener los detalles de una calibración específica por ID de equipo
router.get('/calibraciones/:idcod_calibracion', verificarAutenticacion, obtenerCalibracionPorIdCod);
// Ruta para actualizar una calibración existente por ID de equipo
router.put('/calibraciones/:idcod_calibracion', verificarAutenticacion, actualizarCalibracionPorIdCod);
// Ruta para eliminar una calibración existente por ID de equipo
router.delete('/calibraciones/:idcod_calibracion', verificarAutenticacion, eliminarCalibracionPorIdCod);
/*-------------------------------------------------------------------------------*/

export default router;
