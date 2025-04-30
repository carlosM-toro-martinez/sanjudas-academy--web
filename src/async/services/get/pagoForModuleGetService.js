import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const pagoForModuleGetService = async (modulo) => {
  return await get(
    `${buildApiUri()}/v1/pagoMensualidad/estudiantePagoModulo/${modulo}`
  );
};

export default pagoForModuleGetService;
