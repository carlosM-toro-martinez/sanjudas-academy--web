import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const pagoMensualidadGetService = async () => {
  return await get(`${buildApiUri()}/v1/pagoMensualidad`);
};

export default pagoMensualidadGetService;
