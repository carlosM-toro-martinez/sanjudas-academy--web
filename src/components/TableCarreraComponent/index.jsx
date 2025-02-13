import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Dialog,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess, MoreVert } from "@mui/icons-material";
import FormMateriaCarreraComponent from "../FormMateriaCarreraComponent";
import useStyles from "./tableCarrera.styles";
import carreraDeleteService from "../../async/services/delete/carreraDeleteService.js";
import { useMutation } from "react-query";

const TableCarreraComponent = ({ carreras, refetchCarreras }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCarrera, setSelectedCarrera] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedSemestres, setExpandedSemestres] = useState({});

  const handleMenuOpen = (event, carrera) => {
    setAnchorEl(event.currentTarget);
    setSelectedCarrera(carrera);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const mutation = useMutation(
    (id_carrera) => carreraDeleteService(id_carrera),
    {
      onSuccess: () => {
        console.log("Carrera eliminada con éxito");
        refetchCarreras();
      },
      onError: (error) => {
        console.error("Error al eliminar carrera:", error);
      },
    }
  );

  const handleDelete = () => {
    mutation.mutate(selectedCarrera.id_carrera);
    console.log("Eliminar carrera con ID:", selectedCarrera.id_carrera);
    handleMenuClose();
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSemestreExpansion = (id, semestre) => {
    setExpandedSemestres((prev) => ({
      ...prev,
      [`${id}-${semestre}`]: !prev[`${id}-${semestre}`],
    }));
  };

  return (
    <Box style={{ display: "flex", justifyContent: "center" }}>
      <TableContainer
        component={Paper}
        style={{ marginTop: "20px", width: "80%" }}
        className={classes.tableContainer}
      >
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              />
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Nombre
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Facultad
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Cantidad de semestres
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carreras.map((carrera) => (
              <React.Fragment key={carrera.id_carrera}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      onClick={() => toggleRowExpansion(carrera.id_carrera)}
                    >
                      {expandedRows[carrera.id_carrera] ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>{carrera.nombre}</TableCell>
                  <TableCell>{carrera.facultad}</TableCell>
                  <TableCell>{carrera.cantidad_semestres}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={(event) => handleMenuOpen(event, carrera)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    colSpan={4}
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                  >
                    <Collapse
                      in={expandedRows[carrera.id_carrera]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={2}>
                        <Table size="small">
                          <TableBody>
                            {carrera.materiasCarrera.length > 0 ? (
                              Object.entries(
                                carrera.materiasCarrera.reduce(
                                  (acc, materia) => {
                                    const semestre = materia.semestre ?? "0";
                                    if (!acc[semestre]) {
                                      acc[semestre] = [];
                                    }
                                    acc[semestre].push(materia);
                                    return acc;
                                  },
                                  {}
                                )
                              ).map(([semestre, materias]) => (
                                <React.Fragment key={semestre}>
                                  <TableRow>
                                    <TableCell colSpan={3}>
                                      <IconButton
                                        onClick={() =>
                                          toggleSemestreExpansion(
                                            carrera.id_carrera,
                                            semestre
                                          )
                                        }
                                      >
                                        {expandedSemestres[
                                          `${carrera.id_carrera}-${semestre}`
                                        ] ? (
                                          <ExpandLess />
                                        ) : (
                                          <ExpandMore />
                                        )}
                                      </IconButton>
                                      <strong>Semestre {semestre}</strong>
                                    </TableCell>
                                  </TableRow>

                                  <TableRow>
                                    <TableCell
                                      colSpan={3}
                                      style={{
                                        paddingBottom: 0,
                                        paddingTop: 0,
                                      }}
                                    >
                                      <Collapse
                                        in={
                                          expandedSemestres[
                                            `${carrera.id_carrera}-${semestre}`
                                          ]
                                        }
                                        timeout="auto"
                                        unmountOnExit
                                      >
                                        <Box margin={2}>
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow>
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  Sigla
                                                </TableCell>
                                                <TableCell
                                                  sx={{ fontWeight: "bold" }}
                                                >
                                                  Nombre Materia
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {materias.map((materia) => (
                                                <TableRow
                                                  key={
                                                    materia.id_materia_carrera
                                                  }
                                                >
                                                  <TableCell>
                                                    {materia.sigla}
                                                  </TableCell>
                                                  <TableCell>
                                                    {materia.nombre}
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
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} align="center">
                                  No hay materias registradas
                                </TableCell>
                              </TableRow>
                            )}
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleOpenDialog}>Agregar Materias</MenuItem>
        <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <FormMateriaCarreraComponent
          handleClose={handleCloseDialog}
          selectedCarrera={selectedCarrera}
          refetchCarreras={refetchCarreras}
        />
      </Dialog>
    </Box>
  );
};

export default TableCarreraComponent;
