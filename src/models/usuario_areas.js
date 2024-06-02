// Importa los módulos necesarios de Sequelize
import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../database.js'; // Asegúrate de importar tu instancia de Sequelize correctamente

// Define el modelo de usuarios_area
class UsuariosArea extends Model {
    // Método para verificar si el password ingresado es el mismo de la BDD
    async matchPassword(password) {
        const match= await bcrypt.compare(password, this.password);
        return { match }; // Devuelve el resultado de la comparación
    }
    // Método para crear un token
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

// Define la estructura de la tabla Usuario_Area 'usuario que se manejará por área'
UsuariosArea.init({
    idcod_equipo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Asegura que cada usuario esté asociado a un solo equipo
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
        allowNull: false,
        defaultValue: false
    },
    /*superusuario_id: {
        type: DataTypes.INTEGER, // O el tipo de dato apropiado
        allowNull: false, // No permitir que superusuario_id sea nulo
        defaultValue: 0, // Asignar un valor predeterminado, como 0
    }*/
}, {
    sequelize,
    modelName: 'UsuariosArea',
    tableName: 'usuarios_area',
    timestamps: false,
    hooks: {
        beforeCreate: async (usuarioArea, options) => {
            // Hash de la contraseña antes de guardarla en la base de datos
            const salt = await bcrypt.genSalt(10);
            usuarioArea.password = await bcrypt.hash(usuarioArea.password, salt);
        },
    },
});

export default UsuariosArea;
