import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';

class Equipos extends Model {}

Equipos.init({
    idcod: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING,
        allowNull: false
    },
    modelos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nserie: {
        type: DataTypes.STRING,
        allowNull: false
    },
    accesorios: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fabricante: {
        type: DataTypes.STRING,
        allowNull: false
    },
    caracteristicas: {
        type: DataTypes.STRING,
        allowNull: false
    },
    con_instalacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    con_utilizacion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idsupus: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Equipos',
    tableName: 'equipos',
    timestamps: false
});

export default Equipos;
