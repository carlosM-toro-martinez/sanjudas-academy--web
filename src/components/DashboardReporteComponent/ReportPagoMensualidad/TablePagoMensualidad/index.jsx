import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const TablePagoMensualidad = ({ reportData }) => {
  const [fechaFilter, setFechaFilter] = useState("todos");
  const [montoFilter, setMontoFilter] = useState("");

  const fechasDisponibles = useMemo(() => {
    const fechas = reportData.map((r) => r.fecha_pago.slice(0, 10));
    return Array.from(new Set(fechas));
  }, [reportData]);

  const filteredData = useMemo(() => {
    return reportData.filter((item) => {
      if (
        fechaFilter !== "todos" &&
        item.fecha_pago.slice(0, 10) !== fechaFilter
      ) {
        return false;
      }
      if (montoFilter !== "" && item.montoPagado > parseFloat(montoFilter)) {
        return false;
      }
      return true;
    });
  }, [reportData, fechaFilter, montoFilter]);

  const sumaMontos = useMemo(() => {
    return filteredData.reduce(
      (sum, row) => sum + parseFloat(row.montoPagado),
      0
    );
  }, [filteredData]);

  return (
    <Box sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Fecha pago</InputLabel>
          <Select
            value={fechaFilter}
            label="Fecha pago"
            onChange={(e) => setFechaFilter(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            {fechasDisponibles.map((f) => (
              <MenuItem key={f} value={f}>
                {f}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Monto ≤"
          type="number"
          value={montoFilter}
          onChange={(e) => setMontoFilter(e.target.value)}
          placeholder="Ej. 300"
        />

        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setFechaFilter("todos");
            setMontoFilter("");
          }}
        >
          Limpiar
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#1976d2" }}>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Nombre
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                RU
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Monto
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                Fecha Pago
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, idx) => (
              <TableRow key={idx}>
                <TableCell>{row.nombreCompleto}</TableCell>
                <TableCell>{row.ru}</TableCell>
                <TableCell>{parseFloat(row.montoPagado).toFixed(2)}</TableCell>
                <TableCell>{row.fecha_pago.slice(0, 10)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 1, display: "flex", gap: 4 }}>
        <Typography variant="subtitle2" sx={{ fontSize: "2rem" }}>
          Total de pagos: {filteredData.length}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontSize: "2rem" }}>
          Suma total: Bs. {sumaMontos.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
};

export default TablePagoMensualidad;
