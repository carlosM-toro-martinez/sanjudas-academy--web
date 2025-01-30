import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
} from "@mui/material";
import DrawerComponent from "../../DrawerComponent";
import ventasService from "../../../async/services/get/ventasService.js";
import reportVentasService from "../../../async/services/get/reportVentasService.js";
import TableVentasReport from "./TableVentasReport";

function ReportVentasComponent() {
  const [idInicio, setIdInicio] = useState(null);
  const [idFinal, setIdFinal] = useState(null);

  const { data: ventas, isLoading: isLoadingVentas } = useQuery(
    "ventas",
    ventasService
  );

  const {
    data: reportData,
    refetch: fetchReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useQuery(
    ["reporteVentas", idInicio, idFinal],
    () => reportVentasService(idInicio, idFinal),
    {
      enabled: false,
    }
  );

  const handleInicioChange = (event) => {
    setIdInicio(event.target.value);
  };

  const handleFinalChange = (event) => {
    setIdFinal(event.target.value);
  };

  const handleGenerateReport = () => {
    if (idInicio && idFinal) {
      fetchReport();
    }
  };

  return (
    <DrawerComponent>
      {!isLoadingVentas ? (
        <div>
          <Typography
            component={"h2"}
            style={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "1rem 0 0 0",
            }}
          >
            Reporte de ventas
          </Typography>
          {!isLoadingVentas ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "5rem",
                alignItems: "center",
                marginTop: "3rem",
              }}
            >
              <FormControl style={{ width: "15rem" }}>
                <InputLabel id="select-inicio-label">
                  Fecha de Inicio
                </InputLabel>
                <Select
                  label="Fecha de Inicio"
                  labelId="select-inicio-label"
                  value={idInicio}
                  onChange={handleInicioChange}
                >
                  {ventas?.map((venta) => (
                    <MenuItem key={venta.id_venta} value={venta.id_venta}>
                      {new Date(venta.fecha_venta).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                disabled={!idInicio || !idFinal}
              >
                Generar Reporte
              </Button>

              <FormControl style={{ width: "15rem" }}>
                <InputLabel id="select-final-label">Fecha Final</InputLabel>
                <Select
                  label="Fecha Final"
                  labelId="select-final-label"
                  value={idFinal}
                  onChange={handleFinalChange}
                >
                  {ventas?.map((venta) => (
                    <MenuItem key={venta.id_venta} value={venta.id_venta}>
                      {new Date(venta.fecha_venta).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : (
            <div>Cargando ventas...</div>
          )}

          {isLoadingReport ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            reportData && <TableVentasReport reportData={reportData} />
          )}
        </div>
      ) : (
        <div>Cargando ventas...</div>
      )}
    </DrawerComponent>
  );
}

export default ReportVentasComponent;
