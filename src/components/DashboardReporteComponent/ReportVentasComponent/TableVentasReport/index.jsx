import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  Paper,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import useStyles from "./tableVentas.styles";

function TableVentasReport({ reportData }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Fecha Venta</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>Trabajador</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Rebaja Aplicada</TableCell>
            <TableCell>Descuento Fidelidad</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((venta) => (
            <VentaRow key={venta.id_venta} venta={venta} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function VentaRow({ venta }) {
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
        <TableCell>
          {new Date(venta.fecha_venta).toLocaleDateString()}
        </TableCell>
        <TableCell>{`${venta.cliente.nombre} ${venta.cliente.apellido}`}</TableCell>
        <TableCell>{venta.trabajadorVenta.nombre}</TableCell>
        <TableCell>{venta.total}</TableCell>
        <TableCell>{venta.rebaja_aplicada}</TableCell>
        <TableCell>{venta.descuento_fidelidad_aplicado}</TableCell>
      </TableRow>

      {/* Detalles colapsables */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.collapseContainer}>
              <Typography variant="h6" gutterBottom>
                Detalles de Venta
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {venta.detallesVenta.map((detalle, index) => (
                    <TableRow key={index}>
                      <TableCell>{detalle.producto.nombre}</TableCell>
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>{detalle.precio_unitario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default TableVentasReport;
