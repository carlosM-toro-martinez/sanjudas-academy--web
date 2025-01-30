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
import useStyles from "./tableEstudiantes.styles";

function TableEstudianteComponent({ estudiantes }) {
  const classes = useStyles();
  const [openRows, setOpenRows] = useState({});

  const toggleOpen = (id_estudiante) => {
    setOpenRows((prev) => ({ ...prev, [id_estudiante]: !prev[id_estudiante] }));
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
                Fecha de Registro
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estudiantes.map((estudiante) => (
              <React.Fragment key={estudiante.id_estudiante}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      onClick={() => toggleOpen(estudiante.id_estudiante)}
                    >
                      {openRows[estudiante.id_estudiante] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    {estudiante.nombre} {estudiante.apellido}
                  </TableCell>
                  <TableCell>{estudiante.email}</TableCell>
                  <TableCell>{estudiante.telefono}</TableCell>
                  <TableCell>
                    {new Date(estudiante.fecha_registro).toLocaleDateString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                  >
                    <Collapse
                      in={openRows[estudiante.id_estudiante]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Materias y Horarios
                        </Typography>
                        {estudiante.horariosMateria.map((horarioMateria) => (
                          <Box key={horarioMateria.id_horario_materia} mb={1}>
                            <Typography variant="body1">
                              Materia: {horarioMateria.materia.nombre}
                            </Typography>
                            <Typography variant="body1">
                              Horario: {horarioMateria.horario.dia} de{" "}
                              {horarioMateria.horario.hora_inicio} a{" "}
                              {horarioMateria.horario.hora_fin}
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

export default TableEstudianteComponent;
