import React, { useState } from "react";
import { Box, Button, Dialog } from "@mui/material";
import DrawerComponent from "../../../components/DrawerComponent";
import pagoMensualidadGetService from "../../../async/services/get/pagoMensualidadGetService.js";
import { useQuery } from "react-query";
import TableEstudiantesMensualidadComponent from "../../../components/TableEstudiantesMensualidadComponent";
import AddIcon from "@mui/icons-material/Add";
import FormMensualidadModulo from "../../../components/FormMensualidadModulo/index.jsx";

function Inscripciones() {
  const {
    data: pagoMensualidad,
    isLoading: isLoadingCarreras,
    refetch: refetchMensualidades,
  } = useQuery("pagoMensualidad", pagoMensualidadGetService);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => setOpenDialog(false);

  return (
    <DrawerComponent>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        sx={{ "& .MuiDialog-paper": { width: "50%", padding: "1rem" } }}
      >
        <FormMensualidadModulo
          refetchMensualidades={refetchMensualidades}
          handleClose={handleCloseDialog}
        />
      </Dialog>

      <Box style={{ marginTop: "2rem" }}>
        {!isLoadingCarreras ? (
          <TableEstudiantesMensualidadComponent
            estudiantes={pagoMensualidad}
            refetchMensualidades={refetchMensualidades}
          />
        ) : null}
      </Box>

      <Box
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {/* <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          style={{ width: "15rem" }}
        >
          Añadir Modulo
        </Button> */}
      </Box>
    </DrawerComponent>
  );
}

export default Inscripciones;
