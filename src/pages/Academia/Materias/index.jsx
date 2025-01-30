import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMutation, useQuery } from "react-query";
import materiasService from "../../../async/services/get/materiasService";
import horariosService from "../../../async/services/get/horariosGetService";
import docentesGetService from "../../../async/services/get/docentesGetService";
import materiaHorarioAddServices from "../../../async/services/post/materiaHorarioAddServices";
import DrawerComponent from "../../../components/DrawerComponent";
import TableMateriaComponent from "../../../components/TableMateriaComponent";

const Materias = () => {
  const {
    data: materias,
    isLoading: isLoadingMaterias,
    refetch: refetchMaterias,
  } = useQuery("materias", materiasService);

  const { data: horariosDisponibles, isLoading: isLoadingHorarios } = useQuery(
    "horarios",
    horariosService
  );

  const {
    data: docentes,
    isLoading: isLoadingDocentes,
    isError: isErrorDocentes,
    refetch: refetchDocentes,
  } = useQuery("docentes", docentesGetService);

  const [openDialog, setOpenDialog] = useState(false);
  const [materiaData, setMateriaData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [horarios, setHorarios] = useState([null]);

  const { mutate, isLoading, isSuccess, isError, error } = useMutation(
    materiaHorarioAddServices,
    {
      onSuccess: (data) => {
        console.log("Materia creada:", data);
        setMateriaData({ nombre: "", descripcion: "" });
        setHorarios([null]);
        setOpenDialog(false);
        refetchMaterias();
      },
      onError: (error) => {
        console.error("Error al crear la materia:", error);
      },
    }
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMateriaData({ ...materiaData, [name]: value });
  };

  const handleHorarioChange = (index, e) => {
    const newHorarios = [...horarios];
    newHorarios[index] = e.target.value;
    setHorarios(newHorarios);
  };

  const addHorario = () => {
    setHorarios([...horarios, null]);
  };

  const removeHorario = (index) => {
    const newHorarios = [...horarios];
    newHorarios.splice(index, 1);
    setHorarios(newHorarios);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...materiaData, horarios };
    console.log(data);

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
        {!isLoadingMaterias ? (
          <TableMateriaComponent
            materias={materias}
            docentes={docentes}
            refetchMaterias={refetchMaterias}
          />
        ) : null}
        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
          Agregar Materia
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Agregar Materia</DialogTitle>
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
                label="Nombre de la Materia"
                name="nombre"
                value={materiaData.nombre}
                onChange={handleInputChange}
                required
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Descripción (Opcional)"
                name="descripcion"
                value={materiaData.descripcion}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
              />

              <Typography variant="h6" sx={{ marginTop: 2 }}>
                Horarios
              </Typography>

              {horarios.map((horario, index) => (
                <Grid container spacing={2} key={index} alignItems="center">
                  <Grid item xs={10}>
                    <FormControl fullWidth>
                      <InputLabel>Seleccionar Horario</InputLabel>
                      <Select
                        label="Seleccionar Horario"
                        value={horario || ""}
                        onChange={(e) => handleHorarioChange(index, e)}
                        fullWidth
                        required
                      >
                        {horariosDisponibles?.map((horario) => (
                          <MenuItem
                            key={horario.id_horario}
                            value={horario.id_horario}
                          >
                            {`${horario.dia} - ${horario.hora_inicio} a ${horario.hora_fin}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={1}>
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
            disabled={isLoading}
          >
            {isLoading ? "Creando..." : "Crear Materia"}
          </Button>
        </DialogActions>

        {isSuccess && (
          <Typography color="success.main" sx={{ padding: 2 }}>
            Materia creada con éxito.
          </Typography>
        )}
        {isError && (
          <Typography color="error.main" sx={{ padding: 2 }}>
            Error: {error.message}
          </Typography>
        )}
      </Dialog>
    </DrawerComponent>
  );
};

export default Materias;
