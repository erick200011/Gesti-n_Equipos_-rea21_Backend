// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routers/super_usuario_routes.js';
import routerUsuariosArea from './routers/usuario_area_routes.js';
import routerEquipos from './routers/Equipos_routes.js';
import routerMantenimiento from './routers/Mantenimiento_routes.js'
import routerVerificacion from './routers/Verificacion_routes.js'
import routerCalibracion from './routers/Calibracion_routes.js'

// Inicializaciones
const app = express();
dotenv.config();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.use(cors());

// Middlewares
app.use(express.json());

// Rutas
app.get('/', (req, res) => {
    res.send("Server on");
});
app.use('/api', router);
app.use('/api', routerUsuariosArea);
app.use('/api', routerEquipos);
app.use('/api', routerMantenimiento);
app.use('/api', routerVerificacion);
app.use('/api', routerCalibracion);

// Manejo de ruta no encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));



// Exportar la instancia de express por medio de app
export default app;
