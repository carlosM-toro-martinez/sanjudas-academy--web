import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const docentesGetService = async () => {
  return await get(`${buildApiUri()}/v1/docentes`);
};
export default docentesGetService;
