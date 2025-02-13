import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const estudianteCarreraDeleteService = async (estudianteCarrera) => {
  return await remove(
    `${buildApiUri()}/v1/estudianteCarrera/${estudianteCarrera}`
  );
};
export default estudianteCarreraDeleteService;
