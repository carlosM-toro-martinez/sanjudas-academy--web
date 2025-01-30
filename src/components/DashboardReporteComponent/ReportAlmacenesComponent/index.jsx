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
import movimientoInventariosService from "../../../async/services/get/movimientoInventariosService.js";
import reportAlmacenesService from "../../../async/services/get/reportAlmacenesService.js";
import TableAlmacenesReport from "./TableAlmacenesReport";

function ReportAlmacenesComponent() {
  const [idInicio, setIdInicio] = useState(null);
  const [idFinal, setIdFinal] = useState(null);

  const { data: movimientos, isLoading: isLoadingMovimientos } = useQuery(
    "movimientos",
    movimientoInventariosService
  );

  const {
    data: reportData,
    refetch: fetchReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useQuery(
    ["reporteAlmacenes", idInicio, idFinal],
    () => reportAlmacenesService(idInicio, idFinal),
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
      {!isLoadingMovimientos ? (
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
            Reporte de inventario
          </Typography>
          {!isLoadingMovimientos ? (
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
                  {movimientos?.map((movimiento) => (
                    <MenuItem
                      key={movimiento.id_movimiento}
                      value={movimiento.id_movimiento}
                    >
                      {new Date(
                        movimiento.fecha_movimiento
                      ).toLocaleDateString()}
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
                  {movimientos?.map((movimiento) => (
                    <MenuItem
                      key={movimiento.id_movimiento}
                      value={movimiento.id_movimiento}
                    >
                      {new Date(
                        movimiento.fecha_movimiento
                      ).toLocaleDateString()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          ) : (
            <div>Cargando movimientos...</div>
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
            reportData && <TableAlmacenesReport reportData={reportData} />
          )}
        </div>
      ) : (
        <div>Cargando movimientos...</div>
      )}
    </DrawerComponent>
  );
}

export default ReportAlmacenesComponent;
