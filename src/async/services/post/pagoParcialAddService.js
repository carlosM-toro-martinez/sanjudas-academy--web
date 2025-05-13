import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const pagoParcialAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/pagoMensualidad/pagoParcial`, payload);
};

export default pagoParcialAddService;
