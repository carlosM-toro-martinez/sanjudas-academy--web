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
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import useStyles from "./tableCaja.styles";

function TableCajaReport({ reportData }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Monto Inicial</TableCell>
            <TableCell>Monto Final</TableCell>
            <TableCell>Fecha Apertura</TableCell>
            <TableCell>Fecha Cierre</TableCell>
            <TableCell>Trabajador</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportData.map((caja) => (
            <CajaRow key={caja.id_caja} caja={caja} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function CajaRow({ caja }) {
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
        <TableCell>{caja.monto_inicial}</TableCell>
        <TableCell>{caja.monto_final}</TableCell>
        <TableCell>{new Date(caja.fecha_apertura).toLocaleString()}</TableCell>
        <TableCell>
          {caja.fecha_cierre
            ? new Date(caja.fecha_cierre).toLocaleString()
            : "No cerrado"}
        </TableCell>
        <TableCell>{`${caja.trabajadorCierre?.nombre || ""} ${
          caja.trabajadorCierre?.apellido_paterno || ""
        }`}</TableCell>
      </TableRow>

      {/* Colapsable de movimientos */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={classes.collapseContainer}>
              <Typography variant="h6" gutterBottom>
                Movimientos de Caja
              </Typography>
              <Table size="small" aria-label="movimientos">
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo Movimiento</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Fecha Movimiento</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Trabajador</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {caja.movimientos.map((movimiento, index) => (
                    <TableRow key={index}>
                      <TableCell>{movimiento.tipo_movimiento}</TableCell>
                      <TableCell>{movimiento.monto}</TableCell>
                      <TableCell>
                        {new Date(movimiento.fecha_movimiento).toLocaleString()}
                      </TableCell>
                      <TableCell>{movimiento.motivo}</TableCell>
                      <TableCell>{`${movimiento.trabajadorMovimiento.nombre} ${movimiento.trabajadorMovimiento.apellido_paterno}`}</TableCell>
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

export default TableCajaReport;
