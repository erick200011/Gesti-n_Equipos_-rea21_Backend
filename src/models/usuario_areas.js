// Importa los módulos necesarios de Sequelize
import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../database.js'; // Asegúrate de importar tu instancia de Sequelize correctamente

// Define el modelo de usuarios_area
class UsuariosArea extends Model {
    // Método para verificar si el password ingresado es el mismo de la BDD
    async matchPassword(password) {
        return await bcrypt.compare(password, this.password);
    }

    //Método para crear un token
    async crearToken(){
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

//Define la escritura de la tabla Usuario_Area 'usuario que se manejara por area'

UsuariosArea.init({
    idcod_equipo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Asegura que cada usuario esté asociado a un solo equipo
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    token:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    confirmemail:{
        type: DataTypes.STRING,
        allowNull: true,
    }

}, {
    sequelize,
    modelName: 'UsuariosArea',
    tableName: 'usuarios_area',
    timestamps: false,
    hooks:{
        beforeCreate: async(UsuariosArea, options)=>{
            //Hash de la contraseña nates de guardarla en la base de datos
            const salt = await bcrypt.genSalt(10);
            UsuariosArea.password = await bcrypt.hash(UsuariosArea.password, salt);
        },
    },
});

export default UsuariosArea;
