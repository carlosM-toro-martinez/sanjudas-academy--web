import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Snackbar } from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./formAmbiente.styles";
import ambientaAddService from "../../async/services/post/ambientaAddService";

function FormAmbiente({ handleClose, refetchAmbientes }) {
  const classes = useStyles();
  const [ambiente, setAmbiente] = useState({
    nombre: "",
    capacidad: "",
    ubicacion: "",
    descripcion: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setAmbiente({
      ...ambiente,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(ambientaAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "¡Ambiente creado exitosamente!",
        severity: "success",
      });
      if (handleClose) {
        handleClose();
      }
      handleCancel();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear el ambiente: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(ambiente);
  };

  const handleCancel = () => {
    setAmbiente({
      nombre: "",
      capacidad: "",
      ubicacion: "",
      descripcion: "",
    });
    handleClose();
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography
          variant="h6"
          className={classes.title}
          style={{ fontWeight: "bold" }}
        >
          Crear Ambiente
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              name="nombre"
              value={ambiente.nombre}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Capacidad"
              name="capacidad"
              value={ambiente.capacidad}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ubicación"
              name="ubicacion"
              value={ambiente.ubicacion}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              name="descripcion"
              value={ambiente.descripcion}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              className={classes.input}
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
              {mutation.isLoading ? "Creando..." : "Crear Ambiente"}
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

export default FormAmbiente;
