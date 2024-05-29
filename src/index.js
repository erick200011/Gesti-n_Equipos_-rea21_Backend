// Importar el módulo del servidor
import app from './server.js';
// Importar la instancia de Sequelize desde database.js
import sequelize from './database.js';

// Configurar el puerto
const port = app.get('port');

// Escuchar en el puerto configurado
app.listen(port, async () => {
    console.log(`Server ok on http://localhost:${port}`);
    
    // Intentar conectar con la base de datos
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
});

/*==========================================================================*/ 

