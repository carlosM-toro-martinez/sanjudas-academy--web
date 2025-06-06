import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportAlmacenesService = async (idInicio, idFinal) => {
  console.log(
    `${buildApiUri()}/v1/reportes/almacenes/movimientos/${idInicio}/${idFinal}`
  );

  return await get(
    `${buildApiUri()}/v1/reportes/almacenes/movimientos/${idInicio}/${idFinal}`
  );
};
export default reportAlmacenesService;
