import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import DrawerComponent from "../../DrawerComponent";
import pagoModulesGetService from "../../../async/services/get/pagoModulesGetService.js";
import pagoForModuleGetService from "../../../async/services/get/pagoForModuleGetService.js";
import TablePagoMensualidad from "./TablePagoMensualidad/index.jsx";

function ReportPagoMensualidad() {
  // Estado para módulo seleccionado
  const [selectedModule, setSelectedModule] = useState("");

  // 1) Obtener todos los módulos disponibles
  const {
    data: modules,
    isLoading: isLoadingModules,
    error: modulesError,
  } = useQuery("pagoModules", pagoModulesGetService);

  // 2) Obtener pagos para el módulo seleccionado
  const {
    data: pagos,
    refetch: fetchPagos,
    isLoading: isLoadingPagos,
    error: pagosError,
  } = useQuery(
    ["pagosModule", selectedModule],
    () => pagoForModuleGetService(selectedModule),
    { enabled: false }
  );

  const handleModuleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  const handleFetch = () => {
    if (selectedModule) fetchPagos();
  };

  return (
    <DrawerComponent>
      <Box sx={{ p: 3 }}>
        <Typography
          component="h2"
          sx={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            mb: 4,
          }}
        >
          Reporte de Pagos por Módulo
        </Typography>

        {/* Selector de módulos */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4, mb: 4 }}>
          {isLoadingModules ? (
            <CircularProgress />
          ) : modulesError ? (
            <Typography color="error">Error cargando módulos</Typography>
          ) : (
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="select-module-label">Módulo</InputLabel>
              <Select
                labelId="select-module-label"
                label="Módulo"
                value={selectedModule}
                onChange={handleModuleChange}
              >
                {modules.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleFetch}
            disabled={!selectedModule}
          >
            Cargar Pagos
          </Button>
        </Box>

        {/* Tabla de pagos */}
        {isLoadingPagos ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : pagosError ? (
          <Typography color="error">Error cargando pagos</Typography>
        ) : (
          pagos && <TablePagoMensualidad reportData={pagos} />
        )}
      </Box>
    </DrawerComponent>
  );
}

export default ReportPagoMensualidad;
