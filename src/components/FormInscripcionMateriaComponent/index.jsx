import React, { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Snackbar,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./formInscripcionMateria.styles";
import inscripcionMateriaAddService from "../../async/services/post/inscripcionMateriaAddService";
import estudianteCarreraService from "../../async/services/get/estudianteCarreraService";
import materiaCarreraService from "../../async/services/get/materiaCarreraService";
import ambienteService from "../../async/services/get/ambienteService";

function FormInscripcionMateriaComponent({
  handleClose,
  refetchInscripcionMateria,
}) {
  const classes = useStyles();
  const [inscripcion, setInscripcion] = useState({
    id_estudiante_carrera: "",
    id_materia_carrera: "",
    id_ambiente: "",
    estado: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: estudiantes = [] } = useQuery(
    "estudiantesCarrera",
    estudianteCarreraService
  );
  const { data: materias = [] } = useQuery(
    "materiaCarrera",
    materiaCarreraService
  );
  const { data: ambientes = [] } = useQuery("ambientes", ambienteService);

  const handleChange = (e) => {
    setInscripcion({
      ...inscripcion,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(inscripcionMateriaAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "¡Inscripción de Materia creada exitosamente!",
        severity: "success",
      });
      handleClose();
      refetchInscripcionMateria();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear la inscripción: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(inscripcion);
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Crear Inscripción de Materia
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth required className={classes.input}>
              <InputLabel id="select-estudiante-label">
                Estudiante de Carrera
              </InputLabel>
              <Select
                labelId="select-estudiante-label"
                label="Estudiante de Carrera"
                name="id_estudiante_carrera"
                value={inscripcion.id_estudiante_carrera}
                onChange={handleChange}
              >
                {estudiantes.map((est) => (
                  <MenuItem
                    key={est.id_estudiante_carrera}
                    value={est.id_estudiante_carrera}
                  >
                    {est.nombre} {est.apellido_paterno}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required className={classes.input}>
              <InputLabel id="select-materia-label">
                Materia de Carrera
              </InputLabel>
              <Select
                labelId="select-materia-label"
                label="Materia de Carrera"
                name="id_materia_carrera"
                value={inscripcion.id_materia_carrera}
                onChange={handleChange}
              >
                {materias.map((mat) => (
                  <MenuItem
                    key={mat.id_materia_carrera}
                    value={mat.id_materia_carrera}
                  >
                    {mat.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required className={classes.input}>
              <InputLabel id="select-ambiente-label">Ambiente</InputLabel>
              <Select
                labelId="select-ambiente-label"
                label="Ambiente"
                name="id_ambiente"
                value={inscripcion.id_ambiente}
                onChange={handleChange}
              >
                {ambientes.map((amb) => (
                  <MenuItem key={amb.id_ambiente} value={amb.id_ambiente}>
                    {amb.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required className={classes.input}>
              <InputLabel id="select-estado-label">Estado</InputLabel>
              <Select
                labelId="select-estado-label"
                label="Estado"
                name="estado"
                value={inscripcion.estado}
                onChange={handleChange}
              >
                <MenuItem value="Cursando">Cursando</MenuItem>
                <MenuItem value="Aprobado">Aprobado</MenuItem>
                <MenuItem value="Reprobado">Reprobado</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              className={classes.button}
              disabled={mutation.isLoading}
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Creando..." : "Crear Inscripción"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FormInscripcionMateriaComponent;
