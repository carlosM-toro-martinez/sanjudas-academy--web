import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const ambientaAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/ambiente`, payload);
};
export default ambientaAddService;
