import React, { useContext } from "react";
import DrawerComponent from "../../components/DrawerComponent";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { MainContext } from "../../context/MainContext";
import movimientoInventariosService from "../../async/services/get/movimientoInventariosService";
import { useQuery } from "react-query";
import TableInventarioComponent from "../../components/TableInventarioComponent";

function MovimientoInventario() {
  const {
    data: movimientos,
    isLoading: isLoadingMovimientos,
    error: errorMovimientos,
    refetch: refetchMovimientos,
  } = useQuery("movimientos-inventario", movimientoInventariosService);
  console.log(movimientos);
  const { data } = useContext(MainContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/movimiento-inventario/crear");
  };

  return (
    <>
      <DrawerComponent>
        <Box style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleButtonClick}
            >
              Realizar Movimiento
            </Button>
          </Box>
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {movimientos && !errorMovimientos && (
              <TableInventarioComponent movimientos={movimientos} />
            )}
          </Box>
        </Box>
      </DrawerComponent>
    </>
  );
}

export default MovimientoInventario;
