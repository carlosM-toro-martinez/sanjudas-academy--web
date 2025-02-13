import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const carreraDeleteService = async (idCarrera) => {
  return await remove(`${buildApiUri()}/v1/carrera/${idCarrera}`);
};
export default carreraDeleteService;
