const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

// Configuración de Express
const app = express();
const port = 3030; // Puedes cambiar el puerto si es necesario

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos MariaDB
const db = mysql.createConnection({
  host: "localhost", // Cambia esto por tu configuración de base de datos
  user: "tu-usuario", // Tu usuario de MariaDB
  password: "tu-contraseña", // Tu contraseña de MariaDB
  database: "tu-base-de-datos", // Nombre de la base de datos
});

// Verificar si la conexión es exitosa
db.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos");
  }
});

// Ruta de login (recibe las credenciales del frontend)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Consulta a la base de datos para verificar las credenciales
  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error al consultar la base de datos:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Si las credenciales son correctas, devuelve el rol del usuario
    const user = result[0];
    res.json({
      token: "token-de-autenticacion", // Aquí deberías generar un token JWT o similar
      rol: user.rol, // Devuelves el rol del usuario
    });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});


// Verificar si la conexión es exitosa
db.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err);
  } else {
    console.log("Conectado a la base de datos");
  }
});

// Ruta de login (recibe las credenciales del frontend)
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // Consulta a la base de datos para verificar las credenciales
  const query = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("Error al consultar la base de datos:", err);
      return res.status(500).json({ error: "Error en la base de datos" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Si las credenciales son correctas, devuelve el rol del usuario
    const user = result[0];
    res.json({
      token: "token-de-autenticacion", // Aquí deberías generar un token JWT o similar
      rol: user.rol, // Devuelves el rol del usuario
    });
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
