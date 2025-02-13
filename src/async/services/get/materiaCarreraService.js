import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const materiaCarreraService = async () => {
  return await get(`${buildApiUri()}/v1/materiaCarrera`);
};
export default materiaCarreraService;
