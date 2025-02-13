import React, { useState } from "react";
import {
  TextField,
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
import useStyles from "./formMateriaCarrera.styles";
import materiaCarreraAddService from "../../async/services/post/materiaCarreraAddService";
import carreraService from "../../async/services/get/carreraService";

function FormMateriaCarreraComponent({ handleClose, refetchCarreras }) {
  const classes = useStyles();
  const [materia, setMateria] = useState({
    nombre: "",
    id_carrera: "",
    semestre: "",
    sigla: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: carreras = [] } = useQuery("carreras", carreraService);

  const handleChange = (e) => {
    setMateria({
      ...materia,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(materiaCarreraAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "¡Materia de Carrera creada exitosamente!",
        severity: "success",
      });
      handleClose();
      refetchCarreras();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear la Materia de Carrera: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(materia);
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Crear Materia de Carrera
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              name="nombre"
              value={materia.nombre}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Sigla"
              name="sigla"
              value={materia.sigla}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required className={classes.input}>
              <InputLabel id="select-semestre-label">Semestre</InputLabel>
              <Select
                labelId="select-semestre-label"
                label="Semestre"
                name="semestre"
                value={materia.semestre}
                onChange={handleChange}
              >
                <MenuItem key={1} value={1}>
                  Semestre 1
                </MenuItem>
                <MenuItem key={2} value={2}>
                  Semestre 2
                </MenuItem>
                <MenuItem key={3} value={3}>
                  Semestre 3
                </MenuItem>
                <MenuItem key={4} value={4}>
                  Semestre 4
                </MenuItem>
                <MenuItem key={5} value={5}>
                  Semestre 5
                </MenuItem>
                <MenuItem key={6} value={6}>
                  Semestre 6
                </MenuItem>
                <MenuItem key={7} value={7}>
                  Semestre 7
                </MenuItem>
                <MenuItem key={8} value={8}>
                  Semestre 8
                </MenuItem>

                <MenuItem key={9} value={9}>
                  Semestre 9
                </MenuItem>

                <MenuItem key={10} value={10}>
                  Semestre 10
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required className={classes.input}>
              <InputLabel id="select-carrera-label">Carrera</InputLabel>
              <Select
                labelId="select-carrera-label"
                label="Carrera"
                name="id_carrera"
                value={materia.id_carrera}
                onChange={handleChange}
              >
                {carreras.map((carrera) => (
                  <MenuItem key={carrera.id_carrera} value={carrera.id_carrera}>
                    {carrera.nombre}
                  </MenuItem>
                ))}
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
              {mutation.isLoading ? "Creando..." : "Crear Materia de Carrera"}
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

export default FormMateriaCarreraComponent;
