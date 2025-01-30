import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const materiasService = async () => {
  return await get(`${buildApiUri()}/v1/materias`);
};
export default materiasService;
