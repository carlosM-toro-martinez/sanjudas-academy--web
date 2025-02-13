import React, { useState } from "react";
import { Box, Button, Dialog } from "@mui/material";
import DrawerComponent from "../../../components/DrawerComponent";
import FormAmbienteComponent from "../../../components/FormAmbienteComponent";
import ambienteService from "../../../async/services/get/ambienteService";
import { useQuery } from "react-query";
import TableAmbientesComponent from "../../../components/TableAmbientesComponent";
import AddIcon from "@mui/icons-material/Add";

function Ambientes() {
  const {
    data: ambientes,
    isLoading: isLoadingAmbientes,
    refetch: refetchAmbientes,
  } = useQuery("ambientes", ambienteService);

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
        <FormAmbienteComponent
          refetchAmbientes={refetchAmbientes}
          handleClose={handleCloseDialog}
        />
      </Dialog>

      <Box style={{ marginTop: "2rem" }}>
        {!isLoadingAmbientes ? (
          <TableAmbientesComponent
            ambientes={ambientes}
            refetchAmbientes={refetchAmbientes}
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          style={{ width: "15rem" }}
        >
          Añadir Ambiente
        </Button>
      </Box>
    </DrawerComponent>
  );
}

export default Ambientes;
