// Importa los módulos necesarios de Sequelize
import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../database.js'; // Asegúrate de importar la instancia de Sequelize desde tu archivo de configuración

// Define el modelo del superusuario
class SuperUsuario extends Model {
    // Método para verificar si el password ingresado es el mismo de la BDD
    async matchPassword(password) {
        const match= await bcrypt.compare(password, this.password);
        return { match }; // Devuelve el resultado de la comparación

    }

    // Método para crear un token
    async crearToken() {
        const tokenGenerado = Math.random().toString(36).slice(2);
        this.token = tokenGenerado;
        await this.save(); // Guarda el token en la base de datos
        return tokenGenerado;
    }

    async encryptPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}

// Define la estructura de la tabla SuperUsuario
SuperUsuario.init({
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
        type: DataTypes.STRING, // Tipo de dato para almacenar el token
        allowNull: true, // Puedes ajustar esto según tus requisitos
    },
    confirmemail: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize, // Pasamos la instancia de Sequelize
    modelName: 'SuperUsuario',
    tableName: 'super_usuario',
    timestamps: false,
    hooks: {
        beforeCreate: async (superUsuario, options) => {
            // Hash de la contraseña antes de guardarla en la base de datos
            const salt = await bcrypt.genSalt(10);
            superUsuario.password = await bcrypt.hash(superUsuario.password, salt);
        },
    },
});
export default SuperUsuario;
