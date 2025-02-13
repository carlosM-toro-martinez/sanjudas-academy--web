import React, { useState } from "react";
import { Autocomplete, TextField, FormControl } from "@mui/material";

const ProductoAutocompleteComponent = ({
  productosUnicosFiltrados,
  handleProductoChange,
  setCantidad,
  setCantidadPorUnidad,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const matchedProduct = productosUnicosFiltrados.find(
        (producto) =>
          producto.codigo_barra &&
          producto.codigo_barra.toLowerCase() === inputValue.toLowerCase()
      );

      if (matchedProduct) {
        handleProductoChange(matchedProduct.id_producto, matchedProduct);
        setCantidad();
        setCantidadPorUnidad();
        setInputValue("");
        setSelectedValue(null);
      }
    }
  };

  return (
    <FormControl fullWidth>
      <Autocomplete
        options={productosUnicosFiltrados || []}
        getOptionLabel={(producto) => producto.nombre || ""}
        value={selectedValue}
        onChange={(event, newValue) => {
          if (newValue) {
            handleProductoChange(newValue.id_producto, newValue);
            setCantidad();
            setCantidadPorUnidad();
          }
          setInputValue("");
          setSelectedValue(null);
        }}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        isOptionEqualToValue={(option, value) =>
          option?.id_producto === value?.id_producto
        }
        filterOptions={(options, { inputValue }) =>
          options.filter(
            (option) =>
              option.nombre.toLowerCase().includes(inputValue.toLowerCase()) ||
              option.codigo_barra
                ?.toLowerCase()
                .includes(inputValue.toLowerCase())
          )
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Producto"
            onKeyDown={handleKeyDown} // Agregar el manejador de teclado aquí
          />
        )}
      />
    </FormControl>
  );
};

export default ProductoAutocompleteComponent;
