import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
  Snackbar,
  Alert,
  Collapse,
  Box,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useStyles from "./tableMovimientos.styles";

function TableInventarioComponent({ movimientos }) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRows, setOpenRows] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleRowOpen = (idMovimiento) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [idMovimiento]: !prevOpenRows[idMovimiento],
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const paginatedMovimientos = movimientos.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper className={classes.tableContainer}>
      <TableContainer>
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Producto
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Cantidad
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Tipo de Movimiento
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Fecha
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Trabajador
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedMovimientos.map((movimiento) => (
              <React.Fragment key={movimiento.id_movimiento}>
                <TableRow>
                  <TableCell>{movimiento.producto.nombre}</TableCell>
                  <TableCell>{movimiento.cantidad}</TableCell>
                  <TableCell>{movimiento.tipo_movimiento}</TableCell>
                  <TableCell>
                    {new Date(movimiento.fecha_movimiento).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRowOpen(movimiento.id_movimiento)}
                    >
                      {openRows[movimiento.id_movimiento] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Fila colapsable con los detalles del trabajador */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={5}
                  >
                    <Collapse
                      in={openRows[movimiento.id_movimiento]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Table size="small" aria-label="trabajador">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Apellido</TableCell>
                              <TableCell>Cargo</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                {
                                  movimiento.trabajadorMovimientoInventario
                                    .nombre
                                }
                              </TableCell>
                              <TableCell>{`${movimiento.trabajadorMovimientoInventario.apellido_paterno} ${movimiento.trabajadorMovimientoInventario.apellido_materno}`}</TableCell>
                              <TableCell>
                                {movimiento.trabajadorMovimientoInventario
                                  .cargo || "Sin asignar"}
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={movimientos.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default TableInventarioComponent;
