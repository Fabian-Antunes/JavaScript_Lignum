// server.js

const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;

// Configuración para parsear JSON en las solicitudes HTTP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de la conexión a SQL Server
const config = {
    user: 'sa', // Usuario de la base de datos
    password: 'E-0m1Cc%AM5dZo.222.', // Contraseña del usuario
    server: '192.168.10.4', // Cambia a la dirección/IP del servidor SQL
    database: 'LIGNUM', // Nombre de la base de datos a la que te conectas
    options: {
        encrypt: true,  // Utilizar si estás usando Azure SQL Database u otra configuración de conexión segura
        enableArithAbort: true  // Habilitar opciones adicionales según sea necesario
    }
};

// Ruta para verificar credenciales de usuario
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM adm_usu WHERE usuario_usu = ${username} AND DECRYPTBYPASSPHRASE('***L16n()W!!!', CryPass_usu) = ${password}`;
        sql.close();

        if (result.recordset.length > 0) {
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (err) {
        console.error('Error al intentar iniciar sesión:', err); // Imprime el error en la consola
        res.status(500).json({ message: 'Error del servidor' }); // Envía una respuesta de error al cliente
    }
});



// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
