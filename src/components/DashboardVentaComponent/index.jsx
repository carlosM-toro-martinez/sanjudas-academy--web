import React, { useContext, useState } from "react";
import { Button, Grid, Box, Snackbar, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useMutation } from "react-query";
import DenominacionForm from "./DenominacionForm";
import ClientModal from "./ClientModal";
import VentaForm from "./VentaForm";
import useStyles from "./dashboardVenta.styles";
import TableVentaComponent from "./TableVentaComponent";
import { getLocalDateTime } from "../../utils/getDate";
import ventaAddService from "../../async/services/post/ventaAddService";
import ventaDetalleAddService from "../../async/services/post/ventaDetalleAddService"; // Asegúrate de importar el servicio
import { MainContext } from "../../context/MainContext";

function DashboardVentaComponent({
  products,
  refetchProducts,
  clients,
  refetchClients,
  caja,
  refetchCaja,
}) {
  const classes = useStyles();
  const { user } = useContext(MainContext);

  const [ventaData, setVentaData] = useState({
    id_trabajador: user?.id_trabajador,
    clienteId: "",
  });

  const [totalPrice, setTotalPrice] = useState();
  const [lote, setLote] = useState();

  const [denominaciones, setDenominaciones] = useState([
    { tipo_dinero: "billete", denominacion: 200, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 100, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 50, cantidad: 0 },
    { tipo_dinero: "billete", denominacion: 20, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 5, cantidad: 0 },
    { tipo_dinero: "moneda", denominacion: 1, cantidad: 0 },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openClientModal, setOpenClientModal] = useState(false);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cancelForm, setCancelForm] = useState(null);
  const [restore, setRestoreDenom] = useState(null);
  const [cantLimit, setCantLimit] = useState(0);
  const [cantUnitLimit, setCantUnitLimit] = useState(0);
  const handleOpenClientModal = () => setOpenClientModal(true);
  const handleCloseClientModal = () => setOpenClientModal(false);

  const addProducto = (
    producto,
    cliente,
    loteID,
    peso,
    price,
    cantidadPorUnidad,
    cantidad
  ) => {
    setProductosSeleccionados((prev) => {
      return [
        ...prev,
        {
          ...producto,
          clienteNombre: cliente.nombre,
          clienteId: cliente.id_cliente,
          clientePuntos: cliente.puntos_fidelidad,
          id_lote: loteID,
          peso: peso ? peso : null,
          precio: price ? price : producto.precio,
          cantidad_unidad: cantidadPorUnidad ? cantidadPorUnidad : null,
          cantidad: cantidad ? cantidad : null,
        },
      ];
    });
    actualizarTotal(productosSeleccionados);
  };

  const removeProducto = (index) => {
    setProductosSeleccionados((prev) => prev.filter((_, i) => i !== index));
    actualizarTotal(productosSeleccionados);
  };

  const actualizarTotal = (productos) => {
    const nuevoTotal = productos.reduce(
      (total, producto) => total + parseFloat(producto.precio),
      0
    );
    setVentaData((prev) => ({ ...prev, total: nuevoTotal }));
  };

  const ventaMutation = useMutation(
    () =>
      ventaAddService({
        ventaData: {
          fecha_venta: getLocalDateTime(),
          total: totalPrice,
          id_cliente: ventaData.clienteId,
          id_trabajador: ventaData.id_trabajador,
          rebaja_aplicada: 0,
          descuento_fidelidad_aplicado: 0,
        },
        id_caja: caja?.caja?.id_caja || 1,
        denominaciones: denominaciones,
      }),
    {
      onSuccess: (response) => {
        const idVenta = response?.newVenta?.id_venta;

        detalleMutation
          .mutateAsync(
            productosSeleccionados.map((producto) => ({
              ...producto,
              id_venta: idVenta,
            }))
          )
          .then(() => {
            setSnackbar({
              open: true,
              message: "Registro realizado exitosamente!",
              severity: "success",
            });
            refetchProducts();
            refetchCaja();
            if (cancelForm) {
              cancelForm();
            }
            if (setRestoreDenom) {
              setRestoreDenom();
            }
          })
          .catch((error) => {
            setSnackbar({
              open: true,
              message: `Error al agregar detalles del registro: ${error.message}`,
              severity: "error",
            });
          });
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al realizar el registro: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const detalleMutation = useMutation(
    (productosSeleccionados) => ventaDetalleAddService(productosSeleccionados),
    {
      onSuccess: (response) => {
        console.log("Detalles de registro añadidos exitosamente:", response);
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al agregar detalles de registro: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const handleSubmit = () => {
    ventaMutation.mutate();
  };

  return (
    <Box style={{ minWidth: "100%" }}>
      <Typography
        variant="h3"
        className={classes.header}
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        Registrar Salida
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={11} md={4}>
          <VentaForm
            ventaData={ventaData}
            clientes={clients}
            productos={products}
            setVentaData={setVentaData}
            setCliente={(id) =>
              setVentaData((prev) => ({ ...prev, clienteId: id }))
            }
            setProducto={(id) =>
              setVentaData((prev) => ({ ...prev, productoId: id }))
            }
            addProducto={addProducto}
            handleOpenClientModal={handleOpenClientModal}
            setProductosSeleccionados={setProductosSeleccionados}
            productosSeleccionados={productosSeleccionados}
            lote={lote}
            setLote={setLote}
            setCancelForm={setCancelForm}
            cantLimit={cantLimit}
            setCantLimit={setCantLimit}
            cantUnitLimit={cantUnitLimit}
            setCantUnitLimit={setCantUnitLimit}
          />
        </Grid>

        <Grid item xs={11} md={8}>
          <TableVentaComponent
            productosSeleccionados={productosSeleccionados}
            removeProducto={removeProducto}
            setTotalPrice={setTotalPrice}
          />
        </Grid>
        {/* {Array.isArray(caja?.denominaciones) && (
          <DenominacionForm
            caja={caja}
            refetchCaja={refetchCaja}
            denominaciones={denominaciones}
            setDenominaciones={setDenominaciones}
            totalPrice={totalPrice}
            setRestoreDenom={setRestoreDenom}
          />
        )} */}
      </Grid>
      <div
        style={{
          margin: "2rem 0 2rem 0",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Registrar Salida
        </Button>
      </div>

      <ClientModal
        refetchClients={refetchClients}
        open={openClientModal}
        handleClose={handleCloseClientModal}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DashboardVentaComponent;
