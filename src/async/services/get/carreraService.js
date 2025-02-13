import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const carreraService = async () => {
  return await get(`${buildApiUri()}/v1/carrera`);
};
export default carreraService;
