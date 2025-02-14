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
import estudianteCarreraService from "../../../async/services/get/estudianteCarreraService.js";
import reportEstudiantesService from "../../../async/services/get/reportEstudiantesService.js";
import TableEstudiantesReport from "./TableEstudiantesReport";

function ReportEstudiantesComponent() {
  const [idInicio, setIdInicio] = useState(null);
  const [idFinal, setIdFinal] = useState(null);
  const [fechasAgrupadas, setFechasAgrupadas] = useState([]);

  const { data: estudiantes, isLoading: isLoadingEstudiantes } = useQuery(
    "estudiantes",
    estudianteCarreraService
  );
  console.log(reportEstudiantesService);

  const {
    data: reportData,
    refetch: fetchReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useQuery(
    ["reporteEstudiantes", idInicio, idFinal],
    () => reportEstudiantesService(idInicio, idFinal),
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

  useEffect(() => {
    if (estudiantes) {
      const agrupadosPorFecha = estudiantes.reduce((acc, estudiante) => {
        const fechaRegistro = new Date(
          estudiante.fecha_inscripcion
        ).toLocaleDateString();
        if (!acc[fechaRegistro]) {
          acc[fechaRegistro] = {
            fecha: fechaRegistro,
            primerosId: estudiante.id_estudiante_carrera,
            ultimosId: estudiante.id_estudiante_carrera,
          };
        } else {
          acc[fechaRegistro].ultimosId = estudiante.id_estudiante_carrera;
        }
        return acc;
      }, {});

      const fechasTratadas = Object.values(agrupadosPorFecha);

      setFechasAgrupadas(fechasTratadas);
    }
  }, [estudiantes]);

  return (
    <DrawerComponent>
      {!isLoadingEstudiantes ? (
        <Box>
          <Typography
            component={"h2"}
            style={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              margin: "1rem 0 0 0",
            }}
          >
            Reporte de Estudiantes
          </Typography>
          <Box
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
                Fecha de Registro Inicio
              </InputLabel>
              <Select
                label="Fecha de Registro Inicio"
                labelId="select-inicio-label"
                value={idInicio}
                onChange={handleInicioChange}
              >
                {fechasAgrupadas?.map((fecha) => (
                  <MenuItem key={fecha.fecha} value={fecha.primerosId}>
                    {fecha.fecha}
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
              <InputLabel id="select-final-label">
                Fecha de Registro Final
              </InputLabel>
              <Select
                label="Fecha de Registro Final"
                labelId="select-final-label"
                value={idFinal}
                onChange={handleFinalChange}
              >
                {fechasAgrupadas?.map((fecha) => (
                  <MenuItem key={fecha.fecha} value={fecha.ultimosId}>
                    {fecha.fecha}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {isLoadingReport ? (
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            reportData && <TableEstudiantesReport reportData={reportData} />
          )}
        </Box>
      ) : (
        <Box>Cargando estudiantes...</Box>
      )}
    </DrawerComponent>
  );
}

export default ReportEstudiantesComponent;
