// Ventas.js
import React, { useContext, useState } from "react";
import DashboardComponent from "../../components/DashboardComponent";
import DrawerComponent from "../../components/DrawerComponent";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { MainContext } from "../../context/MainContext";
import FormMetodoVentaComponent from "../../components/FormMetodoVentaComponent";
import productosService from "../../async/services/get/productosService";
import metodoVentasService from "../../async/services/get/metodoVentasService.js";
import TableMetodoVentaComponent from "../../components/TableMetodoVentaComponent";
import { useQuery } from "react-query";

function Ventas() {
  const { data } = useContext(MainContext);
  const { data: productos, isLoading: isLoadingProductos } = useQuery(
    "products",
    productosService
  );
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { data: metodoVentasData, refetch } = useQuery(
    ["metodoVentas", selectedProductId],
    () => metodoVentasService(selectedProductId),
    {
      enabled: !!selectedProductId,
    }
  );
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);

  const handleButtonClick = () => {
    // if (data?.caja?.fecha_cierre) {
    //   setOpenDialog(true);
    // } else {
    navigate("/ventas/crear");
    // }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleGoToCaja = () => {
    navigate("/movimiento-caja");
  };

  const handleOpenForm = () => {
    setOpenFormDialog(true);
  };

  const handleCloseForm = () => {
    setOpenFormDialog(false);
  };

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
  };

  return (
    <>
      <DrawerComponent>
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleButtonClick}
            >
              Registrar Salida de almacen
            </Button>
          </div>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
            }}
          >
            <TableMetodoVentaComponent
              data={metodoVentasData || []} // Pasa los datos obtenidos a la tabla
              products={productos || []} // Pasa la lista de productos
              onProductSelect={handleProductSelect} // Pasa la función para manejar la selección de producto
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
              style={{ width: "15rem" }}
            >
              Crear presentacion
            </Button>
          </div> */}
        </div>
      </DrawerComponent>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Caja Cerrada</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, abre la caja para registrar las ventas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleGoToCaja} color="primary">
            Ir a Caja
          </Button>
        </DialogActions>
      </Dialog>

      {/* <Dialog open={openFormDialog} onClose={handleCloseForm}>
        <DialogTitle>Crear Método de Venta</DialogTitle>
        <DialogContent>
          <FormMetodoVentaComponent
            handleClose={handleCloseForm}
            productos={productos}
            isLoadingProductos={isLoadingProductos}
            refetchMetodoVentas={refetch}
          />
        </DialogContent>
      </Dialog> */}
    </>
  );
}

export default Ventas;
