import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const docenteService = async (payload) => {
  return await post(`${buildApiUri()}/v1/docentes`, payload);
};
export default docenteService;
