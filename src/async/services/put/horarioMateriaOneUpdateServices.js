import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const horarioMateriaOneUpdateServices = async (idHorarioMateria, payload) => {
  return await put(`${buildApiUri()}/v1/materias/${idHorarioMateria}`, payload);
};
export default horarioMateriaOneUpdateServices;
