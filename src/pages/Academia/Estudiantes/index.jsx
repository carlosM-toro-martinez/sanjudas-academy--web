import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMutation, useQuery } from "react-query";
import estudiantesAddService from "../../../async/services/post/estudiantesAddService";
import estudiantesGetService from "../../../async/services/get/estudiantesGetService";
import materiasService from "../../../async/services/get/materiasService";
import DrawerComponent from "../../../components/DrawerComponent";
import TableEstudianteComponent from "../../../components/TableEstudianteComponent";

const Estudiantes = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [estudianteData, setEstudianteData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    horariosMateria: [],
  });

  const [horarios, setHorarios] = useState([
    { id_horario: "", id_materia: "" },
  ]);

  const {
    data: estudiantes,
    isLoading,
    isError,
    refetch,
  } = useQuery("estudiantes", estudiantesGetService);

  const {
    data: materiasHorarios,
    isLoading: isLoadingMaterias,
    isError: isErrorMaterias,
  } = useQuery("materiasHorarios", materiasService);

  const {
    mutate,
    isLoading: isMutating,
    isSuccess,
    isError: isMutateError,
    error: mutateError,
  } = useMutation(estudiantesAddService, {
    onSuccess: () => {
      setEstudianteData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        horariosMateria: [],
      });
      setHorarios([{ id_horario: "", id_materia: "" }]);
      setOpenDialog(false);
      refetch();
    },
    onError: (error) => {
      console.error("Error al crear el estudiante:", error);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEstudianteData({ ...estudianteData, [name]: value });
  };

  const handleHorarioChange = (index, e) => {
    const { name, value } = e.target;
    const newHorarios = [...horarios];
    newHorarios[index][name] = value;
    setHorarios(newHorarios);
  };

  const addHorario = () => {
    setHorarios([...horarios, { id_horario: "", id_materia: "" }]);
  };

  const removeHorario = (index) => {
    const newHorarios = [...horarios];
    newHorarios.splice(index, 1);
    setHorarios(newHorarios);
  };

  const getFilteredHorarios = (materiaId) => {
    if (!materiasHorarios) return [];
    return materiasHorarios
      .filter((item) => item.materia.id_materia === materiaId)
      .map((item) => item.horario);
  };

  const getIdHorarioMateria = (idMateria, idHorario) => {
    const horarioMateria = materiasHorarios?.find(
      (item) => item.id_materia === idMateria && item.id_horario === idHorario
    );
    return horarioMateria ? horarioMateria.id_horario_materia : null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const horariosMateria = horarios.map((horario) =>
      getIdHorarioMateria(horario.id_materia, horario.id_horario)
    );
    const data = { ...estudianteData, horariosMateria };
    mutate(data);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <DrawerComponent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        {!isLoading && !isError ? (
          <TableEstudianteComponent estudiantes={estudiantes} />
        ) : null}
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Agregar Estudiante
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Agregar Estudiante</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <Paper elevation={0} sx={{ padding: 3 }}>
              <TextField
                label="Nombre"
                name="nombre"
                value={estudianteData.nombre}
                onChange={handleInputChange}
                required
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Apellido"
                name="apellido"
                value={estudianteData.apellido}
                onChange={handleInputChange}
                required
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Email"
                name="email"
                value={estudianteData.email}
                onChange={handleInputChange}
                required
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Teléfono (Opcional)"
                name="telefono"
                value={estudianteData.telefono}
                onChange={handleInputChange}
                fullWidth
                sx={{ marginBottom: 2 }}
              />

              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Horarios
              </Typography>

              {horarios?.map((horario, index) => (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  alignItems="center"
                  sx={{ marginTop: 2 }}
                >
                  <Grid item xs={5}>
                    <FormControl fullWidth>
                      <InputLabel>ID Materia</InputLabel>
                      <Select
                        name="id_materia"
                        value={horario.id_materia}
                        onChange={(e) => handleHorarioChange(index, e)}
                        required
                      >
                        {!isLoadingMaterias &&
                          !isErrorMaterias &&
                          [
                            ...new Map(
                              materiasHorarios?.map((item) => [
                                item.materia.id_materia,
                                item,
                              ])
                            ).values(),
                          ].map((item, index) => (
                            <MenuItem
                              key={index}
                              value={item.materia.id_materia}
                            >
                              {item.materia.nombre}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={5}>
                    <FormControl fullWidth>
                      <InputLabel>ID Horario</InputLabel>
                      <Select
                        name="id_horario"
                        value={horario.id_horario}
                        onChange={(e) => handleHorarioChange(index, e)}
                        disabled={!horario.id_materia}
                        required
                      >
                        {getFilteredHorarios(horario.id_materia).map(
                          (horarioItem) => (
                            <MenuItem
                              key={horarioItem.id_horario}
                              value={horarioItem.id_horario}
                            >
                              {`Horario: ${horarioItem.dia} (${horarioItem.hora_inicio} - ${horarioItem.hora_fin})`}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      onClick={() => removeHorario(index)}
                      disabled={horarios.length === 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              ))}

              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={addHorario}
                startIcon={<AddIcon />}
                sx={{ marginTop: 2 }}
              >
                Agregar Horario
              </Button>
            </Paper>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={isMutating}
          >
            {isMutating ? "Creando..." : "Crear Estudiante"}
          </Button>
        </DialogActions>

        {isSuccess && (
          <Typography color="success.main" sx={{ padding: 2 }}>
            Estudiante creado con éxito.
          </Typography>
        )}
        {isMutateError && (
          <Typography color="error.main" sx={{ padding: 2 }}>
            Error: {mutateError.message}
          </Typography>
        )}
      </Dialog>
    </DrawerComponent>
  );
};

export default Estudiantes;
