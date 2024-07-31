import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js'; // Asegúrate de que la conexión a la base de datos esté configurada correctamente

class Equipos extends Model {}

Equipos.init({
    idcod: {
        type: DataTypes.STRING,
        primaryKey: true, // Definimos idcod como clave primaria
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    modelos: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nserie: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    accesorios: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fabricante: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    caracteristicas: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    con_instalacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    con_utilizacion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    sequelize,
    modelName: 'Equipos',
    tableName: 'equipos',
    timestamps: false,
    // Excluimos explícitamente la columna 'id'
    omitNull: true,
    omitEmpty: true,
});

export default Equipos;
