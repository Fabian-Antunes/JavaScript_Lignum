const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para parsear JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, '..')));

// Ruta GET para index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Configuración de conexión SQL Server
const config = {
    user: 'sa',
    password: 'E-0m1Cc%AM5dZo.222.',
    server: '192.168.10.4',
    database: 'LIGNUM',
    options: {
        encrypt: true,
        trustServerCertificate: true, // ESTA LÍNEA ES CLAVE
        enableArithAbort: true
    }
};

// Ruta POST para login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await sql.connect(config);
        const result = await sql.query`
            SELECT 
                dbo.adm_usu.id_usu, 
                dbo.adm_usu.usuario_usu, 
                CONVERT(VARCHAR(300), DECRYPTBYPASSPHRASE('***L16n()W!!!', dbo.adm_usu.CryPass_usu)) COLLATE SQL_Latin1_General_CP1_CS_AS AS pass_usu,
                dbo.adm_usu.apellidos_usu + N' ' + dbo.adm_usu.nombres_usu AS nombre_usu,
                dbo.adm_usu.email_usu, 
                dbo.adm_usu.legajo_usu, 
                dbo.adm_usu.Habilitado_usu, 
                dbo.adm_usu.foto_usu AS Foto, 
                ISNULL(dbo.adm_usu_msg_prefil.Alias_UsuChat, dbo.adm_usu.nombres_usu + N' ' + dbo.adm_usu.apellidos_usu) AS Alias,
                dbo.adm_usu.UsaChat_usu AS UsaChat,
                dbo.adm_usu.nombres_usu + ' ' + dbo.adm_usu.apellidos_usu AS [Nombre Apellido],
                dbo.adm_usu.usubej_usu AS USUBEJ 
            FROM dbo.adm_usu LEFT OUTER JOIN dbo.adm_usu_msg_prefil ON dbo.adm_usu.usuario_usu COLLATE SQL_Latin1_General_CP1_CI_AS = dbo.adm_usu_msg_prefil.Nombre_UsuChat 
            WHERE 
                dbo.adm_usu.usuario_usu = ${username} AND 
                ${password} = CONVERT(VARCHAR(300), DECRYPTBYPASSPHRASE('***L16n()W!!!', dbo.adm_usu.CryPass_usu)) COLLATE SQL_Latin1_General_CP1_CS_AS`;
        sql.close();

        if (result.recordset.length > 0) {
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
    } catch (err) {
        console.error('Error al intentar iniciar sesión:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
