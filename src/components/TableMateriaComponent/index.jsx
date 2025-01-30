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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Edit } from "@mui/icons-material";
import { useMutation } from "react-query";
import useStyles from "./tableMateria.styles";
import DialogDocentesComponent from "./DialogDocentesComponent";
import horarioMateriaOneUpdateServices from "../../async/services/put/horarioMateriaOneUpdateServices.js";

function TableMateriaComponent({ materias, docentes, refetchMaterias }) {
  const classes = useStyles();
  const [openRows, setOpenRows] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocenteId, setSelectedDocenteId] = useState(null);
  const [selectedMateriaId, setSelectedMateriaId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const mutation = useMutation(
    ({ id, data }) => horarioMateriaOneUpdateServices(id, data),
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: "Docente asignado exitosamente",
          severity: "success",
        });
        refetchMaterias();
        handleDialogClose();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const groupedMaterias = materias.reduce((acc, curr) => {
    const { id_materia, nombre, descripcion, createdAt } = curr.materia;
    const horario = {
      ...curr.horario,
      docente: curr.docente,
      id_horario_materia: curr.id_horario_materia,
    };

    if (!acc[id_materia]) {
      acc[id_materia] = {
        id_materia,
        nombre,
        descripcion,
        createdAt,
        horarios: [],
      };
    }

    acc[id_materia].horarios.push(horario);
    return acc;
  }, {});

  const toggleOpen = (id_materia) => {
    setOpenRows((prev) => ({ ...prev, [id_materia]: !prev[id_materia] }));
  };

  const handleEditClick = (id_horario_materia) => {
    setSelectedMateriaId(id_horario_materia);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedDocenteId(null);
  };

  const handleSave = () => {
    const dataToSend = {
      id_docente: selectedDocenteId,
    };
    mutation.mutate({ id: selectedMateriaId, data: dataToSend });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper className={classes.tableContainer}>
      <TableContainer>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell />
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Descripción
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Fecha de Creación
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(groupedMaterias).map((materia) => (
              <React.Fragment key={materia.id_materia}>
                <TableRow>
                  <TableCell>
                    <IconButton onClick={() => toggleOpen(materia.id_materia)}>
                      {openRows[materia.id_materia] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{materia.nombre}</TableCell>
                  <TableCell>{materia.descripcion}</TableCell>
                  <TableCell>
                    {new Date(materia.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={6}
                  >
                    <Collapse
                      in={openRows[materia.id_materia]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Horarios
                        </Typography>
                        <Table size="small" aria-label="horarios">
                          <TableHead>
                            <TableRow>
                              <TableCell>Día</TableCell>
                              <TableCell>Hora de Inicio</TableCell>
                              <TableCell>Hora de Fin</TableCell>
                              <TableCell>Docente</TableCell>
                              <TableCell>Acciones</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {materia.horarios.map((horario, index) => (
                              <TableRow key={index}>
                                <TableCell>{horario.dia}</TableCell>
                                <TableCell>{horario.hora_inicio}</TableCell>
                                <TableCell>{horario.hora_fin}</TableCell>
                                <TableCell>
                                  {horario.docente
                                    ? `${horario.docente.nombre} ${horario.docente.apellido}`
                                    : "No asignado"}
                                </TableCell>
                                <TableCell>
                                  <IconButton
                                    aria-label={
                                      horario.docente ? "Cambiar" : "Asignar"
                                    }
                                    onClick={() =>
                                      handleEditClick(
                                        horario.id_horario_materia
                                      )
                                    }
                                  >
                                    <Edit />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Asignar Docente</DialogTitle>
        <DialogContent>
          <DialogDocentesComponent
            docentes={docentes}
            onSelectDocente={(id) => setSelectedDocenteId(id)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default TableMateriaComponent;
