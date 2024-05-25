// Importar el módulo del servidor
//import app from './server.js';

// funcion para render
import express from 'express';

// Importar la instancia de Sequelize desde database.js
import sequelize from './database.js';

// Configurar el puerto
const app = express();

//const port = app.get('port');

const PORT = process.env.PORT || 3000;

// Escuchar en el puerto configurado
/*app.listen(port, async () => {
    console.log(`Server ok on http://localhost:${port}`);
    
    // Intentar conectar con la base de datos
    try {
        await sequelize.authenticate();
        console.log('Base de datos conectada');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
});*/

app.get('/', async (req, res) => {
    try {
      await sequelize.authenticate();
      console.log('Conexión a la base de datos establecida correctamente.');
      res.send('Conexión a la base de datos establecida correctamente.');
    } catch (error) {
      console.error('No se pudo conectar a la base de datos:', error);
      res.status(500).send('Error en el servidor');
    }
  });
  
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
