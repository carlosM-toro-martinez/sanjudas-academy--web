import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const carreraAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/carrera`, payload);
};
export default carreraAddService;
