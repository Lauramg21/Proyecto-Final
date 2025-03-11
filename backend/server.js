const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = 3000;

// Configurar CORS para que Angular pueda acceder
app.use(cors());

// Agregar este middleware para parsear las solicitudes JSON
app.use(express.json()); // Esto es crucial para acceder a req.body

// Crear conexión a la base de datos MariaDB
const pool = mysql.createPool({
  host: "82.223.102.153",
  user: "2DAMClubBaloncesto",
  password: "2DAMClubBaloncesto9876", // Usa la contraseña de tu base de datos
  database: "2DAMClubBaloncesto",
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Imprimir el cuerpo de la solicitud para verificar que los datos se están enviando correctamente
  console.log("Cuerpo de la solicitud:", req.body);

  // Comprobar si el correo existe en la base de datos
  pool.query(
    "SELECT * FROM Usuarios WHERE User = ? AND Password = ?",
    [email, password],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });

      if (results.length === 0) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const user = results[0];

      if (user.Password !== password) {
        return res.status(401).json({ message: "Credenciales incorrectas" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.User, rol: user.rol },
        "secreta", // Secreto para firmar el token
        { expiresIn: "1h" } // El token expirará en 1 hora
      );

      // Enviar el token y el rol del usuario
      res.json({ token, rol: user.rol });
    }
  );
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
