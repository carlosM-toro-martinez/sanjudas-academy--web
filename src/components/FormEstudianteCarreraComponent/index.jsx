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
import useStyles from "./formEstudianteCarrera.styles";
import estudianteCarreraAddService from "../../async/services/post/estudianteCarreraAddService";
import estudianteCarreraUpdateService from "../../async/services/put/estudianteCarreraUpdateService";
import carreraService from "../../async/services/get/carreraService";

function FormEstudianteCarreraComponent({
  handleClose,
  refetchEstudiantes,
  estudiante: estudianteEdit,
}) {
  const classes = useStyles();

  const [estudiante, setEstudiante] = useState({
    carnet_identidad: estudianteEdit ? estudianteEdit.carnet_identidad : "",
    gestion: estudianteEdit ? estudianteEdit.gestion : "",
    id_carrera: estudianteEdit ? estudianteEdit.id_carrera : "",
    nivel: estudianteEdit ? estudianteEdit.nivel : "",
    turno: estudianteEdit ? estudianteEdit.turno : "",
    nombre: estudianteEdit ? estudianteEdit.nombre : "",
    apellido_paterno: estudianteEdit ? estudianteEdit.apellido_paterno : "",
    apellido_materno: estudianteEdit ? estudianteEdit.apellido_materno : "",
    domicilio: estudianteEdit ? estudianteEdit.domicilio : "",
    correo: estudianteEdit ? estudianteEdit.correo : "",
    celular: estudianteEdit ? estudianteEdit.celular : "",
    anio_egreso: estudianteEdit ? estudianteEdit.anio_egreso : "",
    colegio: estudianteEdit ? estudianteEdit.colegio : "",
    apoderado_nombre: estudianteEdit ? estudianteEdit.apoderado_nombre : "",
    apoderado_apellido: estudianteEdit ? estudianteEdit.apoderado_apellido : "",
    estado_civil: estudianteEdit ? estudianteEdit.estado_civil : "",
    sexo: estudianteEdit ? estudianteEdit.sexo : "",
    numero_apoderado: estudianteEdit ? estudianteEdit.numero_apoderado : "",
    numero_diploma: estudianteEdit ? estudianteEdit.numero_diploma : "",
    foto: estudianteEdit ? estudianteEdit.foto : "",
    fecha_inscripcion: estudianteEdit ? estudianteEdit.fecha_inscripcion : "",
    //ru: estudianteEdit ? estudianteEdit.ru : "",
    password: estudianteEdit ? estudianteEdit.password : "",
    estado: estudianteEdit ? estudianteEdit.estado : "activo",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { data: carreras = [] } = useQuery("carreras", carreraService);

  const handleChange = (e) => {
    setEstudiante({
      ...estudiante,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutationCreate = useMutation(estudianteCarreraAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "¡Estudiante de Carrera creado exitosamente!",
        severity: "success",
      });
      if (handleClose) handleClose();
      refetchEstudiantes();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear el estudiante: ${error.message}`,
        severity: "error",
      });
    },
  });

  const mutationUpdate = useMutation(estudianteCarreraUpdateService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "¡Estudiante de Carrera actualizado exitosamente!",
        severity: "success",
      });
      if (handleClose) handleClose();
      refetchEstudiantes();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al actualizar el estudiante: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (estudianteEdit) {
      console.log(estudianteEdit);

      // Para la edición se envían 2 parámetros: el id y el payload
      mutationUpdate.mutate({
        id: estudianteEdit.id_estudiante_carrera,
        payload: estudiante,
      });
    } else {
      mutationCreate.mutate(estudiante);
    }
  };

  const handleCancel = (e) => {
    setEstudiante({
      carnet_identidad: "",
      gestion: "",
      id_carrera: "",
      nivel: "",
      turno: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      domicilio: "",
      correo: "",
      celular: "",
      anio_egreso: "",
      colegio: "",
      apoderado_nombre: "",
      apoderado_apellido: "",
      estado_civil: "",
      sexo: "",
      numero_apoderado: "",
      numero_diploma: "",
      foto: "",
      fecha_inscripcion: "",
      password: "",
      estado: "activo",
    });
    if (handleClose) handleClose();
    refetchEstudiantes();
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Typography
          variant="h6"
          className={classes.title}
          style={{ marginBottom: "2rem", fontWeight: "bold" }}
        >
          {estudianteEdit
            ? "Editar Estudiante de Carrera"
            : "Crear Estudiante de Carrera"}
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <TextField
              label="Carnet de Identidad"
              name="carnet_identidad"
              value={estudiante.carnet_identidad}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Gestión"
              name="gestion"
              value={estudiante.gestion}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth required className={classes.input}>
              <InputLabel id="select-carrera-label">Carrera</InputLabel>
              <Select
                labelId="select-carrera-label"
                label="Carrera"
                name="id_carrera"
                value={estudiante.id_carrera}
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
          <Grid item xs={4}>
            <TextField
              label="Nivel"
              name="nivel"
              value={estudiante.nivel}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Turno"
              name="turno"
              value={estudiante.turno}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Nombre"
              name="nombre"
              value={estudiante.nombre}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Apellido Paterno"
              name="apellido_paterno"
              value={estudiante.apellido_paterno}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Apellido Materno"
              name="apellido_materno"
              value={estudiante.apellido_materno}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Domicilio"
              name="domicilio"
              value={estudiante.domicilio}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Correo"
              name="correo"
              value={estudiante.correo}
              onChange={handleChange}
              fullWidth
              type="email"
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Celular"
              name="celular"
              value={estudiante.celular}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Año de Egreso"
              name="anio_egreso"
              value={estudiante.anio_egreso}
              onChange={handleChange}
              fullWidth
              type="number"
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Colegio"
              name="colegio"
              value={estudiante.colegio}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Nombre del Apoderado"
              name="apoderado_nombre"
              value={estudiante.apoderado_nombre}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Apellido del Apoderado"
              name="apoderado_apellido"
              value={estudiante.apoderado_apellido}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Estado Civil"
              name="estado_civil"
              value={estudiante.estado_civil}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Sexo"
              name="sexo"
              value={estudiante.sexo}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Número del Apoderado"
              name="numero_apoderado"
              value={estudiante.numero_apoderado}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Número de Diploma"
              name="numero_diploma"
              value={estudiante.numero_diploma}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Foto URL"
              name="foto"
              value={estudiante.foto}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Fecha de Inscripción"
              name="fecha_inscripcion"
              value={estudiante.fecha_inscripcion}
              onChange={handleChange}
              fullWidth
              type="date"
              InputLabelProps={{ shrink: true }}
              className={classes.input}
            />
          </Grid>
          {/* <Grid item xs={4}>
            <TextField
              label="RU"
              name="ru"
              value={estudiante.ru}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid> */}
          <Grid item xs={4}>
            <FormControl fullWidth required className={classes.input}>
              <InputLabel id="select-estado-label">Estado</InputLabel>
              <Select
                labelId="select-estado-label"
                label="Estado"
                name="estado"
                value={estudiante.estado}
                onChange={handleChange}
                sx={{
                  color:
                    estudiante.estado === "activo"
                      ? "green"
                      : estudiante.estado === "retirado"
                      ? "red"
                      : estudiante.estado === "congelado"
                      ? "blue"
                      : "inherit",
                }}
              >
                <MenuItem value="activo" sx={{ color: "green" }}>
                  Activo
                </MenuItem>
                <MenuItem value="retirado" sx={{ color: "red" }}>
                  Retirado
                </MenuItem>
                <MenuItem value="congelado" sx={{ color: "blue" }}>
                  Congelado
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Contraseña"
              name="password"
              value={estudiante.password}
              onChange={handleChange}
              fullWidth
              type="password"
              className={classes.input}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              className={classes.button}
              disabled={mutationCreate.isLoading || mutationUpdate.isLoading}
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
              disabled={mutationCreate.isLoading || mutationUpdate.isLoading}
            >
              {estudianteEdit
                ? mutationUpdate.isLoading
                  ? "Actualizando..."
                  : "Actualizar Estudiante de Carrera"
                : mutationCreate.isLoading
                ? "Creando..."
                : "Crear Estudiante de Carrera"}
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

export default FormEstudianteCarreraComponent;
