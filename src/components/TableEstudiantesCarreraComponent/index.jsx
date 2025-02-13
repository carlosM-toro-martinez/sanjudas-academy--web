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
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { useMutation } from "react-query";
import estudianteCarreraDeleteService from "../../async/services/delete/estudianteCarreraDeleteService";

const TableEstudiantesCarreraComponent = ({
  estudiantes,
  refetchEstudiantes,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);

  const handleMenuOpen = (event, estudiante) => {
    setAnchorEl(event.currentTarget);
    setSelectedEstudiante(estudiante);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log(
      "Editar estudiante con ID:",
      selectedEstudiante.id_estudiante_carrera
    );
    handleMenuClose();
  };

  const mutation = useMutation(
    (id_estudiante_carrera) =>
      estudianteCarreraDeleteService(id_estudiante_carrera),
    {
      onSuccess: () => {
        console.log("Estudiante eliminada con éxito");
        refetchEstudiantes();
      },
      onError: (error) => {
        console.error("Error al eliminar estudiante:", error);
      },
    }
  );

  const handleDelete = () => {
    mutation.mutate(selectedEstudiante.id_estudiante_carrera);
    console.log(
      "Eliminar estudiante con ID:",
      selectedEstudiante.id_estudiante_carrera
    );
    handleMenuClose();
  };

  return (
    <Box style={{ display: "flex", justifyContent: "center" }}>
      <TableContainer
        component={Paper}
        style={{ marginTop: "20px", width: "90%" }}
      >
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#1976d2", color: "#fff" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                ID
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Carnet
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Correo
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Celular
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Turno
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {estudiantes.map((estudiante) => (
              <TableRow key={estudiante.id_estudiante_carrera}>
                <TableCell>{estudiante.id_estudiante_carrera}</TableCell>
                <TableCell>{`${estudiante.nombre} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`}</TableCell>
                <TableCell>{estudiante.carnet_identidad}</TableCell>
                <TableCell>{estudiante.correo}</TableCell>
                <TableCell>{estudiante.celular}</TableCell>
                <TableCell>{estudiante.turno}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, estudiante)}
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
      </Menu>
    </Box>
  );
};

export default TableEstudiantesCarreraComponent;
