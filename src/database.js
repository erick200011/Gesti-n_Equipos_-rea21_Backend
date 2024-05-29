import { Sequelize } from 'sequelize';
import dotenv from 'dotenv'

dotenv.config();


// Configurar la cadena de conexión a tu base de datos PostgreSQL
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction ? process.env.DATABASE_URL_RENDER : process.env.DATABASE_URL_LOCAL;



// Crear una nueva instancia de Sequelize
const sequelize = new Sequelize(connectionString, {
    dialect: 'postgres',
    dialectOptions: isProduction ? {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Configura esto según tus necesidades
      },
    } : {}
  });
  
  export default sequelize;

//======================================================================================================//

