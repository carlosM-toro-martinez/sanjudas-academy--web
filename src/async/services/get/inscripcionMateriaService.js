import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const inscripcionMateriaService = async () => {
  return await get(`${buildApiUri()}/v1/inscripcionMateria`);
};
export default inscripcionMateriaService;
