import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const inscripcionMateriaAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/inscripcionMateria`, payload);
};
export default inscripcionMateriaAddService;
