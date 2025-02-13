import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const ambienteService = async () => {
  return await get(`${buildApiUri()}/v1/ambiente`);
};
export default ambienteService;
