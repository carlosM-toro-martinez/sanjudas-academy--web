import React from "react";
import { TextField, Autocomplete } from "@mui/material";

function DialogDocentesComponent({ docentes, onSelectDocente }) {
  return (
    <Autocomplete
      options={docentes}
      getOptionLabel={(option) => `${option.nombre} ${option.apellido}`}
      onChange={(event, value) =>
        onSelectDocente(value ? value.id_docente : null)
      }
      renderInput={(params) => (
        <TextField {...params} label="Seleccionar Docente" />
      )}
    />
  );
}

export default DialogDocentesComponent;
