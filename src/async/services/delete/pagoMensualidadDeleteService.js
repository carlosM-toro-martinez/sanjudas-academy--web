import buildApiUri from "../../utils/buildApiUri";
import { remove } from "../../api";

const pagoMensualidadDeleteService = async (id) => {
  return await remove(`${buildApiUri()}/v1/pagoMensualidad/${id}`);
};

export default pagoMensualidadDeleteService;
