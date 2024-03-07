import { check, validationResult } from 'express-validator'


//Validacion para llenar todos los campos
export const validacionSuperUsuario =[
    check(["nombre","apellido","email","password"])
        .exists()
            .withMessage('Los campos "nombre", "apellido", "email" y/o "password" son obligatorios')
        .notEmpty()
            .withMessage('Los campos "nombre", "apellido", "email" y/o "password" no pueden estar vacíos')
        .customSanitizer(value => value?.trim()),

    check(["nombre","apellido"])
        .isLength({ min: 3, max: 12 })
            .withMessage('El campo "nombre" y/o "apellido" debe(n) tener entre 3 y 12 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
            .withMessage('El campo "nombre" y/o "apellido" debe(n) contener solo letras')
        .customSanitizer(value => value?.trim()),


//validación para que el correo contenga el dominio de los usuarios al ual apunta esté programa
    check("email")
        .isEmail()
            .withMessage('El campo "email" no es correcto')
        .matches(/@quito\.gob\.ec$/)
            .withMessage('El correo debe ser del dominio @quito.gob.ec')
        .customSanitizer(value => value?.trim()),

    check("password")
        .isLength({ min: 5 })
            .withMessage('El campo "password" debe tener al menos 5 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/)
            .withMessage('El campo "password" debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial')
        .customSanitizer(value => value?.trim()),


    (req,res,next)=>{
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
]
