import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Snackbar } from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./mensualidadModulo.styles";
import pagoMensualidadAddService from "../../async/services/post/pagoMensualidadAddService";
import { getLocalDateTime } from "../../utils/getDate";

function FormMensualidadModulo({
  estudiante,
  handleClose,
  refetchMensualidades,
}) {
  const classes = useStyles();
  const initialState = {
    id_estudiante_carrera: estudiante ? estudiante.id_estudiante_carrera : "",
    modulo: "",
    observacion: "",
    fecha_pago: getLocalDateTime().split(" ")[0],
    monto: "",
  };

  const [mensualidad, setMensualidad] = useState(initialState);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setMensualidad({
      ...mensualidad,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(pagoMensualidadAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "¡Pago de mensualidad creado exitosamente!",
        severity: "success",
      });
      if (handleClose) {
        handleClose();
      }
      refetchMensualidades();
      handleCancel();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear el pago: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(mensualidad);
  };

  const handleCancel = () => {
    setMensualidad(initialState);
    if (handleClose) {
      handleClose();
    }
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography variant="h6" className={classes.title}>
          Crear Pago de Mensualidad
        </Typography>

        <input
          type="hidden"
          name="id_estudiante_carrera"
          value={mensualidad.id_estudiante_carrera}
        />

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Módulo"
              name="modulo"
              value={mensualidad.modulo}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Observación"
              name="observacion"
              value={mensualidad.observacion}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Fecha de Pago"
              name="fecha_pago"
              value={mensualidad.fecha_pago}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Monto"
              name="monto"
              value={mensualidad.monto}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
              type="number"
              inputProps={{
                step: "0.01",
              }}
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
              {mutation.isLoading ? "Creando..." : "Crear Pago"}
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

export default FormMensualidadModulo;
