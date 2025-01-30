import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const estudiantesAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/estudiantes`, payload);
};
export default estudiantesAddService;
