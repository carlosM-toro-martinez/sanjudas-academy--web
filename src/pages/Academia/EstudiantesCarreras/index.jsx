import React, { useState } from "react";
import { Box, Button, Dialog, IconButton } from "@mui/material";
import DrawerComponent from "../../../components/DrawerComponent";
import FormEstudianteCarreraComponent from "../../../components/FormEstudianteCarreraComponent";
import estudianteCarreraService from "../../../async/services/get/estudianteCarreraService.js";
import { useQuery } from "react-query";
import TableEstudiantesCarreraComponent from "../../../components/TableEstudiantesCarreraComponent/index.jsx";
import AddIcon from "@mui/icons-material/Add";

function EstudiantesCarreras() {
  const {
    data: estudiantes,
    isLoading: isLoadingEstudiantes,
    refetch: refetchEstudiantes,
  } = useQuery("estudiantesCarrera", estudianteCarreraService);

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
        sx={{
          "& .MuiDialog-paper": {
            width: "90%",
            height: "100%",
            padding: "1rem",
          },
        }}
      >
        <FormEstudianteCarreraComponent
          refetchEstudiantes={refetchEstudiantes}
          handleClose={handleCloseDialog}
        />
      </Dialog>
      <Box
        style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          style={{ width: "15rem" }}
        >
          Añadir Estudiante
        </Button>
      </Box>
      <Box style={{ marginTop: "2rem" }}>
        {!isLoadingEstudiantes ? (
          <TableEstudiantesCarreraComponent
            estudiantes={estudiantes}
            refetchEstudiantes={refetchEstudiantes}
          />
        ) : null}
      </Box>
    </DrawerComponent>
  );
}

export default EstudiantesCarreras;
