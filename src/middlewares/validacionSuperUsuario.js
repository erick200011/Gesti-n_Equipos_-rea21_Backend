import { check, validationResult } from 'express-validator';

// Validación para llenar todos los campos
export const validacionSuperUsuario = [
    check(["nombre", "apellido", "email", "password"])
        .exists()
        .withMessage('Los campos "nombre", "apellido", "email" y/o "password" son obligatorios')
        .notEmpty()
        .withMessage('Los campos "nombre", "apellido", "email" y/o "password" no pueden estar vacíos')
        .customSanitizer(value => value?.trim()),

    check(["nombre", "apellido"])
        .isLength({ min: 3, max: 12 })
        .withMessage('El campo "nombre" y/o "apellido" debe(n) tener entre 3 y 12 caracteres')
        .isAlpha('es-ES', { ignore: 'áéíóúÁÉÍÓÚñÑ' })
        .withMessage('El campo "nombre" y/o "apellido" debe(n) contener solo letras')
        .customSanitizer(value => value?.trim()),

    // Validación para que el correo contenga el dominio específico (desactivada temporalmente)
    // Comenta o elimina esta validación para activarla
    /*check("email")
        .isEmail()
        .withMessage('El campo "email" no es correcto')
        .matches(/@quito\.gob\.ec$/)
        .withMessage('El correo debe ser del dominio @quito.gob.ec')
        .customSanitizer(value => value?.trim()),*/

    check("password")
        .isLength({ min: 5 })
        .withMessage('El campo "password" debe tener al menos 5 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/)
        .withMessage('El campo "password" debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial')
        .customSanitizer(value => value?.trim()),

    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
];

export const validacionActualizarPassword = [
    check("password")
        .exists()
        .withMessage('El campo "password" es obligatorio')
        .notEmpty()
        .withMessage('El campo "password" no puede estar vacío')
        .isLength({ min: 5 })
        .withMessage('El campo "password" debe tener al menos 5 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/)
        .withMessage('El campo "password" debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial')
        .customSanitizer(value => value?.trim()),

    check("confirmpassword")
        .exists()
        .withMessage('El campo "confirmpassword" es obligatorio')
        .notEmpty()
        .withMessage('El campo "confirmpassword" no puede estar vacío')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Los campos "password" y "confirmpassword" deben coincidir'),

    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        } else {
            return res.status(400).send({ errors: errors.array() });
        }
    }
];

export const validarActualizacionPassword = [
    check('passwordactual')
        .exists().withMessage('El campo "passwordactual" es obligatorio')
        .notEmpty().withMessage('El campo "passwordactual" no puede estar vacío'),
    
    check('passwordnuevo')
        .exists().withMessage('El campo "passwordnuevo" es obligatorio')
        .notEmpty().withMessage('El campo "passwordnuevo" no puede estar vacío')
        .isLength({ min: 5 }).withMessage('La nueva contraseña debe tener al menos 5 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*).*$/).withMessage('La nueva contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial'),
    
    check('confirmpassword')
        .exists().withMessage('El campo "confirmpassword" es obligatorio')
        .notEmpty().withMessage('El campo "confirmpassword" no puede estar vacío')
        .custom((value, { req }) => {
            if (value !== req.body.passwordnuevo) {
                throw new Error('La confirmación de la contraseña no coincide con la nueva contraseña');
            }
            return true;
        }),
    
    // Middleware para manejar errores de validación
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];


