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
//import ambienteDeleteService from "../../async/services/delete/ambienteDeleteService"; // Asegúrate de crear este servicio

const TableAmbientesComponent = ({ ambientes, refetchAmbientes }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAmbiente, setSelectedAmbiente] = useState(null);

  const handleMenuOpen = (event, ambiente) => {
    setAnchorEl(event.currentTarget);
    setSelectedAmbiente(ambiente);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log("Editar ambiente con ID:", selectedAmbiente.id_ambiente);
    handleMenuClose();
  };

  //   const mutation = useMutation(
  //     (id_ambiente) => ambienteDeleteService(id_ambiente),
  //     {
  //       onSuccess: () => {
  //         console.log("Ambiente eliminado con éxito");
  //         refetchAmbientes();
  //       },
  //       onError: (error) => {
  //         console.error("Error al eliminar ambiente:", error);
  //       },
  //     }
  //   );

  const handleDelete = () => {
    //mutation.mutate(selectedAmbiente.id_ambiente);
    console.log("Eliminar ambiente con ID:", selectedAmbiente.id_ambiente);
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
                Capacidad
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Ubicación
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Descripción
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ambientes.map((ambiente) => (
              <TableRow key={ambiente.id_ambiente}>
                <TableCell>{ambiente.id_ambiente}</TableCell>
                <TableCell>{ambiente.nombre}</TableCell>
                <TableCell>{ambiente.capacidad || "No disponible"}</TableCell>
                <TableCell>{ambiente.ubicacion || "No disponible"}</TableCell>
                <TableCell>{ambiente.descripcion || "No disponible"}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, ambiente)}
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

export default TableAmbientesComponent;
