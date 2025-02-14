import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import background from "../../../assets/images/background.png";

function ViewEstudianteComponent({ estudiante }) {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    const marginTop = 50;
    const colWidth = (pageWidth - marginLeft * 2) / 2;
    const lineHeight = 8;

    const fields = [
      { label: "Carnet", value: estudiante.carnet_identidad },
      { label: "Gestión", value: estudiante.gestion },
      {
        label: "Nombre",
        value: `${estudiante.nombre} ${estudiante.apellido_paterno} ${estudiante.apellido_materno}`,
      },
      { label: "Nivel", value: estudiante.nivel },
      { label: "Turno", value: estudiante.turno },
      { label: "Domicilio", value: estudiante.domicilio },
      { label: "Correo", value: estudiante.correo },
      { label: "Celular", value: estudiante.celular },
      { label: "Año Egreso", value: estudiante.anio_egreso },
      { label: "Colegio", value: estudiante.colegio },
      {
        label: "Apoderado",
        value: `${estudiante.apoderado_nombre} ${estudiante.apoderado_apellido}`,
      },
      { label: "Estado Civil", value: estudiante.estado_civil },
      { label: "Sexo", value: estudiante.sexo },
      { label: "Número Apoderado", value: estudiante.numero_apoderado },
      { label: "Número Diploma", value: estudiante.numero_diploma },
      {
        label: "Fecha Inscripción",
        value: new Date(estudiante.fecha_inscripcion).toLocaleString(),
      },
      { label: "RU", value: estudiante.ru },
    ];

    // Cargamos el logo o imagen de fondo
    const img = new Image();
    img.src = background;
    img.onload = () => {
      // Encabezado del documento
      doc.addImage(img, "PNG", marginLeft, 10, 30, 30);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Hoja de Inscripción", pageWidth / 2, 25, { align: "center" });
      doc.setLineWidth(0.5);
      doc.line(marginLeft, 40, pageWidth - marginLeft, 40);

      // Dibujamos los campos en 2 columnas (fila por fila)
      const rowsCount = Math.ceil(fields.length / 2);
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      for (let row = 0; row < rowsCount; row++) {
        const yPos = marginTop + row * lineHeight;
        // Columna izquierda
        const leftField = fields[2 * row];
        if (leftField) {
          doc.text(`${leftField.label}: ${leftField.value}`, marginLeft, yPos);
        }
        // Columna derecha
        const rightField = fields[2 * row + 1];
        if (rightField) {
          doc.text(
            `${rightField.label}: ${rightField.value}`,
            marginLeft + colWidth,
            yPos
          );
        }
      }

      // Pie de página con líneas de firma y fecha de emisión
      doc.setLineWidth(0.3);
      doc.line(marginLeft, 250, marginLeft + 60, 250);
      doc.text("Firma del Estudiante", marginLeft, 255);

      doc.line(pageWidth - marginLeft - 60, 250, pageWidth - marginLeft, 250);
      doc.text("Firma del Apoderado", pageWidth - marginLeft - 60, 255);

      doc.setFontSize(10);
      doc.text(
        `Fecha de emisión: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        270,
        { align: "center" }
      );

      // Generar el blob del PDF y mostrar el diálogo
      const pdfOutput = doc.output("blob");
      setPdfBlob(pdfOutput);
      setOpenDialog(true);
    };
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Detalles del Estudiante
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <strong>ID:</strong> {estudiante.id_estudiante_carrera}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Carnet:</strong> {estudiante.carnet_identidad}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Gestión:</strong> {estudiante.gestion}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Nombre:</strong> {estudiante.nombre}{" "}
                {estudiante.apellido_paterno} {estudiante.apellido_materno}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Nivel:</strong> {estudiante.nivel}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Turno:</strong> {estudiante.turno}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Domicilio:</strong> {estudiante.domicilio}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Correo:</strong> {estudiante.correo}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Celular:</strong> {estudiante.celular}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Año Egreso:</strong> {estudiante.anio_egreso}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Colegio:</strong> {estudiante.colegio}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Apoderado:</strong> {estudiante.apoderado_nombre}{" "}
                {estudiante.apoderado_apellido}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Estado Civil:</strong> {estudiante.estado_civil}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Sexo:</strong> {estudiante.sexo}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Número Apoderado:</strong> {estudiante.numero_apoderado}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Número Diploma:</strong> {estudiante.numero_diploma}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Fecha Inscripción:</strong>{" "}
                {new Date(estudiante.fecha_inscripcion).toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>RU:</strong> {estudiante.ru}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={generatePDF}
              sx={{ fontWeight: "bold", fontSize: "1rem", px: 3, py: 1 }}
            >
              Generar PDF
            </Button>
          </Box>
        </Paper>
      </Container>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
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

export default ViewEstudianteComponent;
