import React, { useEffect, useState } from "react";
import CarouselMoneyComponent from "./CarouselMoneyComponent";
import FormCajaComponent from "./FormCajaComponent";
import { Box, Button } from "@mui/material";

function DashboardCajaComponent({ caja, refetch }) {
  const [editingEnabled, setEditingEnabled] = useState(false);
  const [isCajaOpen, setIsCajaOpen] = useState(false);
  const [cajaState, setCajaState] = useState({
    isCajaVacia: false,
    isCajaSinCerrar: false,
    isCajaCerrada: false,
  });

  useEffect(() => {
    if (!caja?.caja?.id_caja) {
      setCajaState({
        isCajaVacia: true,
        isCajaSinCerrar: false,
        isCajaCerrada: false,
      });
    } else if (caja?.caja?.fecha_cierre === null) {
      setCajaState({
        isCajaVacia: false,
        isCajaSinCerrar: true,
        isCajaCerrada: false,
      });
    } else {
      setCajaState({
        isCajaVacia: false,
        isCajaSinCerrar: false,
        isCajaCerrada: true,
      });
    }
  }, [caja]);

  const handleOpenCaja = () => {
    setIsCajaOpen(true);
    setEditingEnabled(true);
  };

  return (
    <>
      <h2 style={{ textAlign: "center", fontSize: "2rem" }}>Caja</h2>
      {cajaState.isCajaVacia || cajaState.isCajaCerrada ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <Button variant="contained" onClick={handleOpenCaja}>
            Abrir caja
          </Button>
        </Box>
      ) : null}
      <CarouselMoneyComponent
        caja={caja}
        refetch={refetch}
        editingEnabled={editingEnabled}
        setEditingEnabled={setEditingEnabled}
        cajaState={cajaState}
      />
    </>
  );
}

export default DashboardCajaComponent;
