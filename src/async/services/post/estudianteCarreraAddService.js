import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const estudianteCarreraAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/estudianteCarrera`, payload);
};
export default estudianteCarreraAddService;
