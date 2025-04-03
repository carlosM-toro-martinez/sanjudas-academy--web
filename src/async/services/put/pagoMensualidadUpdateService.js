import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const pagoMensualidadUpdateService = async (id, payload) => {
  return await put(`${buildApiUri()}/v1/pagoMensualidad/${id}`, payload);
};

export default pagoMensualidadUpdateService;
