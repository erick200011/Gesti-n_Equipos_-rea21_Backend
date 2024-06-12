import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../database.js';

class UsuariosArea extends Model {
    async matchPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    async crearToken() {
        const tokenGenerado = Math.random().toString(36).slice(2);
        this.token = tokenGenerado;
        await this.save();
        return tokenGenerado;
    }

    async encryptPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

UsuariosArea.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    confirmemail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    area: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'UsuariosArea',
    tableName: 'usuarios_area',
    timestamps: false,
    hooks: {
        beforeCreate: async (usuarioArea, options) => {
            const salt = await bcrypt.genSalt(10);
            usuarioArea.password = await bcrypt.hash(usuarioArea.password, salt);
        },
    },
});

export default UsuariosArea;
