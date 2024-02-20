// Importa los módulos necesarios de Sequelize
import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from './sequelize'; // Asegúrate de importar tu instancia de Sequelize correctamente

// Define el modelo de usuarios_area
class UsuariosArea extends Model {
    // Método para verificar si el password ingresado es el mismo de la BDD
    async matchPassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

UsuariosArea.init({
    idcod_equipo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Asegura que cada usuario esté asociado a un solo equipo
    },
}, {
    sequelize,
    modelName: 'UsuariosArea',
    timestamps: true,
});

export default UsuariosArea;
