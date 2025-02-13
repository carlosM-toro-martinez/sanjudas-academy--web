import React from "react";
import { Box, Button, Typography } from "@mui/material";
import FormEstudianteCarreraComponent from "../../../components/FormEstudianteCarreraComponent";
import FormInscripcionMateriaComponent from "../../../components/FormInscripcionMateriaComponent";
import DrawerComponent from "../../../components/DrawerComponent";

function Inscripciones() {
  return (
    <DrawerComponent>
      <Box style={{ marginTop: "2rem" }}>
        <FormEstudianteCarreraComponent />
        <FormInscripcionMateriaComponent />
      </Box>
    </DrawerComponent>
  );
}

export default Inscripciones;
