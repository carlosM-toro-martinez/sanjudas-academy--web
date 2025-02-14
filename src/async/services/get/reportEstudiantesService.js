import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportEstudiantesService = async (dateInicio, dateFinal) => {
  return await get(
    `${buildApiUri()}/v1/reportes/estudiantes/${dateInicio}/${dateFinal}`
  );
};
export default reportEstudiantesService;
