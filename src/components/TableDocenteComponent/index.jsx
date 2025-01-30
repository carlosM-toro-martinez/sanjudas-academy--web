import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import useStyles from "./tableDocente.styles"; // Cambiamos el archivo de estilos

function TableDocenteComponent({ docentes }) {
  const classes = useStyles();
  const [openRows, setOpenRows] = useState({}); // Para manejar la apertura de detalles por docente

  const toggleOpen = (id_docente) => {
    setOpenRows((prev) => ({ ...prev, [id_docente]: !prev[id_docente] }));
  };

  return (
    <Paper className={classes.tableContainer}>
      <TableContainer>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nombre Completo
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Especialidad
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Fecha de Contratación
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docentes.map((docente) => (
              <React.Fragment key={docente.id_docente}>
                <TableRow>
                  <TableCell>
                    <IconButton onClick={() => toggleOpen(docente.id_docente)}>
                      {openRows[docente.id_docente] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {docente.nombre} {docente.apellido}
                  </TableCell>
                  <TableCell>{docente.email}</TableCell>
                  <TableCell>{docente.telefono}</TableCell>
                  <TableCell>{docente.especialidad}</TableCell>
                  <TableCell>
                    {new Date(docente.fecha_contratacion).toLocaleDateString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openRows[docente.id_docente]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Detalles Adicionales
                        </Typography>
                        <Typography variant="body1">
                          Fecha de Creación:{" "}
                          {new Date(docente.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                          Última Actualización:{" "}
                          {new Date(docente.updatedAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="h6" gutterBottom component="div">
                          Horarios y Materias
                        </Typography>
                        {docente.horarioMaterias.map((hm) => (
                          <Box
                            key={hm.id_horario_materia}
                            sx={{ marginBottom: 1 }}
                          >
                            <Typography variant="body2">
                              Materia: {hm.materia.nombre} -{" "}
                              {hm.materia.descripcion}
                            </Typography>
                            <Typography variant="body2">
                              Día: {hm.horario.dia} | Horario:{" "}
                              {new Date(
                                `1970-01-01T${hm.horario.hora_inicio}`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}{" "}
                              -{" "}
                              {new Date(
                                `1970-01-01T${hm.horario.hora_fin}`
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default TableDocenteComponent;
