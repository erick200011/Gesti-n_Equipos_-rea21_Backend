import {Router} from 'express'
const router = Router()
import UsuarioArea from '../controllers/usuarios_areas_controller.js'

/*-------------------------------------------------------------------------------*/ 
//ruta para login 
router.post('/usuarioArea/login',UsuarioArea.login)
//ruta para pefil del usario area
router.get('/usuarioArea/perfil',UsuarioArea.perfil)
//ruta de la lista de usuario por areas registradas
router.get('/usuarioArea',UsuarioArea.listarUsuariosAreas)
//ruta para el detalle del usuario por area registrada
router.get('/usuarioArea/:id',UsuarioArea.detalleUsuarioArea)
//Ruta para el registor de los usuario de areas
router.post('/usuarioArea/registro',UsuarioArea.registro)
//ruta para actulizar el perfil de los uaurios por areas
router.put('/usuarioArea/actualizar/:id',UsuarioArea.actualizarPerfil)
//ruta para eliminar usuarios de areas
router.delete('/usuarioArea/eliminar/:id',UsuarioArea.eliminarUsuario)
/*---------------------------------------------------------------- */
// Ruta para confirmar email
router.get('/usuarioArea/confirmar/:token', UsuarioArea.confirmEmail);
//ruta para actualizar la contraseña del usuario
router.put('/usuarioArea/usuario/actualizarpassword',UsuarioArea.actualizarPassword);
//ruta para recuperar la contraseña del usuario por areas
router.post('/usuarioArea/recuperar-password', UsuarioArea.recuperarPassword);
//ruta para comprobar el token de recuperación por areas
router.get('/usuarioArea/recuperar-password/:token',UsuarioArea.comprobarTokenPasword);
//ruta para añadir la nueva contraseña por area
router.post('/usuarioArea/nuevo-password/:token', UsuarioArea.nuevoPassword);





export default router

//Ajuatar rutas para que el super usuario pueda interactuar 
/*export default {
    login,x
    perfil,x
    registro,x
    ---confirmEmail,x
    listarUsuariosAreas,x
    detalleUsuarioArea,x
    actualizarPerfil,x
  ---  actualizarPassword,x
   --- recuperarPassword,x
  ---  comprobarTokenPasword,x
   --- nuevoPassword,x
    eliminarUsuario, x
};*/