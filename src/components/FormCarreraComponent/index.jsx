import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Snackbar } from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./formCarrera.styles";
import carreraAddService from "../../async/services/post/carreraAddService";

function FormCarrera({ handleClose, refetchCarreras }) {
  const classes = useStyles();
  const initialState = { nombre: "", facultad: "", cantidad_semestres: "" };
  const [carrera, setCarrera] = useState(initialState);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setCarrera({
      ...carrera,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(carreraAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "¡Carrera creada exitosamente!",
        severity: "success",
      });
      if (handleClose) {
        handleClose();
      }
      refetchCarreras();
      handleCancel();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear la carrera: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(carrera);
  };

  const handleCancel = () => {
    setCarrera(initialState);
    handleClose();
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Crear Carrera
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              name="nombre"
              value={carrera.nombre}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Facultad"
              name="facultad"
              value={carrera.facultad}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cantidad de semestres"
              name="cantidad_semestres"
              value={carrera.cantidad_semestres}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              className={classes.button}
              disabled={mutation.isLoading}
              onClick={handleCancel}
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
              {mutation.isLoading ? "Creando..." : "Crear Carrera"}
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

export default FormCarrera;
