import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import useStyles from "./tableAlmacenes.styles";
import background from "../../../../assets/images/background.png";
import { getLocalDateTime } from "../../../../utils/getDate";

function Row({ row }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const totalPrecio = row.lotes.reduce(
    (acc, lote) =>
      acc + lote.detalleCompra.precio_unitario * lote.detalleCompra.cantidad,
    0
  );

  return (
    <>
      <TableRow style={{ backgroundColor: "#c7e3ff" }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.numero_lote}</TableCell>
        <TableCell>
          {row.lotes.reduce((acc, lote) => acc + lote.cantidad, 0)}
        </TableCell>
        <TableCell>
          {new Date(row.lotes[0].fecha_ingreso).toLocaleDateString()}
        </TableCell>
        <TableCell>
          {row.lotes[0].detalleCompra.proveedor.nombre.toUpperCase()}
        </TableCell>
        <TableCell style={{ fontWeight: "bold" }}>{totalPrecio}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          colSpan={6}
          className={classes.collapseCell}
          style={{ paddingBottom: 0, paddingTop: 0 }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <h4>Detalles del Lote</h4>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: "#000", fontWeight: "bold" }}>
                      Producto
                    </TableCell>
                    <TableCell style={{ color: "#000", fontWeight: "bold" }}>
                      Fecha Caducidad
                    </TableCell>
                    <TableCell style={{ color: "#000", fontWeight: "bold" }}>
                      Cantidad
                    </TableCell>
                    <TableCell style={{ color: "#000", fontWeight: "bold" }}>
                      Sub Cantidad
                    </TableCell>
                    <TableCell style={{ color: "#000", fontWeight: "bold" }}>
                      Peso
                    </TableCell>
                    <TableCell style={{ color: "#000", fontWeight: "bold" }}>
                      Cantidad por Caja
                    </TableCell>
                    <TableCell style={{ color: "#000", fontWeight: "bold" }}>
                      Precio
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.lotes.map((lote) => (
                    <TableRow key={lote.id_lote}>
                      <TableCell>
                        {lote.detalleCompra.producto.nombre}
                      </TableCell>
                      <TableCell>
                        {new Date(lote.fecha_caducidad).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{lote.cantidad}</TableCell>
                      <TableCell>{lote.subCantidad}</TableCell>
                      <TableCell>{lote.peso}</TableCell>
                      <TableCell>{lote.cantidadPorCaja || "N/A"}</TableCell>
                      <TableCell style={{ fontWeight: "bold" }}>
                        {lote.detalleCompra.precio_unitario *
                          lote.detalleCompra.cantidad}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TableAlmacenesReport({ reportData }) {
  const classes = useStyles();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    doc.setFont("Times", "Bold");
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text("Reporte de Almacenes", pageWidth / 2, 25, { align: "center" });
    const img = new Image();
    img.src = background;
    img.onload = () => {
      doc.addImage(img, "PNG", 8, 5, 20, 20);
      const pdfOutput = doc.output("blob");
      setPdfBlob(pdfOutput);
      setOpenDialog(true);
    };
    const tableData = reportData.map((row) => [
      row.numero_lote,
      row.lotes.reduce((acc, lote) => acc + lote.cantidad, 0),
      new Date(row.lotes[0].fecha_ingreso).toLocaleDateString(),
      row.lotes[0].detalleCompra.proveedor.nombre.toUpperCase(),
      row.lotes.reduce(
        (acc, lote) =>
          acc +
          lote.detalleCompra.precio_unitario * lote.detalleCompra.cantidad,
        0
      ),
    ]);

    doc.autoTable({
      head: [
        [
          "Número de Lote",
          "Cantidad Total",
          "Fecha Ingreso",
          "Proveedor",
          "Precio Total",
        ],
      ],
      body: tableData,
      startY: 40,
      theme: "striped",
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

    reportData.forEach((row) => {
      doc.autoTable({
        head: [
          [
            "Producto",
            "Fecha Caducidad",
            "Cantidad",
            "Sub Cantidad",
            "Peso",
            "Cantidad por Caja",
            "Precio",
          ],
        ],
        body: row.lotes.map((lote) => [
          lote.detalleCompra.producto.nombre,
          new Date(lote.fecha_caducidad).toLocaleDateString(),
          lote.cantidad,
          lote.subCantidad,
          lote.peso,
          lote.cantidadPorCaja || "N/A",
          lote.detalleCompra.precio_unitario * lote.detalleCompra.cantidad,
        ]),
        startY: doc.previousAutoTable.finalY + 20,
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
        didDrawPage: (data) => {
          doc.text(
            `Detalles del Lote ${row.numero_lote}`,
            15,
            data.settings.startY - 5
          );
        },
      });
    });

    doc.setFont("Times", "Normal");
    doc.setFontSize(10);
    doc.text(
      `--------------------`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 40,
      { align: "center" }
    );
    doc.text(
      `Potosi - ${getLocalDateTime()}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );

    const pdfOutput = doc.output("blob");
    setPdfBlob(pdfOutput);
    setOpenDialog(true);
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
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead
            className={classes.tableHeader}
            style={{ backgroundColor: "#3d97ef" }}
          >
            <TableRow>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }} />
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Número de Lote
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Cantidad Total
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Fecha Ingreso
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Proveedor
              </TableCell>
              <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                Precio Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row) => (
              <Row key={row.numero_lote} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={generatePDF}
          style={{ marginBottom: "10px" }}
        >
          Guardar Reporte
        </Button>
      </Box>
    </>
  );
}
