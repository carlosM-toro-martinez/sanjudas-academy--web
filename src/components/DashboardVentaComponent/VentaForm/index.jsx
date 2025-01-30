import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const VentaForm = ({
  ventaData,
  setVentaData,
  clientes,
  productos,
  setProducto,
  setCliente,
  addProducto,
  handleOpenClientModal,
  productosSeleccionados,
  setProductosSeleccionados,
  lote,
  setLote,
  setCancelForm,
  cantLimit,
  setCantLimit,
  cantUnitLimit,
  setCantUnitLimit,
}) => {
  const [lotesProducto, setLotesProducto] = useState([]);
  const [peso, setPeso] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantLote, setCantLote] = useState(null);
  const [cantidadPorUnidad, setCantidadPorUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [cantidadPorCaja, setCantidadPorCaja] = useState("");

  useEffect(() => {
    const clienteDefecto = clientes.find((cliente) => cliente.id_cliente === 1);
    if (clienteDefecto) {
      setCliente(clienteDefecto.id_cliente);
    }
  }, [clientes]);

  const handleProductoChange = (productoId, newValue) => {
    setProducto(productoId);

    const lotesFiltrados =
      productos
        .find((producto) => producto.id_producto === productoId)
        ?.inventarios.filter((inv) => inv.lote.cantidad > 1)
        .map((inv) => inv) || [];

    setLotesProducto(lotesFiltrados);
    setCantLimit(lotesFiltrados[0]?.lote?.producto?.stock);
    setCantUnitLimit(lotesFiltrados[0]?.lote?.producto?.subCantidad);
    setCantidadPorCaja(
      lotesFiltrados[0]?.lote?.cantidadPorCaja
        ? lotesFiltrados[0]?.lote?.cantidadPorCaja
        : 10
    );

    if (lotesFiltrados.length > 0) {
      const loteMasAntiguo = lotesFiltrados.reduce((prev, current) => {
        const prevDate = new Date(prev.lote.fecha_caducidad);
        const currentDate = new Date(current.lote.fecha_caducidad);
        return currentDate < prevDate ? current : prev;
      });

      handleLoteChange(loteMasAntiguo?.lote?.id_lote, lotesFiltrados);
      setCantLote(loteMasAntiguo);
    }
  };

  const handleLoteChange = (loteId, lotesParam) => {
    setLote(loteId);
    const lotes = lotesParam || lotesProducto;
    const loteSeleccionado = lotes.find((lote) => {
      return lote.lote.id_lote === loteId;
    });

    setCantLote(loteSeleccionado);
    setVentaData((prev) => ({ ...prev, loteId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productoSeleccionado = productos.find(
      (producto) => producto.id_producto === ventaData.productoId
    );
    const clienteSeleccionado = clientes.find(
      (cliente) => cliente.id_cliente === ventaData.clienteId
    );

    let cajasRestantes = 0;
    if (cantidadPorUnidad) {
      cajasRestantes = Math.floor(cantidadPorUnidad / cantidadPorCaja);
      setCantidad(cajasRestantes);
    } else {
      cajasRestantes = cantidad;
    }

    if (productoSeleccionado && clienteSeleccionado) {
      const lotesOrdenados = lotesProducto.sort(
        (a, b) => a.lote.id_lote - b.lote.id_lote
      );

      let cantidadRestante = cantidadPorUnidad;
      for (let i = 0; i < lotesOrdenados.length; i++) {
        let loteData = lotesOrdenados[i];
        console.log(loteData.lote.id_lote);

        if (cantidadRestante >= loteData.subCantidad) {
          cantidadRestante -= loteData.subCantidad;
          addProducto(
            productoSeleccionado,
            clienteSeleccionado,
            loteData.lote.id_lote,
            peso,
            precio,
            loteData.subCantidad,
            cajasRestantes
          );
        } else {
          addProducto(
            productoSeleccionado,
            clienteSeleccionado,
            loteData.lote.id_lote,
            peso,
            precio,
            cantidadRestante,
            cajasRestantes
          );
          break;
        }
      }

      setVentaData((prev) => ({
        ...prev,
        productoId: "",
        loteId: "",
      }));
      setLote("");
      setLotesProducto([]);
      setPeso("");
      setPrecio("");
      setCantidadPorUnidad("");
      setCantidad("");
      setCantLimit(0);
      setCantUnitLimit(0);
    }
  };

  const handleCancelar = () => {
    setProductosSeleccionados([]);
    setVentaData((prev) => ({
      ...prev,
      productoId: "",
      loteId: "",
    }));
    setLote("");
    setLotesProducto([]);
    setPeso("");
    setPrecio("");
    setCantidadPorUnidad("");
    setCantidad("");
    setCantLimit(0);
    setCantUnitLimit(0);
  };

  useEffect(() => {
    setCancelForm(() => handleCancelar);
  }, [setCancelForm]);

  const productosUnicos = [
    ...new Map(
      productos.map((producto) => [producto.id_producto, producto])
    ).values(),
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Campos para cliente y producto */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={clientes || []}
                getOptionLabel={(cliente) => cliente?.nombre || ""}
                value={
                  clientes.find(
                    (cliente) => cliente.id_cliente === ventaData.clienteId
                  ) || null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    setCliente(newValue.id_cliente);
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  option.id_cliente === value.id_cliente
                }
                disabled={productosSeleccionados?.length > 0}
                renderInput={(params) => (
                  <TextField {...params} label="Destinatario" required />
                )}
              />
              <Button
                onClick={handleOpenClientModal}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "8px",
                }}
              >
                <AddCircleOutlineIcon color="error" />
              </Button>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={productosUnicos || []}
                getOptionLabel={(producto) => producto.nombre || ""}
                value={
                  productosUnicos.find(
                    (producto) => producto.id_producto === ventaData.productoId
                  ) || null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleProductoChange(newValue.id_producto, newValue);
                    setCantidad();
                    setCantidadPorUnidad();
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  option.id_producto === value.id_producto
                }
                filterOptions={(options, { inputValue }) => {
                  return options.filter(
                    (option) =>
                      option.nombre
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      option.codigo_barra
                        ?.toLowerCase()
                        .includes(inputValue.toLowerCase())
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Producto" />
                )}
              />
            </FormControl>
          </Grid>

          {lotesProducto.length > 0 && (
            <Grid item xs={12} sm={12} sx={{ display: "none" }}>
              <FormControl fullWidth>
                <InputLabel>Lote</InputLabel>
                <Select
                  value={ventaData.loteId || ""}
                  label="Lote"
                  onChange={(e) => handleLoteChange(e.target.value)}
                >
                  {lotesProducto.map((lote) => (
                    <MenuItem
                      key={lote?.lote?.id_lote}
                      value={lote?.lote?.id_lote}
                    >
                      {new Date(lote?.lote?.fecha_ingreso).toLocaleDateString(
                        "es-ES"
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {cantUnitLimit !== 0 && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cantidad por unidad"
                type="number"
                value={cantidadPorUnidad}
                onChange={(e) =>
                  setCantidadPorUnidad(Math.min(e.target.value, cantUnitLimit))
                }
                inputProps={{
                  max: cantUnitLimit,
                }}
                fullWidth
              />
              <Typography variant="caption" color="textSecondary">
                Límite máximo: {cantUnitLimit}
              </Typography>
            </Grid>
          )}

          {cantUnitLimit === 0 && cantLimit > 0 && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Math.min(e.target.value, cantLimit))
                }
                inputProps={{
                  max: cantLimit,
                }}
                fullWidth
              />
              <Typography variant="caption" color="textSecondary">
                Límite máximo: {cantLimit}
              </Typography>
            </Grid>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "red",
                color: "#fff",
                fontWeight: "bold",
              }}
              fullWidth
              onClick={handleCancelar}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#3d97ef",
                color: "#fff",
                fontWeight: "bold",
              }}
              fullWidth
              type="submit"
            >
              Añadir
            </Button>
          </div>
        </Grid>
      </form>
    </Box>
  );
};

export default VentaForm;
