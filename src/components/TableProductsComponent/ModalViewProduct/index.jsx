import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import productosInventarioService from "../../../async/services/get/productosInventarioService";
import { useMutation, useQuery } from "react-query";
import { TextField } from "@mui/material";
import detalleCompraUpdateServices from "../../../async/services/put/detalleCompraUpdateServices";
import detalleCompraDeleteServices from "../../../async/services/delete/detalleCompraDeleteServices";

function ModalViewProduct({
  handleClose,
  product,
  editingRow,
  setEditingRow,
  editedPrice,
  setEditedPrice,
  mutate,
  mutateDelete
}) {
  const { data, isLoading, error, refetch } = useQuery(
    `InventarioProducts`,
    () => productosInventarioService(product?.id_producto),
    {
      enabled: !!product?.id_producto,
    }
  );

  if (isLoading) {
    return (
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Ver Producto</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ocurrió un error al cargar los inventarios. Por favor, intenta de
            nuevo.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return null;
  }
  const handleEdit = (index, precioActual) => {
    setEditingRow(index);
    setEditedPrice(precioActual);
  };

  const handleSave = (index) => {
    const item = data.inventarios[index].detalleCompra.id_detalle;

    if (item && editedPrice) {
      mutate({ id: item, updatedPrice: parseFloat(editedPrice) });
    }
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedPrice("");
  };

  const handleDelete = (inventario, index) => {
    const dataDelete = {
      id_producto: inventario.detalleCompra.id_producto,
      id_lote: inventario.id_lote,
      id_inventario: inventario.id_inventario || null,
      id_movimiento: inventario.id_movimiento || null,
      id_detalle: inventario.detalleCompra.id_detalle,
      cantidad: inventario.cantidad,
      subCantidad: inventario.subCantidad,
      peso: parseFloat(inventario.peso) || 0,
    };
    console.log(dataDelete);
    
    mutateDelete({ dataDelete, idDetalle: inventario.detalleCompra.id_detalle });
  };



  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>Ver Producto</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Producto: {data.producto}</Typography>
        <TableContainer component={Paper} style={{ marginTop: "1rem" }}>
          <Table>
            <TableHead style={{ backgroundColor: "#3d97ef" }}>
              <TableRow>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Número de Lote
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Cantidad (c/p)
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Unidades
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Peso (kg)
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Caducidad
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Ingreso
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Precio de compra
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Editar precio
                </TableCell>
                <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                  Eliminar
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.inventarios.map((inventario, index) => (
                <TableRow key={index}>
                  <TableCell>{inventario.numero_lote}</TableCell>
                  <TableCell style={{ color: "green" }}>
                    {inventario.cantidad > 0 && inventario.subCantidad === 0
                      ? inventario.subCantidad
                      : inventario.cantidad}
                  </TableCell>
                  <TableCell
                    style={{
                      color: "green",
                    }}
                  >
                    {inventario.cantidad > 0 && inventario.subCantidad === 0
                      ? inventario.cantidad
                      : inventario.subCantidad}
                  </TableCell>
                  <TableCell
                    style={{ color: inventario.peso > 0 ? "green" : "red" }}
                  >
                    {inventario.peso}
                  </TableCell>
                  <TableCell>
                    {inventario?.fecha_caducidad?.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </TableCell>
                  <TableCell>
                    {inventario?.fecha_ingreso?.split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </TableCell>
                  <TableCell>
                    {editingRow === index ? (
                      <TextField
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        type="number"
                        variant="outlined"
                        size="small"
                        sx={{ width: "100px", height: "56px" }} // Cambia los valores según el tamaño que desees
                      />
                    ) : (
                      inventario.detalleCompra.precio_unitario
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === index ? (
                      <>
                        <Button onClick={() => handleSave(index)}>
                          Guardar
                        </Button>
                        <Button onClick={handleCancel} color="error">
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() =>
                          handleEdit(
                            index,
                            inventario.detalleCompra.precio_unitario
                          )
                        }
                      >
                        Editar
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                      <Button
                        onClick={() => handleDelete(inventario, index)}
                      >
                        Eliminar
                      </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalViewProduct;
