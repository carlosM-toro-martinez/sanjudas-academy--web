import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import { useMutation } from "react-query";
import pagoMensualidadDeleteService from "../../../async/services/delete/pagoMensualidadDeleteService.js";
import pagoMensualidadUpdateService from "../../../async/services/put/pagoMensualidadUpdateService.js";
import { getLocalDateTime } from "../../../utils/getDate.js";

function ViewMensualidadModulo({
  estudiantes,
  refetchMensualidades,
  handleClose,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editMonto, setEditMonto] = useState({});

  const mutationDelete = useMutation(pagoMensualidadDeleteService, {
    onSuccess: () => {
      // setSnackbar({
      //   open: true,
      //   message: "¡Pago de mensualidad creado exitosamente!",
      //   severity: "success",
      // });
      if (handleClose) {
        handleClose();
      }
      refetchMensualidades();
      handleCancel();
    },
    onError: (error) => {
      // setSnackbar({
      //   open: true,
      //   message: `Error al crear el pago: ${error.message}`,
      //   severity: "error",
      // });
    },
  });

  const mutation = useMutation(({ id, data }) =>
    pagoMensualidadUpdateService(id, data)
  );

  const handleEdit = (id, monto) => {
    setEditingId(id);
    setEditMonto({ ...editMonto, [id]: monto });
  };

  const handleDelete = (id) => {
    mutationDelete.mutate(id);
  };

  const handleSave = (pago) => {
    console.log(pago);

    const updatedPago = {
      id_pago: pago.id_pago,
      monto: editMonto[pago.id_pago],
      observacion: `Primer pago: ${new Date(pago.fecha_pago).toLocaleDateString(
        "es-BO"
      )}`,
      fecha_pago: getLocalDateTime(),
    };
    mutation.mutate(
      { id: pago.id_pago, data: updatedPago },
      {
        onSuccess: () => {
          refetchMensualidades();
          handleClose();
        },
      }
    );

    refetchMensualidades();
    setEditingId(null);
  };

  const handleCancel = () => {
    if (handleClose) {
      handleClose();
    }
  };
  const sortedMensualidad = [...estudiantes.estudianteMensualidad].sort(
    (a, b) => a.id_pago - b.id_pago
  );
  return (
    <Box p={3}>
      <Paper elevation={3} style={{ padding: "24px" }}>
        <Typography variant="h5" gutterBottom>
          Detalle del Estudiante
        </Typography>
        <Divider style={{ marginBottom: "16px" }} />
        <Box mb={2}>
          <Typography variant="body1">
            <strong>Nombre:</strong> {estudiantes.nombre}
          </Typography>
          <Typography variant="body1">
            <strong>Correo:</strong> {estudiantes.correo}
          </Typography>
        </Box>
        <Divider style={{ margin: "16px 0" }} />
        <Typography variant="h6" gutterBottom>
          Pagos de Mensualidad
        </Typography>
        <TableContainer>
          <Table>
            <TableHead style={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Módulo
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Observación
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Fecha de Pago
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Monto
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMensualidad.map((pago) => (
                <TableRow key={pago.id_pago}>
                  <TableCell>{pago.modulo}</TableCell>
                  <TableCell>{pago.observacion || "-"}</TableCell>
                  <TableCell>
                    {new Date(pago.fecha_pago).toLocaleDateString("es-BO")}
                  </TableCell>
                  <TableCell
                    style={{ color: pago?.monto < 380 ? "red" : "green" }}
                  >
                    {editingId === pago.id_pago ? (
                      <TextField
                        type="number"
                        value={editMonto[pago.id_pago] || pago.monto}
                        onChange={(e) =>
                          setEditMonto({
                            ...editMonto,
                            [pago.id_pago]: e.target.value,
                          })
                        }
                        size="small"
                      />
                    ) : (
                      `$${pago.monto}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === pago.id_pago ? (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleSave(pago)}
                        disabled={mutation.isLoading}
                      >
                        Guardar
                      </Button>
                    ) : (
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        style={{ marginRight: "8px" }}
                        onClick={() => handleEdit(pago.id_pago, pago.monto)}
                      >
                        Editar
                      </Button>
                    )}
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(pago.id_pago)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid item xs={6}>
          <Button variant="contained" color="error" onClick={handleCancel}>
            Cancelar
          </Button>
        </Grid>
      </Paper>
    </Box>
  );
}

export default ViewMensualidadModulo;
