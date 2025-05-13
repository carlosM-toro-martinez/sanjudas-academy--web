import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Snackbar } from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./mensualidadModulo.styles";
import pagoMensualidadAddService from "../../async/services/post/pagoMensualidadAddService";
import { getLocalDateTime } from "../../utils/getDate";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Dialog, DialogContent } from "@mui/material";
import logo from "../../assets/images/logos/3.png";

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
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openPdf, setOpenPdf] = useState(false);

  const generarPDF = (data) => {
    const doc = new jsPDF();

    const logoBase64 = logo;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SAINT JUDE THADDEE", 14, 20);
    doc.addImage(logoBase64, "PNG", 160, 10, 35, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Recibo de Pago de Mensualidad", 14, 30);

    doc.autoTable({
      startY: 40,
      head: [["Campo", "Valor"]],
      body: [
        [
          "Estudiante",
          `${estudiante?.nombre || ""} ${estudiante?.apellido_paterno || ""} ${
            estudiante?.apellido_materno || ""
          }`,
        ],
        ["Módulo", data.modulo],
        ["Fecha de Pago", data.fecha_pago],
        ["Monto", `Bs. ${data.monto}`],
        ["Observación", data.observacion || "-"],
      ],
      theme: "striped",
      styles: {
        fontSize: 11,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 40 },
    });

    doc.setFontSize(10);
    doc.text(
      "Gracias por su pago. Este recibo es generado automáticamente.",
      14,
      doc.internal.pageSize.height - 20
    );

    const pdfOutput = doc.output("blob");
    setPdfBlob(pdfOutput);
    setOpenPdf(true);
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

      generarPDF(mensualidad);
      refetchMensualidades();
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

  const handlePdfDialogClose = () => {
    setOpenPdf(false);
    handleCancel();
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
      <Dialog
        open={openPdf}
        onClose={handlePdfDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              width="100%"
              height="500px"
              title="Vista previa del PDF"
            ></iframe>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FormMensualidadModulo;
