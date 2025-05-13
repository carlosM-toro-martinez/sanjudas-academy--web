import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Menu,
  MenuItem,
  Dialog,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useMutation } from "react-query";
import estudianteCarreraDeleteService from "../../async/services/delete/estudianteCarreraDeleteService";
import ViewEstudianteComponent from "./ViewEstudianteComponent";

const carreraLabels = {
  1: "Enfermería",
  2: "Nutrición",
  3: "Fisioterapia",
};

const TableEstudiantesCarreraComponent = ({
  estudiantes,
  refetchEstudiantes,
}) => {
  const [estadoFilter, setEstadoFilter] = useState("activo");
  const [fechaFilter, setFechaFilter] = useState("todos");
  const [carreraFilter, setCarreraFilter] = useState("todos");
  const [turnoFilter, setTurnoFilter] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const fechasDisponibles = useMemo(() => {
    return Array.from(
      new Set(estudiantes.map((e) => e.fecha_inscripcion.slice(0, 10)))
    );
  }, [estudiantes]);

  const carrerasDisponibles = useMemo(() => {
    return Array.from(new Set(estudiantes.map((e) => e.id_carrera)));
  }, [estudiantes]);

  const turnosDisponibles = useMemo(() => {
    return Array.from(new Set(estudiantes.map((e) => e.turno)));
  }, [estudiantes]);

  const filteredEstudiantes = useMemo(() => {
    return estudiantes.filter((e) => {
      if (estadoFilter !== "todos" && e.estado !== estadoFilter) return false;
      if (
        carreraFilter !== "todos" &&
        e.id_carrera.toString() !== carreraFilter
      )
        return false;
      if (
        fechaFilter !== "todos" &&
        e.fecha_inscripcion.slice(0, 10) !== fechaFilter
      )
        return false;
      if (turnoFilter !== "todos" && e.turno !== turnoFilter) return false;
      const fullName =
        `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno}`.toLowerCase();
      const term = searchTerm.toLowerCase();
      return fullName.includes(term) || e.ru.toString().includes(term);
    });
  }, [
    estudiantes,
    estadoFilter,
    fechaFilter,
    carreraFilter,
    turnoFilter,
    searchTerm,
  ]);

  const mutation = useMutation((id) => estudianteCarreraDeleteService(id), {
    onSuccess: () => refetchEstudiantes(),
  });

  const handleMenuOpen = (event, est) => {
    setAnchorEl(event.currentTarget);
    setSelectedEstudiante(est);
  };
  const handleMenuClose = () => setAnchorEl(null);
  const handleView = (est) => {
    setSelectedEstudiante(est);
    setOpenViewDialog(true);
    handleMenuClose();
  };
  const handleEdit = () => {
    console.log("Editar", selectedEstudiante.id_estudiante_carrera);
    handleMenuClose();
  };
  const handleDelete = () => {
    mutation.mutate(selectedEstudiante.id_estudiante_carrera);
    handleMenuClose();
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
          justifyContent: "center",
        }}
      >
        <FormControl size="small">
          <InputLabel>Estado</InputLabel>
          <Select
            value={estadoFilter}
            label="Estado"
            onChange={(e) => setEstadoFilter(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="retirado">Retirado</MenuItem>
            <MenuItem value="congelado">Congelado</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Carrera</InputLabel>
          <Select
            value={carreraFilter}
            label="Carrera"
            onChange={(e) => setCarreraFilter(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {carrerasDisponibles.map((id) => (
              <MenuItem key={id} value={id.toString()}>
                {carreraLabels[id]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Turno</InputLabel>
          <Select
            value={turnoFilter}
            label="Turno"
            onChange={(e) => setTurnoFilter(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {turnosDisponibles.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Inscripción</InputLabel>
          <Select
            value={fechaFilter}
            label="Inscripción"
            onChange={(e) => setFechaFilter(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {fechasDisponibles.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setEstadoFilter("activo");
            setCarreraFilter("todos");
            setTurnoFilter("todos");
            setFechaFilter("todos");
            setSearchTerm("");
          }}
        >
          Limpiar
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <TextField
          size="large"
          label="Buscar"
          placeholder="Nombre, apellido o RU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ margin: "1rem 0 1rem 0", width: "90%" }}
        />
      </Box>

      <TableContainer component={Paper} sx={{ width: "100%" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nombre y Apellido
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                RU
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
                Estado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEstudiantes.map((est) => (
              <TableRow
                key={est.id_estudiante_carrera}
                onClick={() => handleView(est)}
                sx={{
                  "&:hover": { backgroundColor: "grey.200", cursor: "pointer" },
                }}
              >
                <TableCell>{`${est.nombre} ${est.apellido_paterno} ${est.apellido_materno}`}</TableCell>
                <TableCell>{est.ru}</TableCell>
                <TableCell>{est.carnet_identidad}</TableCell>
                <TableCell>{est.correo || "-"}</TableCell>
                <TableCell>{est.celular}</TableCell>
                <TableCell>{est?.turno?.toUpperCase()}</TableCell>
                <TableCell
                  sx={{
                    textTransform: "capitalize",
                    color: est.estado === "activo" ? "green" : "red",
                  }}
                >
                  {est.estado}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 1, ml: 2 }}>
        <Typography variant="subtitle2">
          Total de estudiantes: {filteredEstudiantes.length}
        </Typography>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>Ver</MenuItem>
        <MenuItem onClick={handleEdit}>Editar</MenuItem>
        <MenuItem onClick={handleDelete}>Eliminar</MenuItem>
      </Menu>

      <Dialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedEstudiante && (
          <ViewEstudianteComponent
            estudiante={selectedEstudiante}
            refetchEstudiantes={refetchEstudiantes}
          />
        )}
      </Dialog>
    </>
  );
};

export default TableEstudiantesCarreraComponent;
