import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js'; // Asegúrate de que la conexión a la base de datos esté configurada correctamente

class Calibracion extends Model {}

Calibracion.init({
    id_calibracion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    ul_fecha_cal_in: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    prox_fecha_cal_in: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ul_fecha_cal_ex: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    prox_fecha_cal_ex: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    idcod_calibracion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    idpr_calibracion: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    comentarios: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    area: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'Calibracion',
    tableName: 'calibracion',
    timestamps: false,
});

export default Calibracion;
