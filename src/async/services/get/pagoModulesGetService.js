import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const pagoModulesGetService = async () => {
  return await get(`${buildApiUri()}/v1/pagoMensualidad/modules`);
};

export default pagoModulesGetService;
