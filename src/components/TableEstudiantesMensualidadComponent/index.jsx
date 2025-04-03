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
  TextField,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import FormMensualidadModulo from "../FormMensualidadModulo";
import ViewMensualidadModulo from "./ViewMensualidadModulo";

const TableEstudiantesMensualidadComponent = ({
  estudiantes,
  refetchMensualidades,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenFormDialog = () => {
    setOpenFormDialog(true);
    handleMenuClose();
  };

  const handleCloseFormDialog = () => setOpenFormDialog(false);

  const handleOpenViewDialog = () => {
    setOpenViewDialog(true);
    handleMenuClose();
  };

  const handleCloseViewDialog = () => setOpenViewDialog(false);

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

  const handleDelete = () => {
    console.log(
      "Eliminar estudiante con ID:",
      selectedEstudiante.id_estudiante_carrera
    );
    handleMenuClose();
  };

  const filteredEstudiantes = estudiantes.filter((est) => {
    const term = searchTerm.toLowerCase();
    return (
      est.nombre.toLowerCase().includes(term) ||
      est.ru.toLowerCase().includes(term)
    );
  });

  const modulos = Array.from(
    new Set(
      estudiantes.flatMap((est) =>
        est.estudianteMensualidad.map((m) => m.modulo)
      )
    )
  ).sort();

  return (
    <Box
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <TextField
        label="Buscar por nombre o RU"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ margin: "20px 0", width: "90%" }}
      />
      <TableContainer
        component={Paper}
        style={{ marginTop: "20px", width: "90%" }}
      >
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#1976d2", color: "#fff" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Ru
              </TableCell>
              {modulos.map((modulo) => (
                <TableCell
                  key={modulo}
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  {modulo}
                </TableCell>
              ))}
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEstudiantes.map((estudiante) => (
              <TableRow key={estudiante.id_estudiante_carrera}>
                <TableCell>{estudiante.nombre}</TableCell>
                <TableCell>{estudiante.ru}</TableCell>
                {modulos.map((modulo) => {
                  const pago = estudiante.estudianteMensualidad.find(
                    (m) => m.modulo === modulo
                  );
                  return (
                    <TableCell
                      key={modulo}
                      style={{ color: pago?.monto < 380 ? "red" : "green" }}
                    >
                      {pago ? `$${pago.monto}` : "-"}
                    </TableCell>
                  );
                })}
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
        <MenuItem onClick={handleOpenFormDialog}>Añadir</MenuItem>
        <MenuItem onClick={handleOpenViewDialog}>Ver detalle</MenuItem>
      </Menu>
      <Dialog
        open={openFormDialog}
        onClose={handleCloseFormDialog}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { width: "50%", padding: "1rem" },
        }}
      >
        {selectedEstudiante && (
          <FormMensualidadModulo
            refetchMensualidades={refetchMensualidades}
            estudiante={selectedEstudiante}
            handleClose={handleCloseFormDialog}
          />
        )}
      </Dialog>
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": { width: "90%", padding: ".5rem" },
        }}
      >
        {selectedEstudiante && (
          <ViewMensualidadModulo
            refetchMensualidades={refetchMensualidades}
            estudiante={selectedEstudiante}
            handleClose={handleCloseViewDialog}
            estudiantes={selectedEstudiante}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default TableEstudiantesMensualidadComponent;
