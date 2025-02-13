import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const materiaCarreraAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/materiaCarrera`, payload);
};
export default materiaCarreraAddService;
