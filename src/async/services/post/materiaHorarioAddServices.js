import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const materiaHorarioAddServices = async (payload) => {
  return await post(`${buildApiUri()}/v1/materias`, payload);
};
export default materiaHorarioAddServices;
