import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import background from "../../../../assets/images/background.png";

const getLocalDateTime = () => new Date().toLocaleString();

const TableEstudiantesReport = ({ reportData }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Función para agrupar y contar estudiantes por día según la fecha de inscripción
  const getStudentsCountPerDay = () => {
    const countMap = {};
    reportData.forEach((student) => {
      const fecha = new Date(student.fecha_inscripcion).toLocaleDateString();
      countMap[fecha] = (countMap[fecha] || 0) + 1;
    });
    // Convierte el objeto a un arreglo de objetos con { fecha, count }
    return Object.entries(countMap).map(([fecha, count]) => ({ fecha, count }));
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("Times", "Bold");
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth();
    const img = new Image();
    img.src = background;
    img.onload = () => {
      doc.addImage(img, "PNG", 8, 5, 20, 20);
      doc.text("Reporte de Estudiantes", pageWidth / 2, 25, {
        align: "center",
      });

      const studentTableHeaders = [
        "Carnet",
        "Gestión",
        "Nombre Completo",
        "Nivel",
        "Turno",
        "Correo",
        "Celular",
        "Fecha Inscripción",
        "Carrera",
      ];

      const studentTableBody = reportData.map((student) => [
        student.carnet_identidad,
        student.gestion,
        `${student.nombre} ${student.apellido_paterno} ${student.apellido_materno}`,
        student.nivel,
        student.turno,
        student.correo,
        student.celular,
        new Date(student.fecha_inscripcion).toLocaleString(),
        student.carrera.nombre,
      ]);

      doc.autoTable({
        head: [studentTableHeaders],
        body: studentTableBody,
        startY: 35,
        theme: "grid",
        headStyles: {
          fillColor: [0, 51, 102],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          font: "Times",
          fontSize: 10,
          halign: "center",
        },
        styles: {
          cellPadding: 3,
        },
        margin: { left: 15, right: 15 },
      });

      // Resumen: cantidad de estudiantes registrados por día
      const summaryData = getStudentsCountPerDay();
      const summaryTableHeaders = ["Fecha", "Cantidad de Estudiantes"];
      const summaryStartY = doc.previousAutoTable.finalY + 20;

      doc.setFont("Times", "Bold");
      doc.setFontSize(14);
      doc.text(
        "Cantidad de Estudiantes Registrados por Día",
        pageWidth / 2,
        summaryStartY - 10,
        { align: "center" }
      );

      doc.autoTable({
        head: [summaryTableHeaders],
        body: summaryData.map((item) => [item.fecha, item.count]),
        startY: summaryStartY,
        theme: "striped",
        headStyles: {
          fillColor: [51, 102, 153],
          textColor: 255,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: {
          font: "Times",
          fontSize: 10,
          halign: "center",
        },
        styles: {
          cellPadding: 3,
        },
        margin: { left: 15, right: 15 },
      });

      // Pie de página
      doc.setFont("Times", "Normal");
      doc.setFontSize(10);
      doc.text(
        `--------------------`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 40,
        { align: "center" }
      );
      doc.text(
        `Reporte generado: ${getLocalDateTime()}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );

      const pdfOutput = doc.output("blob");
      setPdfBlob(pdfOutput);
      setOpenDialog(true);
    };
  };

  return (
    <>
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

      <TableContainer component={Paper} style={{ marginTop: 16 }}>
        <Table>
          <TableHead style={{ backgroundColor: "#3d97ef" }}>
            <TableRow>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Carnet
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Gestión
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Nombre Completo
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Nivel
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Turno
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Correo
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Celular
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Fecha Inscripción
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Carrera
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((student) => (
              <TableRow key={student.id_estudiante_carrera}>
                <TableCell>{student.carnet_identidad}</TableCell>
                <TableCell>{student.gestion}</TableCell>
                <TableCell>
                  {`${student.nombre} ${student.apellido_paterno} ${student.apellido_materno}`}
                </TableCell>
                <TableCell>{student.nivel}</TableCell>
                <TableCell>{student.turno}</TableCell>
                <TableCell>{student.correo}</TableCell>
                <TableCell>{student.celular}</TableCell>
                <TableCell>
                  {new Date(student.fecha_inscripcion).toLocaleString()}
                </TableCell>
                <TableCell>{student.carrera.nombre}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <Button variant="contained" color="primary" onClick={generatePDF}>
          Guardar Reporte
        </Button>
      </Box>
    </>
  );
};

export default TableEstudiantesReport;
