import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const horariosGetService = async () => {
  return await get(`${buildApiUri()}/v1/horarios`);
};
export default horariosGetService;
