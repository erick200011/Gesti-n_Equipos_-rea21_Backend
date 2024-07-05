// Importar el módulo del servidor
import app from './server.js';
// Importar la instancia de Sequelize desde database.js
import sequelize from './database.js';

// Configurar el puerto
const port = app.get('port');

// Función para iniciar el servidor y la conexión con la base de datos
async function startServer() {
    try {
        // Conectar con la base de datos
        await sequelize.authenticate();
        console.log('Base de datos conectada');

        // Sincronizar los modelos con la base de datos (crear tablas si no existen)
        await sequelize.sync({ force: false });
        console.log('Modelos sincronizados correctamente.');

        // Escuchar en el puerto configurado
        app.listen(port, () => {
            console.log(`Servidor escuchando en http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error al iniciar la aplicación:', error);
    }
}

// Llamar a la función para iniciar el servidor
startServer();
