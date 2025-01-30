import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const estudiantesGetService = async () => {
  return await get(`${buildApiUri()}/v1/estudiantes`);
};
export default estudiantesGetService;
