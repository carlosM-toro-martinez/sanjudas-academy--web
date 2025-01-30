import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import useStyles from "./tableMetodoVenta.styles";

const TableMetodoVentaComponent = ({ data, products, onProductSelect }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const classes = useStyles();
  useEffect(() => {
    if (selectedProduct) {
      onProductSelect(selectedProduct.id_producto);
    }
  }, [selectedProduct, onProductSelect]);

  return (
    <div>
      <Autocomplete
        options={products}
        getOptionLabel={(option) => option.nombre}
        onChange={(event, newValue) => {
          setSelectedProduct(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seleccionar Producto"
            variant="outlined"
          />
        )}
      />

      <TableContainer
        component={Paper}
        style={{ marginTop: "20px" }}
        className={classes.tableContainer}
      >
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Descripción
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Cantidad por Método
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ color: "#fff", fontWeight: "bold" }}
              >
                Precio
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id_metodo_venta}>
                <TableCell>{row.descripcion}</TableCell>
                <TableCell>{row.cantidad_por_metodo}</TableCell>
                <TableCell>
                  {row.precio !== null ? row.precio : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableMetodoVentaComponent;
