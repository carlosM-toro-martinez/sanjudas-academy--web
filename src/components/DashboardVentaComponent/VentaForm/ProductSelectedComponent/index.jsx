import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import useStyles from "./tableProductSelect.styles";
import ClienteAutocompleteComponent from "../ClienteAutocompleteComponent";
import ProductoAutocompleteComponent from "../ProductoAutocompleteComponent";
import MetodoPagoComponent from "../MetodoPagoComponent";

const ProductSelectedComponent = ({
  productosSeleccionados,
  productosDetallados,
  setTotalPrice,
  setProductosDetallados,
  handleCancelar,
  clientes,
  ventaData,
  setCliente,
  handleOpenClientModal,
  productosUnicosFiltrados,
  handleProductoChange,
  setCantidad,
  setCantidadPorUnidad,
  metodoPago,
  setMetodoPago,
}) => {
  const classes = useStyles();

  const calcularPrecio = (producto) => {
    if (producto.precioManual) {
      return producto.precioManual;
    }
    if (producto.metodoSeleccionado) {
      return producto.metodoSeleccionado.precio || 0;
    }
    return producto?.newValue?.inventarios[0]?.lote?.producto?.precio || 0;
  };

  const calcularCantidadActiva = (producto) => {
    if (producto.metodoSeleccionado) {
      if (producto.pesoMetodoCantidad) {
        return producto.pesoMetodoCantidad || 0;
      }
      return producto.cantidadMetodo || 0;
    }

    const cantidadActiva =
      producto.cantidadPorUnidad ||
      producto.peso ||
      producto.cantidad ||
      producto.cantidadMetodo ||
      0;
    return cantidadActiva;
  };

  const calcularSumaTotal = () =>
    productosDetallados.reduce((total, producto) => {
      const precio = calcularPrecio(producto);
      const cantidadActiva = calcularCantidadActiva(producto);
      if (producto.precioManual) {
        return total + precio;
      }
      return total + precio * cantidadActiva;
    }, 0);

  useEffect(() => {
    const total = calcularSumaTotal();

    setTotalPrice(total);
  }, [productosDetallados, setTotalPrice]);

  const handleInputChange = (
    index,
    field,
    value,
    maxValue,
    peso_por_metodo
  ) => {
    const newValue = Math.min(value, maxValue);
    const updatedProductos = [...productosDetallados];
    if (peso_por_metodo) {
      updatedProductos[index] = {
        ...updatedProductos[index],
        [field]: typeof value === "number" ? newValue : value,
        pesoMetodo: newValue * peso_por_metodo,
      };
    } else {
      updatedProductos[index] = {
        ...updatedProductos[index],
        [field]: typeof value === "number" ? newValue : value,
      };
    }

    setProductosDetallados(updatedProductos);
  };

  const handlePriceChange = (index, value, field, precioUnidad) => {
    const updatedProductos = [...productosDetallados];

    updatedProductos[index] = {
      ...updatedProductos[index],
      precioManual: value,
      [field]: value / precioUnidad,
    };

    setProductosDetallados(updatedProductos);
  };

  //   if (Array.isArray(productosDetallados) && productosDetallados.length > 0) {
  //     const updatedProductos = productosDetallados.map((producto) => {
  //       const {
  //         pesoLimit,
  //         cantLimit,
  //         cantUnitLimit,
  //         peso,
  //         cantidad,
  //         cantidadPorUnidad,
  //       } = producto;

  //       return {
  //         ...producto,
  //         peso: pesoLimit > 0 && peso === undefined ? 1 : peso,
  //         cantidad:
  //           cantLimit > 0 && cantUnitLimit === 0 && cantidad === undefined
  //             ? 1
  //             : cantidad,
  //         cantidadPorUnidad:
  //           cantUnitLimit > 0 &&
  //           pesoLimit <= 0 &&
  //           cantidadPorUnidad === undefined
  //             ? 1
  //             : cantidadPorUnidad,
  //       };
  //     });

  //     setProductosDetallados(updatedProductos);
  //   }
  // }, [productosDetallados]);

  const handleDelete = (index) => {
    const updatedProductos = productosDetallados.filter((_, i) => i !== index);
    setProductosDetallados(updatedProductos);
  };

  const handleChangeMetodo = (event) => {
    setMetodoSeleccionado(event.target.value);
  };

  return (
    <TableContainer component={Paper}>
      <TableRow sx={{ width: "100%", display: "flex" }}>
        <TableCell
          sx={{
            fontWeight: "bold",
            color: "#000",
            fontSize: "1.2rem",
            textTransform: "capitalize",
            display: "flex",
            flex: 1,
            justifyContent: "center",
          }}
          colSpan={2}
        >
          <ClienteAutocompleteComponent
            clientes={clientes}
            ventaData={ventaData}
            setCliente={setCliente}
            handleOpenClientModal={handleOpenClientModal}
            productosSeleccionados={productosSeleccionados}
          />
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "bold",
            color: "#000",
            fontSize: "1.2rem",
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
          colSpan={2}
        >
          <MetodoPagoComponent
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
          />
        </TableCell>
        <TableCell
          sx={{
            fontWeight: "bold",
            color: "#000",
            fontSize: "1.2rem",
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          colSpan={2}
        >
          <ProductoAutocompleteComponent
            productosUnicosFiltrados={productosUnicosFiltrados}
            ventaData={ventaData}
            handleProductoChange={handleProductoChange}
            setCantidad={setCantidad}
            setCantidadPorUnidad={setCantidadPorUnidad}
          />
        </TableCell>
      </TableRow>

      <Table
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          display: "block",
        }}
      >
        <TableHead>
          <TableRow
            className={classes.tableHeader}
            sx={{ backgroundColor: "#3d97ef" }}
          >
            {[
              "Producto",
              "Precio",
              "Peso",
              "Cantidad",
              "Cant. por unidad",
              "Medodo V",
              "Acciones",
            ].map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: "bold",
                  color: "#fff",
                  width: "16.6%",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(productosDetallados) &&
            productosDetallados?.length > 0 &&
            productosDetallados?.map((producto, index) => {
              const {
                cantLimit,
                cantUnitLimit,
                pesoLimit,
                newValue,
                metodosVenta,
                metodoSeleccionado,
              } = producto;
              const precioUnidad =
                producto?.newValue?.inventarios[0]?.lote?.producto?.precio || 0;

              return (
                <TableRow key={index}>
                  <TableCell sx={{ textTransform: "capitalize" }}>
                    {newValue?.nombre}
                  </TableCell>
                  <TableCell>
                    {pesoLimit > 0 && !metodoSeleccionado ? (
                      <>
                        <TextField
                          label="Precio Manual"
                          type="number"
                          value={producto.precioManual || ""}
                          onChange={(e) =>
                            handlePriceChange(
                              index,
                              parseFloat(e.target.value),
                              "peso",
                              precioUnidad
                            )
                          }
                          inputProps={{
                            step: "0.01",
                          }}
                          fullWidth
                        />
                        <Typography variant="caption" color="textSecondary">
                          Precio manual
                        </Typography>
                      </>
                    ) : (
                      <>
                        {metodoSeleccionado
                          ? metodoSeleccionado.precio
                          : newValue?.inventarios[0]?.lote?.producto
                              ?.precio}{" "}
                        Bs
                      </>
                    )}
                    {/* <>
                        {metodoSeleccionado
                          ? metodoSeleccionado.precio
                          : newValue?.inventarios[0]?.lote?.producto
                              ?.precio}{" "}
                        Bs
                      </> */}
                  </TableCell>

                  <TableCell>
                    {pesoLimit > 0 && (
                      <>
                        {metodoSeleccionado ? (
                          <>
                            <TextField
                              label="Peso por metodo"
                              type="number"
                              value={producto.pesoMetodoCantidad || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "pesoMetodoCantidad",
                                  parseFloat(e.target.value),
                                  Math.trunc(
                                    pesoLimit /
                                      metodoSeleccionado?.peso_por_metodo
                                  ),
                                  metodoSeleccionado?.peso_por_metodo
                                )
                              }
                              inputProps={
                                {
                                  // max: pesoLimit,
                                  // step: "0.01",
                                }
                              }
                              fullWidth
                            />
                            <Typography variant="caption" color="textSecondary">
                              Max:{" "}
                              {Math.trunc(
                                pesoLimit / metodoSeleccionado?.peso_por_metodo
                              )}{" "}
                              {metodoSeleccionado?.descripcion}s
                            </Typography>
                          </>
                        ) : (
                          <>
                            <TextField
                              label="Peso"
                              type="number"
                              value={producto.peso || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "peso",
                                  parseFloat(e.target.value),
                                  pesoLimit
                                )
                              }
                              inputProps={{
                                max: pesoLimit,
                                step: "0.01",
                              }}
                              fullWidth
                            />
                            <Typography variant="caption" color="textSecondary">
                              Max: {pesoLimit} Kg
                            </Typography>
                          </>
                        )}
                      </>
                    )}
                  </TableCell>

                  <TableCell>
                    {cantUnitLimit === 0 && cantLimit > 0 && (
                      <>
                        <TextField
                          label="Cantidad"
                          type="number"
                          value={producto.cantidad || ""}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "cantidad",
                              parseInt(e.target.value),
                              cantLimit
                            )
                          }
                          inputProps={{
                            max: cantLimit,
                          }}
                          fullWidth
                        />
                        <Typography variant="caption" color="textSecondary">
                          Max: {cantLimit}
                        </Typography>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {cantUnitLimit !== 0 && pesoLimit <= 0 && (
                      <>
                        {metodoSeleccionado ? (
                          <>
                            <TextField
                              label="Cantidad por metodo"
                              type="number"
                              value={producto.cantidadMetodo || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "cantidadMetodo",
                                  parseInt(e.target.value),
                                  Math.trunc(
                                    cantUnitLimit /
                                      metodoSeleccionado?.cantidad_por_metodo
                                  )
                                )
                              }
                              inputProps={
                                {
                                  //max: cantUnitLimit,
                                }
                              }
                              fullWidth
                            />
                            <Typography variant="caption" color="textSecondary">
                              Max:{" "}
                              {Math.trunc(
                                cantUnitLimit /
                                  metodoSeleccionado?.cantidad_por_metodo
                              )}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <TextField
                              label="Cantidad por unidad"
                              type="number"
                              value={producto.cantidadPorUnidad || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "cantidadPorUnidad",
                                  parseInt(e.target.value),
                                  cantUnitLimit
                                )
                              }
                              inputProps={{
                                max: cantUnitLimit,
                              }}
                              fullWidth
                            />
                            <Typography variant="caption" color="textSecondary">
                              Max: {cantUnitLimit} u
                            </Typography>
                          </>
                        )}
                      </>
                    )}
                  </TableCell>

                  <TableCell>
                    {Array.isArray(metodosVenta) && metodosVenta.length > 0 ? (
                      <FormControl fullWidth>
                        <InputLabel>Mét. Venta</InputLabel>
                        <Select
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              "metodoSeleccionado",
                              e.target.value
                            )
                          }
                          label="Método de Venta"
                        >
                          {metodosVenta.map((metodo) => (
                            <MenuItem
                              key={metodo.id_metodo_venta}
                              value={metodo}
                            >
                              {metodo.descripcion}
                            </MenuItem>
                          ))}
                        </Select>
                        <Typography variant="caption" color="textSecondary">
                          Max: {cantLimit} cajas
                        </Typography>
                      </FormControl>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleDelete(index)}>
                      <DeleteOutlineOutlinedIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
      <TableRow>
        <TableCell sx={{ fontWeight: "bold", fontSize: "2rem" }} colSpan={1}>
          Total
        </TableCell>
        <TableCell sx={{ fontWeight: "bold", fontSize: "2rem" }} colSpan={3}>
          {calcularSumaTotal()} Bs
        </TableCell>
        <TableCell sx={{ fontWeight: "bold" }} colSpan={1}>
          <Button
            variant="contained"
            style={{
              backgroundColor: "red",
              color: "#fff",
              fontWeight: "bold",
              width: "10rem",
            }}
            fullWidth
            onClick={handleCancelar}
          >
            Cancelar
          </Button>
        </TableCell>
      </TableRow>
    </TableContainer>
  );
};

export default ProductSelectedComponent;
