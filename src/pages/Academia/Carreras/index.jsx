import React, { useState } from "react";
import { Box, Button, Dialog } from "@mui/material";
import DrawerComponent from "../../../components/DrawerComponent";
import FormCarreraComponent from "../../../components/FormCarreraComponent";
import carreraService from "../../../async/services/get/carreraService.js";
import { useQuery } from "react-query";
import TableCarreraComponent from "../../../components/TableCarreraComponent";
import AddIcon from "@mui/icons-material/Add";

function Carreras() {
  const {
    data: carreras,
    isLoading: isLoadingCarreras,
    refetch: refetchCarreras,
  } = useQuery("carreras", carreraService);

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
        <FormCarreraComponent
          refetchCarreras={refetchCarreras}
          handleClose={handleCloseDialog}
        />
      </Dialog>

      <Box style={{ marginTop: "2rem" }}>
        {!isLoadingCarreras ? (
          <TableCarreraComponent
            carreras={carreras}
            refetchCarreras={refetchCarreras}
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
          Añadir Carrera
        </Button>
      </Box>
    </DrawerComponent>
  );
}

export default Carreras;
