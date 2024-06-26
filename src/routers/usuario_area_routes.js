import {Router} from 'express'
const router = Router()
import UsuarioArea from '../controllers/usuarios_areas_controller.js'
import { verificarAutenticacion} from '../middlewares/autenticacion.js';
import { validacionActualizarPassword, validarActualizacionPassword } from '../middlewares/validacionSuperUsuario.js';

/*-------------------------------------------------------------------------------*/ 
//ruta para login 
router.post('/usuarioArea/login',UsuarioArea.login)
//ruta para pefil del usario area
router.get('/usuarioArea/perfil',verificarAutenticacion,UsuarioArea.perfil) //Tiene
//ruta de la lista de usuario por areas registradas
router.get('/usuarioArea',verificarAutenticacion,UsuarioArea.listarUsuariosAreas)//Tiene
//ruta para el detalle del usuario por area registrada
router.get('/usuarioArea/:id',verificarAutenticacion,UsuarioArea.detalleUsuarioArea)//Tiene
//Ruta para el registor de los usuario de areas
router.post('/usuarioArea/registro',verificarAutenticacion,UsuarioArea.registro)//Tiene
//ruta para actulizar el perfil de los uaurios por areas
router.put('/usuarioArea/actualizar/:id',verificarAutenticacion,UsuarioArea.actualizarPerfil)//Tiene
//ruta para eliminar usuarios de areas
router.delete('/usuarioArea/eliminar/:id',verificarAutenticacion,UsuarioArea.eliminarUsuario)//Tiene
/*---------------------------------------------------------------- */
// Ruta para confirmar email
router.get('/usuarioArea/confirmar/:token',UsuarioArea.confirmEmail);
//ruta para actualizar la contraseña del usuario
router.put('/usuarioArea/usuario/actualizarpassword',verificarAutenticacion,validarActualizacionPassword,UsuarioArea.actualizarPassword);
//ruta para recuperar la contraseña del usuario por areas
router.post('/usuarioArea/recuperar-password',UsuarioArea.recuperarPassword);
//ruta para comprobar el token de recuperación por areas
router.get('/usuarioArea/recuperar-password/:token',UsuarioArea.comprobarTokenPasword);
//ruta para añadir la nueva contraseña por area
router.post('/usuarioArea/nuevo-password/:token',validacionActualizarPassword, UsuarioArea.nuevoPassword);

export default router
