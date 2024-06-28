import { DataTypes, Model } from 'sequelize';
import sequelize from '../database.js'; // Asegúrate de que la conexión a la base de datos esté configurada correctamente

class Mantenimiento extends Model {}

Mantenimiento.init({
    idmantenimiento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    ul_fecha_man_in: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    prox_fecha_man_in: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    ul_fecha_man_ex: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    prox_fecha_man_ex: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    proveedor_idpr: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    id_equipo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    comentario: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'Mantenimiento',
    tableName: 'mantenimiento',
    timestamps: false,
});

export default Mantenimiento;
