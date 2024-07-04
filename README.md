# Gestión de Equipos Secretaría del Ambiente
**La nueva aplicación web diseñada para la Secretaría del Ambiente representa una solución integral y eficiente para la gestión de equipos. Esta herramienta innovadora simplifica y agiliza el proceso de ingreso, seguimiento y mantenimiento de los equipos, así como la calibración necesaria para garantizar su correcto funcionamiento.**

**Características**
Registro de equipos con detalles como modelo, número de serie, fecha de adquisición y especificaciones técnicas.
- Adjuntar documentos, manuales y certificados relacionados con cada equipo.
- Mantenimiento y calibración de equipos.
- Interfaz intuitiva y amigable.
**Requisitos Previos**
-Node.js
-npm
**Instalación**
-Clona el repositorio:
git clone https://github.com/tu-usuario/tu-repositorio.git
-Navega al directorio del proyecto:
cd gestion-equipos
-Instala las dependencias:
npm install
Uso
  Configura las variables de entorno:
  
![Modelo arquitectonico](https://github.com/erick200011/Gestion_EquiposArea21_Backend/assets/75103508/cf6ac00b-5c67-454a-b215-39cb59764931)

-Crea un archivo .env en la raíz del proyecto.
-Añade tus variables de entorno según el archivo .env.example.
**Inicia el servidor:**
-npm start

![image](https://github.com/erick200011/Gestion_EquiposArea21_Backend/assets/75103508/30b1889a-f7b9-4ebc-aa19-4370f8c274a3)

**API Endpoints Importantes**
--Registro
**POST /api/registro**
Request:
{
  "nombre": "David",
  "apellido": "Calo",
  "email": "mko63457@ilebi.com",
  "password": "Prueba!@#"
}
Response:
{
  "msg": "Revisa tu correo electrónico para confirmar tu cuenta"
}

![Login Admin](https://github.com/erick200011/Gestion_EquiposArea21_Backend/assets/75103508/4497c04f-d05d-4dff-b7d8-a763310cb856)

![Envio de corre admin registro](https://github.com/erick200011/Gestion_EquiposArea21_Backend/assets/75103508/d4a9e875-2968-4b92-9620-901d7205cc7d)

![Registro-usuario](https://github.com/erick200011/Gestion_EquiposArea21_Backend/assets/75103508/f929b176-42d8-420e-9122-5f299fc054e1)


**El CRUD de equipos permite gestionar toda la información relacionada con los equipos de la Secretaría del Ambiente.**

- Estructura del Proyecto

La estructura del proyecto incluye los siguientes directorios principales:

- config: Archivos de configuración
- controllers: Controladores de la aplicación
- helpers: Funciones auxiliares
- middlewares: Middlewares de la aplicación
- models: Modelos de la base de datos
- routers: Definición de rutas

Autor

**Erick Palomo**


