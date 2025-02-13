import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const estudianteCarreraService = async () => {
  return await get(`${buildApiUri()}/v1/estudianteCarrera`);
};
export default estudianteCarreraService;
