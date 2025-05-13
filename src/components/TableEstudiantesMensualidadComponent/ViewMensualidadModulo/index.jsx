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
  Dialog,
  DialogContent,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useMutation } from "react-query";
import pagoMensualidadDeleteService from "../../../async/services/delete/pagoMensualidadDeleteService.js";
import pagoMensualidadUpdateService from "../../../async/services/put/pagoMensualidadUpdateService.js";
import pagoParcialAddService from "../../../async/services/post/pagoParcialAddService.js";
import { getLocalDateTime } from "../../../utils/getDate.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../../../assets/images/logos/3.png";

export default function ViewMensualidadModulo({
  estudiantes,
  refetchMensualidades,
  handleClose,
}) {
  const [expandedId, setExpandedId] = useState(null);
  const [partialInputs, setPartialInputs] = useState({});
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openPdf, setOpenPdf] = useState(false);

  // Mutations
  const deleteMutation = useMutation(pagoMensualidadDeleteService, {
    onSuccess: () => {
      if (handleClose) handleClose();
      refetchMensualidades();
    },
  });

  const updateMutation = useMutation(
    ({ id, data }) => pagoMensualidadUpdateService(id, data),
    {
      onSuccess: () => refetchMensualidades(),
    }
  );

  const addParcialMutation = useMutation(
    ({ id_pago, monto, observacion }) =>
      pagoParcialAddService({
        id_pago,
        monto,
        observacion,
        fecha_pago: getLocalDateTime(),
      }),
    {
      onSuccess: (nuevoParcial) => {
        refetchMensualidades();

        setPartialInputs((prev) => ({
          ...prev,
          [expandedId]: { monto: "", observacion: "" },
        }));

        const mensualidadPadre = estudiantes.estudianteMensualidad.find(
          (m) => m.id_pago === nuevoParcial.id_pago
        );

        const pdfData = {
          modulo: mensualidadPadre.modulo,
          fecha_pago: nuevoParcial.fecha_pago,
          monto: nuevoParcial.monto,
          observacion: nuevoParcial.observacion,
        };

        generarPDF(pdfData);
      },
    }
  );

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handlePartialChange = (id, field, value) => {
    setPartialInputs((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleAddParcial = (id_pago) => {
    const input = partialInputs[id_pago] || {};
    addParcialMutation.mutate({
      id_pago,
      monto: input.monto,
      observacion: input.observacion,
    });
  };

  const generarPDF = (data) => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("SAINT JUDE THADDEE", 14, 20);
    doc.addImage(logo, "PNG", 160, 10, 28, 28);
    doc.setFontSize(12);
    doc.text("Recibo de Pago de Mensualidad", 14, 30);
    doc.autoTable({
      startY: 40,
      head: [["Campo", "Valor"]],
      body: [
        [
          "Estudiante",
          `${estudiantes.nombre} ${estudiantes.apellido_paterno} ${estudiantes.apellido_materno}`,
        ],
        ["Módulo", data.modulo],
        ["Fecha de Pago", data.fecha_pago],
        ["Monto", `Bs. ${data.monto}`],
        ["Observación", data.observacion || "-"],
      ],
      theme: "striped",
      styles: { fontSize: 11, cellPadding: 4 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { top: 40 },
    });
    doc.setFontSize(10);
    doc.text(
      "Gracias por su pago. Este recibo es generado automáticamente.",
      14,
      doc.internal.pageSize.height - 20
    );
    setPdfBlob(doc.output("blob"));
    setOpenPdf(true);
  };

  const mensualidadesOrdenadas = [...estudiantes.estudianteMensualidad].sort(
    (a, b) => a.id_pago - b.id_pago
  );

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5">Detalle del Estudiante</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography>
          <strong>Nombre:</strong> {estudiantes.nombre}
        </Typography>
        <Typography>
          <strong>Correo:</strong> {estudiantes.correo || "-"}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Pagos de Mensualidad</Typography>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell />
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Módulo
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Fecha
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Monto Total
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mensualidadesOrdenadas.map((pago) => (
                <React.Fragment key={pago.id_pago}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleExpand(pago.id_pago)}
                      >
                        {expandedId === pago.id_pago ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>{pago.modulo}</TableCell>
                    <TableCell>
                      {new Date(pago.fecha_pago).toLocaleDateString("es-BO")}
                    </TableCell>
                    <TableCell>{`Bs. ${pago.monto}`}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => generarPDF(pago)}>
                        Imprimir
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => deleteMutation.mutate(pago.id_pago)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={5}
                    >
                      <Collapse
                        in={expandedId === pago.id_pago}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={2}>
                          {/* Lista de pagos parciales */}
                          <Typography variant="subtitle1">
                            Pagos Parciales
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Monto</TableCell>
                                <TableCell>Observación</TableCell>
                                <TableCell />
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pago.pagos_parciales.map((par) => (
                                <TableRow key={par.id_pago_parcial}>
                                  <TableCell>
                                    {new Date(
                                      par.fecha_pago
                                    ).toLocaleDateString("es-BO")}
                                  </TableCell>
                                  <TableCell>{`Bs. ${par.monto}`}</TableCell>
                                  <TableCell>
                                    {par.observacion || "-"}
                                  </TableCell>
                                  <TableCell />
                                </TableRow>
                              ))}
                              {/* Formulario para nuevo pago parcial */}
                              <TableRow>
                                <TableCell>
                                  <TextField
                                    type="date"
                                    size="small"
                                    value={
                                      partialInputs[pago.id_pago]?.fecha_pago ||
                                      getLocalDateTime().split(" ")[0]
                                    }
                                    disabled
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    size="small"
                                    placeholder="Monto"
                                    value={
                                      partialInputs[pago.id_pago]?.monto || ""
                                    }
                                    onChange={(e) =>
                                      handlePartialChange(
                                        pago.id_pago,
                                        "monto",
                                        e.target.value
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    size="small"
                                    placeholder="Observación"
                                    value={
                                      partialInputs[pago.id_pago]
                                        ?.observacion || ""
                                    }
                                    onChange={(e) =>
                                      handlePartialChange(
                                        pago.id_pago,
                                        "observacion",
                                        e.target.value
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    onClick={() =>
                                      handleAddParcial(pago.id_pago)
                                    }
                                    disabled={addParcialMutation.isLoading}
                                  >
                                    Agregar Pago
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2}>
          <Button variant="outlined" color="error" onClick={handleClose}>
            Cerrar
          </Button>
        </Box>
      </Paper>
      <Dialog
        open={openPdf}
        onClose={() => setOpenPdf(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              width="100%"
              height="500px"
              title="PDF"
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
