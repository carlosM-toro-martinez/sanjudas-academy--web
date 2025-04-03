import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const estudianteCarreraUpdateService = async (data) => {
  return await put(
    `${buildApiUri()}/v1/estudianteCarrera/${data?.id}`,
    data?.payload
  );
};
export default estudianteCarreraUpdateService;
