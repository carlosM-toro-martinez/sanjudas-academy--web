import React, { useState, useEffect, useContext } from "react";
import { Button, Grid, Box, Snackbar, TextField } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import LoteFormComponent from "./LoteFormComponent";
import ProductoProveedorForm from "./ProductoProveedorForm";
import RegistroTableComponent from "./RegistroTableComponent";
import ProveedorModalComponent from "./ProveedorModalComponent";
import ProductoModalComponent from "./ProductoModalComponent";
import useStyles from "./RegisterBuy.styles";
import detalleCompraAddServices from "../../async/services/post/detalleCompraAddServices";
import loteAddServices from "../../async/services/post/loteAddServices";
import buyLoteService from "../../async/services/get/buyLoteService";
import { useMutation, useQuery } from "react-query";
import { getLocalDateTime } from "../../utils/getDate";
import { MainContext } from "../../context/MainContext";
import { Typography } from "@mui/material";
import buyAddService from "../../async/services/post/buyAddService";

const RegisterBuyComponent = ({
  products,
  proveedores,
  refetchProducts,
  refetchProveedores,
  lotes,
  refetchLote,
}) => {
  const classes = useStyles();
  const { user } = useContext(MainContext);

  const [lote, setLote] = useState("");
  const [loteNumber, setLoteNumber] = useState("");
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaCaducidad, setFechaCaducidad] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [producto, setProducto] = useState("");
  const [productoName, setProductoName] = useState("");
  const [proveedorName, setProveedorName] = useState("");
  const [cantidad, setCantidad] = useState(null);
  const [precio, setPrecio] = useState(null);
  const [peso, setPeso] = useState(null);
  const [subCantidad, setSubCantidad] = useState(null);
  const [registroCombinado, setRegistroCombinado] = useState([]);
  const [detalleCompraId, setDetalleCompraId] = useState(null);
  const [error, setError] = useState();
  const [isLoteProveedorLocked, setIsLoteProveedorLocked] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openProveedorModal, setOpenProveedorModal] = useState(false);
  const [openProductoModal, setOpenProductoModal] = useState(false);

  const handleOpenProveedorModal = () => setOpenProveedorModal(true);
  const handleCloseProveedorModal = () => setOpenProveedorModal(false);

  const handleOpenProductoModal = () => setOpenProductoModal(true);
  const handleCloseProductoModal = () => setOpenProductoModal(false);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // const { data, refetch } = useQuery(
  //   ["detalle-compra", loteNumber],
  //   () => (loteNumber ? buyLoteService(loteNumber) : []),
  //   {
  //     enabled: true,
  //     onSuccess: (data) => {
  //       setRegistroCombinado(data);
  //     },
  //     onError: (error) => {
  //       setSnackbar({
  //         open: true,
  //         message: `Error al obtener los datos del lote: ${error.message}`,
  //         severity: "error",
  //       });
  //     },
  //   }
  // );

  // useEffect(() => {
  //   if (loteNumber) {
  //     refetch();
  //   }
  // }, [loteNumber, snackbar]);

  const detalleCompraMutation = useMutation(detalleCompraAddServices, {
    onSuccess: (response) => {
      setDetalleCompraId(response.id_detalle);
      const newLote = {
        id_producto: producto,
        numero_lote: lote,
        fecha_ingreso: getLocalDateTime(),
        fecha_caducidad: fechaCaducidad,
        cantidad: cantidad ? cantidad : 0,
        precio_unitario: precio,
        peso: peso ? peso : 0,
        subCantidad: subCantidad ? subCantidad * cantidad : 0,
        cantidadPorCaja: subCantidad > 0 ? subCantidad : null,
        id_detalle_compra: response.id_detalle,
      };
      loteMutation.mutate(newLote);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al guardar el detalle de compra: ${error.message}`,
        severity: "error",
      });
    },
  });

  const loteMutation = useMutation(loteAddServices, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Lote creado exitosamente!",
        severity: "success",
      });
      setLoteNumber(lote);
      setIsLoteProveedorLocked(true);
      setFechaIngreso("");
      setFechaCaducidad("");
      setCantidad("");
      setPrecio("");
      setSubCantidad(null);
      setPeso("");
      setDetalleCompraId(null);
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear el lote: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSave = () => {
    setLoteNumber(lote);
    const newBuy = {
      producto: productoName,
      proveedor: proveedorName,
      id_proveedor: proveedor,
      id_producto: producto,
      numero_lote: lote,
      cantidad: cantidad ? cantidad : 0,
      precio_unitario: precio,
      peso: peso ? peso : null,
      subCantidad: subCantidad ? subCantidad * cantidad : 0,
      cantidadPorCaja: subCantidad > 0 ? subCantidad : null,
      fecha_ingreso: getLocalDateTime(),
      fecha_compra: getLocalDateTime(),
      fecha_caducidad: fechaCaducidad,
      id_trabajador: user?.id_trabajador,
    };
    setRegistroCombinado((prevRegistro) => [...prevRegistro, newBuy]);
    setLoteNumber(lote);
    setIsLoteProveedorLocked(true);
    setFechaIngreso("");
    setFechaCaducidad("");
    setCantidad("");
    setPrecio("");
    setSubCantidad(null);
    setPeso("");
    setDetalleCompraId(null);
    // detalleCompraMutation.mutate(newBuy);
  };

  const buyMutation = useMutation(buyAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Compra realizada exitosamente!",
        severity: "success",
      });
      setIsLoteProveedorLocked(false);
      setProveedor("");
      setLote("");
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al realizar la compra: ${error.message || "Intenta de nuevo"}`,
        severity: "error",
      });
    },
  });

  const handleFinalize = () => {
    const transformedArray = registroCombinado.map((item, index) => ({
      detalleCompraData: {
        id_proveedor: item.id_proveedor,
        id_producto: item.id_producto,
        numero_lote: item.numero_lote,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        peso: item.peso,
        subCantidad: item.subCantidad,
        cantidadPorCaja: item.cantidadPorCaja,
        fecha_ingreso: item.fecha_ingreso,
        fecha_compra: item.fecha_compra,
        fecha_caducidad: item.fecha_caducidad,
        id_trabajador: item?.id_trabajador,
      },
      loteData: {
        id_proveedor: item.id_proveedor,
        id_producto: item.id_producto,
        numero_lote: item.numero_lote,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        peso: item.peso,
        subCantidad: item.subCantidad,
        cantidadPorCaja: item.cantidadPorCaja,
        fecha_ingreso: item.fecha_ingreso,
        fecha_compra: item.fecha_compra,
        fecha_caducidad: item.fecha_caducidad,
        id_trabajador: item?.id_trabajador,
      },
      productId: item.id_producto,
      productUpdateData: {
        tipo_movimiento: "compra",
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        fecha_caducidad: item.fecha_caducidad,
        peso: item.peso,
        subCantidad: item.subCantidad,
        cantidadPorCaja: item.cantidadPorCaja,
        id_trabajador: item.id_trabajador,
      },
    }));
    buyMutation.mutate(transformedArray);
    console.log("Transformed Array: ", transformedArray);
    setIsLoteProveedorLocked(false);
    setProveedor("");
    setLote("");
    setRegistroCombinado([]);
  };

  return (
    <Box style={{ minWidth: "100%", paddingLeft: "2rem", overflowX: "hidden" }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={11} md={4}>
            <Typography
              variant="h3"
              className={classes.header}
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "2rem 0 2rem 0",
              }}
            >
              Registro de Lote
            </Typography>
            <ProductoProveedorForm
              setProductoName={setProductoName}
              setProveedorName={setProveedorName}
              proveedor={proveedor}
              setProveedor={setProveedor}
              producto={producto}
              setProducto={setProducto}
              productos={products}
              proveedores={proveedores}
              setError={setError}
              handleOpenProductoModal={handleOpenProductoModal}
              handleOpenProveedorModal={handleOpenProveedorModal}
              isLoteProveedorLocked={isLoteProveedorLocked}
            />
            <LoteFormComponent
              lote={lote}
              loteData={lotes}
              setLote={setLote}
              fechaIngreso={fechaIngreso}
              setFechaIngreso={setFechaIngreso}
              fechaCaducidad={fechaCaducidad}
              setFechaCaducidad={setFechaCaducidad}
              cantidad={cantidad}
              setCantidad={setCantidad}
              precio={precio}
              setPrecio={setPrecio}
              setError={setError}
              isLoteProveedorLocked={isLoteProveedorLocked}
              peso={peso}
              setPeso={setPeso}
              subCantidad={subCantidad}
              setSubCantidad={setSubCantidad}
            />
          </Grid>
          <Grid item xs={11} md={8}>
            <Typography
              variant="h3"
              className={classes.header}
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                margin: "2rem 0 2rem 0",
              }}
            >
              Compra
            </Typography>
            <RegistroTableComponent
              registroCombinado={registroCombinado}
              setRegistroCombinado={setRegistroCombinado}
              handleFinalize={handleFinalize}
              numeroLote={loteNumber}
            />
          </Grid>
        </Grid>
        <Button
          type="submit" // Cambiar el tipo a "submit"
          variant="contained"
          color="primary"
          style={{
            backgroundColor: "#3d97ef",
            color: "#fff",
            marginTop: "20px",
            fontWeight: "bold",
          }}
          disabled={
            detalleCompraMutation.isLoading || loteMutation.isLoading || error
          }
        >
          {detalleCompraMutation.isLoading || loteMutation.isLoading
            ? "Guardando..."
            : "Guardar"}
        </Button>
      </form>

      <ProveedorModalComponent
        refetchProveedores={refetchProveedores}
        open={openProveedorModal}
        handleClose={handleCloseProveedorModal}
      />
      <ProductoModalComponent
        refetchProducts={refetchProducts}
        open={openProductoModal}
        handleClose={handleCloseProductoModal}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegisterBuyComponent;
