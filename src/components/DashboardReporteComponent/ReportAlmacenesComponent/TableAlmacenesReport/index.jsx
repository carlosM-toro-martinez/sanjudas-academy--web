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
} from "@material-ui/core";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import useStyles from "./tableAlmacenes.styles";

function Row({ row }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{row.id_movimiento}</TableCell>
        <TableCell>{row.cantidad}</TableCell>
        <TableCell>{row.fecha_movimiento}</TableCell>
        <TableCell>{row.tipo_movimiento}</TableCell>
        <TableCell>{row.producto.nombre}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className={classes.collapseCell}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <h4>Detalles del Producto</h4>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID Producto</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Lote</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Fecha Caducidad</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.producto.lotes.map((lote) => (
                    <TableRow key={lote.id_lote}>
                      <TableCell>{row.producto.id_producto}</TableCell>
                      <TableCell>{row.producto.nombre}</TableCell>
                      <TableCell>{lote.numero_lote}</TableCell>
                      <TableCell>{lote.cantidad}</TableCell>
                      <TableCell>{lote.fecha_caducidad}</TableCell>
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

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID Movimiento</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Fecha Movimiento</TableCell>
            <TableCell>Tipo Movimiento</TableCell>
            <TableCell>Producto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((row) => (
            <Row key={row.id_movimiento} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
