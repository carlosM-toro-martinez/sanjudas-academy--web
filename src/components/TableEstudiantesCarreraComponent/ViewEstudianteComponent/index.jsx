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
import FormEstudianteCarreraComponent from "../../FormEstudianteCarreraComponent";

function ViewEstudianteComponent({ estudiante, refetchEstudiantes }) {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [216, 330],
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 10;
    const marginRight = 10;
    const startY = 10;
    let currentY = startY;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text(
      "INSTITUTO TÉCNICO TECNOLÓGICO SUPERIOR",
      pageWidth / 2,
      currentY,
      {
        align: "center",
      }
    );
    currentY += 5;
    doc.text('PRIVADO "SAINT JUDE THADDEE"', pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 5;
    doc.setFontSize(8);
    doc.text("R.M. ____ / 2025", pageWidth / 2, currentY, { align: "center" });
    currentY += 5;
    doc.text(
      "ENFERMERÍA-FISIOTERAPIA-INSTRUMENTACIÓN QUIRÚRGICA-RELACIONES INTERNACIONALES",
      pageWidth / 2,
      currentY,
      { align: "center" }
    );
    currentY += 7;
    doc.setFontSize(12);
    doc.text("FORMULARIO DE REGISTRO E INSCRIPCIÓN", pageWidth / 2, currentY, {
      align: "center",
    });
    currentY += 8;
    doc.setLineWidth(0.5);
    doc.line(marginLeft, currentY, pageWidth - marginRight, currentY);
    currentY += 8;

    const subHeaderHeight = 12;
    const colWidth = (pageWidth - marginLeft - marginRight) / 3;
    doc.setLineWidth(0.2);
    doc.rect(
      marginLeft,
      currentY,
      pageWidth - marginLeft - marginRight,
      subHeaderHeight
    );

    // Sección
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.text("SECCIÓN:", marginLeft + 2, currentY + 7);
    doc.setFont("Helvetica", "normal");
    doc.text(estudiante?.seccion || "", marginLeft + 25, currentY + 7);

    // Carrera
    doc.setFont("Helvetica", "bold");
    doc.text("CARRERA:", marginLeft + colWidth + 2, currentY + 7);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.carrera?.nombre || "",
      marginLeft + colWidth + 25,
      currentY + 7
    );

    // Turno
    doc.setFont("Helvetica", "bold");
    doc.text("TURNO:", marginLeft + colWidth * 2 + 2, currentY + 7);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.turno || "",
      marginLeft + colWidth * 2 + 20,
      currentY + 7
    );

    // Líneas divisorias verticales
    doc.line(
      marginLeft + colWidth,
      currentY,
      marginLeft + colWidth,
      currentY + subHeaderHeight
    );
    doc.line(
      marginLeft + colWidth * 2,
      currentY,
      marginLeft + colWidth * 2,
      currentY + subHeaderHeight
    );
    currentY += subHeaderHeight + 10;

    // ----------------------------------------------------------------------------
    // DATOS PERSONALES - TÍTULO
    // ----------------------------------------------------------------------------
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("DATOS PERSONALES", marginLeft, currentY);
    currentY += 5;
    doc.setLineWidth(0.3);
    // doc.line(marginLeft, currentY, pageWidth - marginRight, currentY);
    currentY += 5;

    // ----------------------------------------------------------------------------
    // Fila 1: APELLIDO PATERNO, APELLIDO MATERNO, NOMBRE COMPLETO
    // ----------------------------------------------------------------------------
    const row1Height = 14;
    const col3Width = (pageWidth - marginLeft - marginRight) / 3;
    doc.rect(
      marginLeft,
      currentY,
      pageWidth - marginLeft - marginRight,
      row1Height
    );
    // Líneas divisorias verticales
    doc.line(
      marginLeft + col3Width,
      currentY,
      marginLeft + col3Width,
      currentY + row1Height
    );
    doc.line(
      marginLeft + col3Width * 2,
      currentY,
      marginLeft + col3Width * 2,
      currentY + row1Height
    );

    // APELLIDO PATERNO
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.text("APELLIDO PATERNO", marginLeft + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(estudiante?.apellido_paterno || "", marginLeft + 2, currentY + 10);

    // APELLIDO MATERNO
    doc.setFont("Helvetica", "bold");
    doc.text("APELLIDO MATERNO", marginLeft + col3Width + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.apellido_materno || "",
      marginLeft + col3Width + 2,
      currentY + 10
    );

    // NOMBRE COMPLETO
    doc.setFont("Helvetica", "bold");
    doc.text("NOMBRE COMPLETO", marginLeft + col3Width * 2 + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.nombre || "",
      marginLeft + col3Width * 2 + 2,
      currentY + 10
    );

    currentY += row1Height + 8;

    // ----------------------------------------------------------------------------
    // Fila 2: Datos adicionales: Carnet, Gestión, Nivel, Año Egreso
    // ----------------------------------------------------------------------------
    const row2Height = 14;
    const col4Width = (pageWidth - marginLeft - marginRight) / 4;
    doc.rect(
      marginLeft,
      currentY,
      pageWidth - marginLeft - marginRight,
      row2Height
    );
    for (let i = 1; i < 4; i++) {
      doc.line(
        marginLeft + col4Width * i,
        currentY,
        marginLeft + col4Width * i,
        currentY + row2Height
      );
    }

    // Carnet
    doc.setFont("Helvetica", "bold");
    doc.text("CARNET:", marginLeft + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(estudiante?.carnet_identidad || "", marginLeft + 2, currentY + 10);

    // Gestión
    doc.setFont("Helvetica", "bold");
    doc.text("GESTIÓN:", marginLeft + col4Width + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.gestion?.toString() || "",
      marginLeft + col4Width + 2,
      currentY + 10
    );

    // Nivel
    doc.setFont("Helvetica", "bold");
    doc.text("NIVEL:", marginLeft + col4Width * 2 + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.nivel || "",
      marginLeft + col4Width * 2 + 2,
      currentY + 10
    );

    // Año Egreso
    doc.setFont("Helvetica", "bold");
    doc.text("AÑO EGRESO:", marginLeft + col4Width * 3 + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.anio_egreso?.toString() || "",
      marginLeft + col4Width * 3 + 2,
      currentY + 10
    );

    currentY += row2Height + 10;

    // ----------------------------------------------------------------------------
    // DOMICILIO
    // ----------------------------------------------------------------------------
    doc.setFont("Helvetica", "bold");
    doc.text("DOMICILIO", marginLeft, currentY);
    currentY += 5;
    doc.setLineWidth(0.3);
    // doc.line(marginLeft, currentY, pageWidth - marginRight, currentY);
    currentY += 5;

    const domRowHeight = 14;
    const colDomWidth = (pageWidth - marginLeft - marginRight) / 3;
    doc.rect(
      marginLeft,
      currentY,
      pageWidth - marginLeft - marginRight,
      domRowHeight
    );
    doc.line(
      marginLeft + colDomWidth,
      currentY,
      marginLeft + colDomWidth,
      currentY + domRowHeight
    );
    doc.line(
      marginLeft + colDomWidth * 2,
      currentY,
      marginLeft + colDomWidth * 2,
      currentY + domRowHeight
    );

    // Avenida/Calle
    doc.setFont("Helvetica", "bold");
    doc.text("AVENIDA/CALLE", marginLeft + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(estudiante?.domicilio || "", marginLeft + 2, currentY + 10);

    // Zona
    doc.setFont("Helvetica", "bold");
    doc.text("ZONA", marginLeft + colDomWidth + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.zona || "",
      marginLeft + colDomWidth + 2,
      currentY + 10
    );

    // Correo electrónico
    doc.setFont("Helvetica", "bold");
    doc.text(
      "CORREO ELECTRÓNICO",
      marginLeft + colDomWidth * 2 + 2,
      currentY + 5
    );
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.correo || "",
      marginLeft + colDomWidth * 2 + 2,
      currentY + 10
    );

    currentY += domRowHeight + 10;

    // ----------------------------------------------------------------------------
    // OTROS DATOS
    // ----------------------------------------------------------------------------
    doc.setFont("Helvetica", "bold");
    doc.text("OTROS DATOS", marginLeft, currentY);
    currentY += 5;
    // doc.line(marginLeft, currentY, pageWidth - marginRight, currentY);
    currentY += 5;

    // Fila 1: Estado Civil, Apoderado, Número Apoderado
    const otrosRow1Height = 14;
    const colOtrosWidth = (pageWidth - marginLeft - marginRight) / 3;
    doc.rect(
      marginLeft,
      currentY,
      pageWidth - marginLeft - marginRight,
      otrosRow1Height
    );
    doc.line(
      marginLeft + colOtrosWidth,
      currentY,
      marginLeft + colOtrosWidth,
      currentY + otrosRow1Height
    );
    doc.line(
      marginLeft + colOtrosWidth * 2,
      currentY,
      marginLeft + colOtrosWidth * 2,
      currentY + otrosRow1Height
    );

    // Estado Civil
    doc.setFont("Helvetica", "bold");
    doc.text("ESTADO CIVIL", marginLeft + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(estudiante?.estado_civil || "", marginLeft + 2, currentY + 10);

    // Apoderado
    doc.setFont("Helvetica", "bold");
    doc.text("APODERADO", marginLeft + colOtrosWidth + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      `${estudiante?.apoderado_nombre || ""} ${
        estudiante?.apoderado_apellido || ""
      }`,
      marginLeft + colOtrosWidth + 2,
      currentY + 10
    );

    // Número Apoderado
    doc.setFont("Helvetica", "bold");
    doc.text("N° APODERADO", marginLeft + colOtrosWidth * 2 + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.numero_apoderado || "",
      marginLeft + colOtrosWidth * 2 + 2,
      currentY + 10
    );

    currentY += otrosRow1Height + 10;

    // Fila 2: Sexo, Celular, RU
    const otrosRow2Height = 14;
    doc.rect(
      marginLeft,
      currentY,
      pageWidth - marginLeft - marginRight,
      otrosRow2Height
    );
    doc.line(
      marginLeft + colOtrosWidth,
      currentY,
      marginLeft + colOtrosWidth,
      currentY + otrosRow2Height
    );
    doc.line(
      marginLeft + colOtrosWidth * 2,
      currentY,
      marginLeft + colOtrosWidth * 2,
      currentY + otrosRow2Height
    );

    // Sexo
    doc.setFont("Helvetica", "bold");
    doc.text("SEXO", marginLeft + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(estudiante?.sexo || "", marginLeft + 2, currentY + 10);

    // Celular
    doc.setFont("Helvetica", "bold");
    doc.text("CELULAR", marginLeft + colOtrosWidth + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.celular || "",
      marginLeft + colOtrosWidth + 2,
      currentY + 10
    );

    // RU
    doc.setFont("Helvetica", "bold");
    doc.text("RU", marginLeft + colOtrosWidth * 2 + 2, currentY + 5);
    doc.setFont("Helvetica", "normal");
    doc.text(
      estudiante?.ru || "",
      marginLeft + colOtrosWidth * 2 + 2,
      currentY + 10
    );

    currentY += otrosRow2Height + 12;

    // ----------------------------------------------------------------------------
    // PRESENTACIÓN DE REQUISITOS
    // ----------------------------------------------------------------------------
    doc.setFont("Helvetica", "bold");
    doc.text("PRESENTACIÓN DE REQUISITOS:", marginLeft, currentY);
    currentY += 7;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      "1) Fotocopia legalizada de Título de Bachiller",
      marginLeft + 4,
      currentY
    );
    currentY += 5;
    doc.text(
      "2) Certificación de Nacimiento (Original)",
      marginLeft + 4,
      currentY
    );
    currentY += 5;
    doc.text(
      "3) Fotocopia simple de Cédula de Identidad",
      marginLeft + 4,
      currentY
    );
    currentY += 5;
    doc.text("4) Fotografías 4x4 fondo celeste", marginLeft + 4, currentY);
    currentY += 10;

    // ----------------------------------------------------------------------------
    // FIRMAS
    // ----------------------------------------------------------------------------
    const firmaY = pageHeight - 40;
    const firmaAncho = 60;
    doc.setLineWidth(0.3);
    // Firma del Estudiante
    doc.line(marginLeft, firmaY, marginLeft + firmaAncho, firmaY);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Firma del Estudiante", marginLeft, firmaY + 5);
    // Firma de Secretaria
    doc.line(
      pageWidth - marginRight - firmaAncho,
      firmaY,
      pageWidth - marginRight,
      firmaY
    );
    doc.text(
      "Firma de Secretaria",
      pageWidth - marginRight - firmaAncho,
      firmaY + 5
    );

    // ----------------------------------------------------------------------------
    // FECHA DE EMISIÓN
    // ----------------------------------------------------------------------------
    doc.setFontSize(8);
    doc.text(
      `Fecha de emisión: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );

    // ----------------------------------------------------------------------------
    // Agregar imagen de fondo (logotipo) en la parte superior izquierda
    // ----------------------------------------------------------------------------
    const img = new Image();
    img.src = background;
    img.onload = () => {
      doc.addImage(img, "PNG", marginLeft, startY - 5, 30, 30);
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
                <strong>ID:</strong> {estudiante?.id_estudiante_carrera}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Carnet:</strong> {estudiante?.carnet_identidad}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Gestión:</strong> {estudiante?.gestion}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Nombre:</strong> {estudiante?.nombre}{" "}
                {estudiante?.apellido_paterno} {estudiante?.apellido_materno}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Nivel:</strong> {estudiante?.nivel}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Turno:</strong> {estudiante?.turno}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Domicilio:</strong> {estudiante?.domicilio}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Correo:</strong> {estudiante?.correo}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Celular:</strong> {estudiante?.celular}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Año Egreso:</strong> {estudiante?.anio_egreso}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Colegio:</strong> {estudiante?.colegio}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Apoderado:</strong> {estudiante?.apoderado_nombre}{" "}
                {estudiante?.apoderado_apellido}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Estado Civil:</strong> {estudiante?.estado_civil}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Sexo:</strong> {estudiante?.sexo}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Número Apoderado:</strong>{" "}
                {estudiante?.numero_apoderado}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Número Diploma:</strong> {estudiante?.numero_diploma}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Fecha Inscripción:</strong>{" "}
                {new Date(estudiante?.fecha_inscripcion).toLocaleString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>RU:</strong> {estudiante?.ru}
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={generatePDF}
              sx={{ fontWeight: "bold", fontSize: "1rem", px: 3, py: 1 }}
            >
              Generar PDF
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenEditDialog(true)}
              sx={{ fontWeight: "bold", fontSize: "1rem", px: 3, py: 1 }}
            >
              Editar
            </Button>
          </Box>
        </Paper>
      </Container>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <FormEstudianteCarreraComponent
            handleClose={() => setOpenEditDialog(false)}
            refetchEstudiantes={refetchEstudiantes}
            estudiante={estudiante} // Se envía el estudiante para edición
          />
        </DialogContent>
      </Dialog>

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
