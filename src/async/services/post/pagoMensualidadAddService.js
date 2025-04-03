import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const pagoMensualidadAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/pagoMensualidad`, payload);
};

export default pagoMensualidadAddService;
