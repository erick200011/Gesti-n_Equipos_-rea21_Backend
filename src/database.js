import { Sequelize } from 'sequelize';

// Configurar la cadena de conexión a tu base de datos PostgreSQL
const connectionString = 'postgresql://postgres:IMQ2019@localhost:5432/EQUIPOS';

// Crear una nueva instancia de Sequelize
const sequelize = new Sequelize(connectionString);

export default sequelize;
