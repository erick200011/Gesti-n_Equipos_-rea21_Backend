import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js';
import Equipos from './Equipos.js'


class Verificacion extends Model {}

Verificacion.init({
    idverificacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    id_equipo: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: Equipos,
            key: 'idcod'
        },
    },
    ver_interna: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ver_externa: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    operativo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fuera_de_uso: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dado_de_baja: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    observaciones: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    estado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    elaborado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fecha_elab: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    revisado: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    fecha_rev: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ul_fecha_ac: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    area: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Verificacion',
    tableName: 'verificacion',
    timestamps: false,
});

export default Verificacion;
