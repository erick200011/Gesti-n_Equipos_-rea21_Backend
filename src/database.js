import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'

// Configurar la cadena de conexión a tu base de datos PostgreSQL
/*const connectionString = 'postgresql://postgres:IMQ2019@localhost:5432/Equipos1';

// Crear una nueva instancia de Sequelize
const sequelize = new Sequelize(connectionString);

export default sequelize;*/

//=========================================//

// Cargar variables de entorno desde un archivo .env (opcional)
dotenv.config();
// Configurar la cadena de conexión a tu base de datos PostgreSQL usando variables de entorno
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Esto puede ser necesario dependiendo de tu configuración de SSL
        }
      }
    }
  );
  
  export default sequelize;

