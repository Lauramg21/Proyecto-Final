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
    "SELECT * FROM Usuarios WHERE User = ? AND Password = ? AND Estado = 1",
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
  pool.query("SELECT * FROM Usuarios WHERE Estado = 1", (err, results) => {
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
  pool.query("SELECT * FROM Usuarios WHERE Id = ? AND Estado = 1", [id], (err, results) => {
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
  pool.query("SELECT * FROM Secciones WHERE Estado = 1", (err, results) => {
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
  pool.query("SELECT * FROM Secciones WHERE Id = ? AND Estado = 1", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ message: "Sección no encontrada" });
    res.json(results[0]);
  });
});

// Agregar una nueva sección
app.post("/api/secciones", (req, res) => {
  const { Seccion } = req.body;

  pool.query(
    "INSERT INTO Secciones (Seccion, Estado) VALUES (?, ?)",
    [Seccion, 1],
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

app.delete("/api/secciones/:id", (req, res) => {
  const { id } = req.params;

  // Inicia una transacción para asegurar que todas las actualizaciones se realicen correctamente
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener la conexión a la base de datos" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ message: "Error al iniciar la transacción" });
        });
      }

      // Actualiza la sección
      connection.query(
        "UPDATE Secciones SET Estado = 0 WHERE Id = ?",
        [id],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res
                .status(500)
                .json({
                  message: "Error en la base de datos al actualizar la sección",
                });
            });
          }
          if (results.affectedRows === 0) {
            return connection.rollback(() => {
              res.status(404).json({ message: "Sección no encontrada" });
            });
          }

          // Actualiza las acciones asociadas a la sección
          connection.query(
            "UPDATE Acciones SET Estado = 0 WHERE Seccion = ?",
            [id],
            (err, results) => {
              if (err) {
                return connection.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error al actualizar las acciones" });
                });
              }

              // Actualiza los equipos asociados a la sección
              connection.query(
                "UPDATE Equipos SET Estado = 0 WHERE IdSeccion = ?",
                [id],
                (err, results) => {
                  if (err) {
                    return connection.rollback(() => {
                      res
                        .status(500)
                        .json({ message: "Error al actualizar los equipos" });
                    });
                  }

                  // Si todo fue exitoso, hace commit de la transacción
                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        res
                          .status(500)
                          .json({
                            message: "Error al hacer commit de la transacción",
                          });
                      });
                    }
                    res.json({
                      message:
                        "Sección, acciones y equipos eliminados exitosamente",
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
});


// Obtener todos los equipos
app.get("/api/equipos", (req, res) => {
  pool.query("SELECT * FROM Equipos WHERE Estado = 1", (err, results) => {
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
  pool.query("SELECT * FROM Equipos WHERE Id = ? AND Estado = 1", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ message: "Equipo no encontrado" });
    res.json(results[0]);
  });
});

// Agregar un nuevo equipo
app.post("/api/equipos", (req, res) => {
  const { SeccionId, Equipo } = req.body;
console.log(req.body)
  pool.query(
    "INSERT INTO Equipos (IdSeccion, Equipo, Estado) VALUES (?, ?, ?)",
    [SeccionId, Equipo, 1],
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

  // Inicia una transacción para asegurar que todas las actualizaciones se realicen correctamente
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener la conexión a la base de datos" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ message: "Error al iniciar la transacción" });
        });
      }

      // Actualiza el equipo
      connection.query(
        "UPDATE Equipos SET Estado = 0 WHERE Id = ?",
        [id],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res
                .status(500)
                .json({
                  message: "Error en la base de datos al actualizar el equipo",
                });
            });
          }
          if (results.affectedRows === 0) {
            return connection.rollback(() => {
              res.status(404).json({ message: "Equipo no encontrado" });
            });
          }

          // Actualiza los jugadores asociados al equipo
          connection.query(
            "UPDATE Jugadores SET Estado = 0 WHERE IdEquipo = ?",
            [id],
            (err, results) => {
              if (err) {
                return connection.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error al actualizar los jugadores" });
                });
              }

              // Actualiza los partidos asociados al equipo
              connection.query(
                "UPDATE Partidos SET Estado = 0 WHERE IdEquipo = ?",
                [id],
                (err, results) => {
                  if (err) {
                    return connection.rollback(() => {
                      res
                        .status(500)
                        .json({ message: "Error al actualizar los partidos" });
                    });
                  }

                  // Si todo fue exitoso, hace commit de la transacción
                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        res
                          .status(500)
                          .json({
                            message: "Error al hacer commit de la transacción",
                          });
                      });
                    }
                    res.json({
                      message:
                        "Equipo, jugadores y partidos eliminados exitosamente",
                    });
                  });
                }
              );
            }
          );
        }
      );
    });
  });
});


// Obtener todos los jugadores activos
app.get("/api/jugadores", (req, res) => {
  pool.query(
    "SELECT Id, Jugador, `Número` AS Numero, IdEquipo FROM Jugadores WHERE Estado = 1",
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      res.json(results);
    }
  );
});


// Obtener un jugador por ID
app.get("/api/jugadores/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "SELECT Id, Jugador, `Número` AS Numero, IdEquipo FROM Jugadores WHERE Id = ? AND Estado = 1",
    [id],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      if (results.length === 0)
        return res.status(404).json({ message: "Jugador no encontrado" });
      res.json(results[0]);
    }
  );
});

// Agregar un nuevo jugador
app.post("/api/jugadores", (req, res) => {
  const { Jugador, Numero, IdEquipo } = req.body;
  pool.query(
    "INSERT INTO Jugadores (Jugador, `Número`, IdEquipo, Estado) VALUES (?, ?, ?, 1)",
    [Jugador, Numero, IdEquipo],
    (err, results) => {
      if (err)
        return res.status(500).json({ message: "Error en la base de datos" });
      res.status(201).json({ message: "Jugador creado exitosamente" });
    }
  );
});

// Editar un jugador
app.put("/api/jugadores/:id", (req, res) => {
  const { id } = req.params;
  const { Jugador, Numero, IdEquipo} = req.body;

  pool.query(
    "UPDATE Jugadores SET Jugador = ?, `Número` = ?, IdEquipo = ?, Estado = ? WHERE Id = ?",
    [Jugador, Numero, IdEquipo, 1, id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0) return res.status(404).json({ message: "Jugador no encontrado" });
      res.json({ message: "Jugador actualizado exitosamente" });
    }
  );
});

// Eliminar un jugador (eliminación lógica, cambia el estado a 0)
app.delete("/api/jugadores/:id", (req, res) => {
  const { id } = req.params;

  // Inicia una transacción para asegurar que todas las actualizaciones se realicen correctamente
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener la conexión a la base de datos" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ message: "Error al iniciar la transacción" });
        });
      }

      // Actualiza el jugador
      connection.query(
        "UPDATE Jugadores SET Estado = 0 WHERE Id = ?",
        [id],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res
                .status(500)
                .json({
                  message: "Error en la base de datos al actualizar el jugador",
                });
            });
          }
          if (results.affectedRows === 0) {
            return connection.rollback(() => {
              res.status(404).json({ message: "Jugador no encontrado" });
            });
          }

          // Actualiza las estadísticas asociadas al jugador
          connection.query(
            "UPDATE Estadísticas SET Estado = 0 WHERE IdJugador = ?",
            [id],
            (err, results) => {
              if (err) {
                return connection.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error al actualizar las estadísticas" });
                });
              }

              // Si todo fue exitoso, hace commit de la transacción
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res
                      .status(500)
                      .json({
                        message: "Error al hacer commit de la transacción",
                      });
                  });
                }
                res.json({
                  message: "Jugador y estadísticas eliminados exitosamente",
                });
              });
            }
          );
        }
      );
    });
  });
});


// Obtener todos los partidos
app.get("/api/partidos", (req, res) => {
  pool.query("SELECT * FROM Partidos WHERE Estado = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
        results.forEach((partido) => {
          partido.Local = partido.Local[0]; // Si 'Estado' es un Buffer, toma el primer valor del array
        });
    res.json(results);
  });
});

// Obtener un partido por ID
app.get("/api/partidos/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM Partidos WHERE Id = ? AND Estado = 1", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ message: "Partido no encontrado" });
    res.json(results[0]);
  });
});

// Agregar un nuevo partido
app.post("/api/partidos", (req, res) => {
  const { IdEquipo, Local, Rival, Fecha } = req.body;
  console.log(req.body);
  pool.query(
    "INSERT INTO Partidos (IdEquipo, Local, Rival, Fecha, Estado) VALUES (?, ?, ?, ?, ?)",
    [IdEquipo, Local, Rival, Fecha, 1],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      res.status(201).json({ message: "Partido creado exitosamente" });
    }
  );
});

// Editar un partido
app.put("/api/partidos/:id", (req, res) => {
  const { id } = req.params;
  const { IdEquipo, Local, Rival, Fecha } = req.body;

  console.log(req.body);
  pool.query(
    "UPDATE Partidos SET IdEquipo = ?, Local = ?, Rival = ?, Fecha = ?, Estado = ? WHERE Id = ?",
    [IdEquipo, Local, Rival, Fecha, 1, id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0) return res.status(404).json({ message: "Partido no encontrado" });
      res.json({ message: "Partido actualizado exitosamente" });
    }
  );
});

// Eliminar un partido (cambiar el estado a 0)
app.delete("/api/partidos/:id", (req, res) => {
  const { id } = req.params;

  // Inicia una transacción para asegurar que ambas operaciones (eliminar partido y cambiar el estado de estadísticas) se hagan correctamente
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener la conexión a la base de datos" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ message: "Error al iniciar la transacción" });
        });
      }

      // 1. Eliminar el partido
      connection.query(
        "UPDATE Partidos SET Estado = 0 WHERE Id = ?",
        [id],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ message: "Error al eliminar el partido" });
            });
          }

          if (results.affectedRows === 0) {
            return connection.rollback(() => {
              res.status(404).json({ message: "Partido no encontrado" });
            });
          }

          // 2. Actualizar las estadísticas asociadas al partido
          connection.query(
            "UPDATE Estadísticas SET Estado = 0 WHERE IdPartido = ?",
            [id],
            (err, results) => {
              if (err) {
                return connection.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error al actualizar las estadísticas" });
                });
              }

              // Si todo fue exitoso, hacer commit de la transacción
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res
                      .status(500)
                      .json({
                        message: "Error al hacer commit de la transacción",
                      });
                  });
                }

                res.json({
                  message: "Partido y estadísticas eliminados exitosamente",
                });
              });
            }
          );
        }
      );
    });
  });
});


// Obtener todas las acciones
app.get("/api/acciones", (req, res) => {
  pool.query("SELECT * FROM Acciones WHERE Estado = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    res.json(results);
  });
});

// Obtener una accion por ID
app.get("/api/acciones/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM Acciones WHERE Id = ? AND Estado = 1", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ message: "Acciones no encontrado" });
    res.json(results[0]);
  });
});

// Agregar un nuevo accion
app.post("/api/acciones", (req, res) => {
  const { Accion, Seccion} = req.body;
  console.log(req.body);
  pool.query(
    "INSERT INTO Acciones (Accion, Seccion, Estado) VALUES (?, ?, 1)",
    [Accion, Seccion],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      res.status(201).json({ message: "Accion creado exitosamente" });
    }
  );
});

// Editar un accion
app.put("/api/acciones/:id", (req, res) => {
  const { id } = req.params;
  const { Accion, Seccion } = req.body;

  console.log(req.body);
  pool.query(
    "UPDATE Acciones SET Accion = ?, Seccion = ?, Estado = ? WHERE Id = ?",
    [Accion, Seccion, 1, id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0) return res.status(404).json({ message: "Accion no encontrado" });
      res.json({ message: "Accion actualizado exitosamente" });
    }
  );
});

// Eliminar un accion (cambiar el estado a 0)
app.delete("/api/acciones/:id", (req, res) => {
  const { id } = req.params;

  // Inicia una transacción para asegurar que ambas operaciones (eliminar acción y cambiar el estado de estadísticas) se hagan correctamente
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al obtener la conexión a la base de datos" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        return connection.rollback(() => {
          res.status(500).json({ message: "Error al iniciar la transacción" });
        });
      }

      // 1. Eliminar la acción
      connection.query(
        "UPDATE Acciones SET Estado = 0 WHERE Id = ?",
        [id],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              res.status(500).json({ message: "Error al eliminar la acción" });
            });
          }

          if (results.affectedRows === 0) {
            return connection.rollback(() => {
              res.status(404).json({ message: "Acción no encontrada" });
            });
          }

          // 2. Actualizar las estadísticas asociadas a esta acción
          connection.query(
            "UPDATE Estadísticas SET Estado = 0 WHERE IdAccion = ?",
            [id],
            (err, results) => {
              if (err) {
                return connection.rollback(() => {
                  res
                    .status(500)
                    .json({ message: "Error al actualizar las estadísticas" });
                });
              }

              // Si todo fue exitoso, hacer commit de la transacción
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    res
                      .status(500)
                      .json({
                        message: "Error al hacer commit de la transacción",
                      });
                  });
                }

                res.json({
                  message: "Acción y estadísticas eliminadas exitosamente",
                });
              });
            }
          );
        }
      );
    });
  });
});

// Obtener todas las estadísticas
app.get("/api/estadisticas", (req, res) => {
  pool.query("SELECT * FROM Estadísticas WHERE Estado = 1", (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    res.json(results);
  });
});

// Obtener una estadística por ID
app.get("/api/estadisticas/:id", (req, res) => {
  const { id } = req.params;
  pool.query("SELECT * FROM Estadísticas WHERE Id = ? AND Estado = 1", [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length === 0) return res.status(404).json({ message: "Estadística no encontrada" });
    res.json(results[0]);
  });
});

// Agregar una nueva estadística
app.post("/api/estadisticas", (req, res) => {
  const { IdPartido, IdJugador, IdAccion } = req.body;
  pool.query(
    "INSERT INTO Estadísticas (IdPartido, IdJugador, IdAccion, Estado) VALUES (?, ?, ?, 1)",
    [IdPartido, IdJugador, IdAccion],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      res.status(201).json({ message: "Estadística creada exitosamente" });
    }
  );
});

// Editar una estadística
app.put("/api/estadisticas/:id", (req, res) => {
  const { id } = req.params;
  const { IdPartido, IdJugador, IdAccion } = req.body;
  pool.query(
    "UPDATE Estadísticas SET IdPartido = ?, IdJugador = ?, IdAccion = ?, Estado = 1 WHERE Id = ?",
    [IdPartido, IdJugador, IdAccion, id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0) return res.status(404).json({ message: "Estadística no encontrada" });
      res.json({ message: "Estadística actualizada exitosamente" });
    }
  );
});

// Eliminar una estadística (cambiar el estado a 0)
app.delete("/api/estadisticas/:id", (req, res) => {
  const { id } = req.params;
  pool.query(
    "UPDATE Estadísticas SET Estado = 0 WHERE Id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Error en la base de datos" });
      if (results.affectedRows === 0) return res.status(404).json({ message: "Estadística no encontrada" });
      res.json({ message: "Estadística eliminada exitosamente" });
    }
  );
});