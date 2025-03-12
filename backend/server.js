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

// Obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
  pool.query("SELECT * FROM Usuarios", (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    results.forEach((user) => {
      user.Estado = user.Estado[0]; // Si 'Estado' es un Buffer, toma el primer valor del array
    });
      res.json(results);

  });
});

// Obtener un usuario por ID
app.get("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM Usuarios WHERE Id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(results[0]);
  });
});

// Agregar un nuevo usuario
app.post("/api/usuarios", (req, res) => {
  const { User, Password, rol } = req.body;
    const rolMap = {
      admin: 0,
      user: 1,
      lectura: 2,
    };

    const rolConvertido = rolMap[rol] !== undefined ? rolMap[rol] : rol;

  pool.query(
    "INSERT INTO Usuarios (User, Password, rol, Estado) VALUES (?, ?, ?, ?)",
    [User, Password, rolConvertido, 1],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      res.status(201).json({ message: "Usuario creado exitosamente" });
    }
  );
});

// Editar un usuario
app.put("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  const { User, Password, rol, Estado } = req.body;
  console.log(req.body);

  const rolMap = {
    admin: 0, 
    user: 1, 
    lectura: 2, 
  };

  const rolConvertido = rolMap[rol] !== undefined ? rolMap[rol] : rol; // Si no se encuentra, se mantiene como está

  console.log("rol" + rolConvertido);

  pool.query(
    "UPDATE Usuarios SET User = ?, Password = ?, rol = ?, Estado = ? WHERE Id = ?",
    [User, Password, rolConvertido, Estado, id],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.json({ message: "Usuario actualizado exitosamente" });
    }
  );
});

// Eliminar un usuario
app.delete("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "UPDATE Usuarios SET Estado = 0 WHERE id = ?",
    [id],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Usuario no encontrado" });
      res.json({ message: "Usuario eliminado exitosamente" });
    }
  );
});

// Obtener todas las secciones
app.get("/api/secciones", (req, res) => {
  pool.query("SELECT * FROM Secciones", (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
        results.forEach((seccion) => {
          seccion.Estado = seccion.Estado[0]; // Si 'Estado' es un Buffer, toma el primer valor del array
        });
    res.json(results);
  });
});

// Obtener una sección por ID
app.get("/api/secciones/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM Secciones WHERE Id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ message: "Sección no encontrada" });
    res.json(results[0]);
  });
});

// Agregar una nueva sección
app.post("/api/secciones", (req, res) => {
  const { Seccion, Estado } = req.body;

  pool.query(
    "INSERT INTO Secciones (Seccion, Estado) VALUES (?, ?)",
    [Seccion, Estado],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      res.status(201).json({ message: "Sección creada exitosamente" });
    }
  );
});

// Editar una sección
app.put("/api/secciones/:id", (req, res) => {
  const { id } = req.params;
  const { Seccion, Estado } = req.body;

  pool.query(
    "UPDATE Secciones SET Seccion = ?, Estado = ? WHERE Id = ?",
    [Seccion, Estado, id],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Sección no encontrada" });
      res.json({ message: "Sección actualizada exitosamente" });
    }
  );
});

// Eliminar una sección (cambiar el estado a 0)
app.delete("/api/secciones/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "UPDATE Secciones SET Estado = 0 WHERE Id = ?",
    [id],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0)
        return res.status(404).json({ message: "Sección no encontrada" });
      res.json({ message: "Sección eliminada exitosamente" });
    }
  );
});

// Obtener todos los equipos
app.get("/api/equipos", (req, res) => {
  pool.query("SELECT * FROM Equipos", (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    results.forEach((equipo) => {
      equipo.Estado = equipo.Estado[0]; // Si 'Estado' es un Buffer, toma el primer valor del array
    });
    res.json(results);
  });
});

// Obtener un equipo por ID
app.get("/api/equipos/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM Equipos WHERE Id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(results[0]);
  });
});

// Agregar un nuevo equipo
app.post("/api/equipos", (req, res) => {
  const { SeccionId, Equipo, Estado } = req.body;
console.log(req.body)
  pool.query(
    "INSERT INTO Equipos (IdSeccion, Equipo, Estado) VALUES (?, ?, ?)",
    [SeccionId, Equipo, Estado],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      res.status(201).json({ message: "Equipo creado exitosamente" });
    }
  );
});

// Editar un equipo
app.put("/api/equipos/:id", (req, res) => {
  const { id } = req.params;
  const { SeccionId, Equipo, Estado } = req.body;

  pool.query(
    "UPDATE Equipos SET IdSeccion = ?, Equipo = ?, Estado = ? WHERE Id = ?",
    [SeccionId, Equipo, Estado, id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0) return res.status(404).json({ message: "Equipo no encontrado" });
      res.json({ message: "Equipo actualizado exitosamente" });
    }
  );
});

// Eliminar un equipo (cambiar el estado a 0)
app.delete("/api/equipos/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "UPDATE Equipos SET Estado = 0 WHERE Id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0) return res.status(404).json({ message: "Equipo no encontrado" });
      res.json({ message: "Equipo eliminado exitosamente" });
    }
  );
});
