import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Ventas from "./pages/Ventas";
import MovimientoCaja from "./pages/MovimientoCaja";
import Reportes from "./pages/Reportes";
import Almacenes from "./pages/Almacenes";
import Perfil from "./pages/Perfil";
import Trabajadores from "./pages/Trabajadores";
import Clientes from "./pages/Clientes";
import { QueryClient, QueryClientProvider } from "react-query";
import CreateAlmacenes from "./pages/Almacenes/CreateAlmacenes";
import MainContextProvider from "./context/MainContextProvider";
import CreateVenta from "./pages/Ventas/CreateVenta";
import CreateTrabajadores from "./pages/Trabajadores/CreateTrabajadores";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginComponent from "./components/LoginCompononent";
import LoginAdministradorComponent from "./components/LoginAdministradorComponent";
import ReportAlmacenesComponent from "./components/DashboardReporteComponent/ReportAlmacenesComponent";
import ReportCajaComponent from "./components/DashboardReporteComponent/ReportCajaComponent";
import ReportVentasComponent from "./components/DashboardReporteComponent/ReportVentasComponent";
import ReportClientesComponent from "./components/DashboardReporteComponent/ReportClientesComponent";
import MovimientoInventario from "./pages/MovimientoInventario";
import CreateMovementInventario from "./pages/MovimientoInventario/CreateMovementInventario";
import Academia from "./pages/Academia";
import Materias from "./pages/Academia/Materias";
import Docentes from "./pages/Academia/Docentes";
import Estudiantes from "./pages/Academia/Estudiantes";
import Theme from "./theme/Theme";
import Carreras from "./pages/Academia/Carreras";
import Ambientes from "./pages/Academia/Ambientes";
import Inscripciones from "./pages/Academia/Inscripciones";
import EstudiantesCarreras from "./pages/Academia/EstudiantesCarreras";

function App() {
  const queryClient = new QueryClient();

  return (
    <Theme>
      <QueryClientProvider client={queryClient}>
        <MainContextProvider>
          <Router>
            <Routes>
              <Route
                element={<ProtectedRoute allowedPermissions={["reportes"]} />}
              >
                <Route path="/reportes">
                  <Route path="" element={<Reportes />} />
                  <Route
                    path="almacen"
                    element={<ReportAlmacenesComponent />}
                  />
                  <Route path="caja" element={<ReportCajaComponent />} />
                  <Route path="venta" element={<ReportVentasComponent />} />
                  <Route path="cliente" element={<ReportClientesComponent />} />
                </Route>
              </Route>

              <Route
                element={
                  <ProtectedRoute allowedPermissions={["gestion de compras"]} />
                }
              >
                <Route path="/almacenes/crear" element={<CreateAlmacenes />} />
              </Route>

              <Route
                element={<ProtectedRoute allowedPermissions={["inventario"]} />}
              >
                <Route path="/almacenes" element={<Almacenes />} />
                <Route path="/movimiento-inventario">
                  <Route path="" element={<MovimientoInventario />} />
                  <Route path="crear" element={<CreateMovementInventario />} />
                </Route>
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    allowedPermissions={["gestionar trabajadores"]}
                  />
                }
              >
                <Route path="/trabajadores">
                  <Route path="" element={<Trabajadores />} />
                  <Route path="crear" element={<CreateTrabajadores />} />
                </Route>
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    allowedPermissions={["movimientos de caja"]}
                  />
                }
              >
                <Route path="/movimiento-caja" element={<MovimientoCaja />} />
              </Route>
              <Route
                element={
                  <ProtectedRoute
                    allowedPermissions={["movimientos de caja"]}
                  />
                }
              >
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/clientes" element={<Clientes />} />
              </Route>
              <Route path="/ventas">
                <Route path="" element={<Ventas />} />
                <Route path="crear" element={<CreateVenta />} />
              </Route>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route
                path="/login/admin/superadmin"
                element={<LoginAdministradorComponent />}
              />
              <Route path="/instituto">
                <Route path="" element={<Academia />} />
                <Route path="docentes" element={<Docentes />} />
                <Route path="materias" element={<Materias />} />
                <Route path="estudiantes" element={<Estudiantes />} />
                <Route path="carreras" element={<Carreras />} />
                <Route path="ambientes" element={<Ambientes />} />
                <Route path="inscripciones" element={<Inscripciones />} />
                <Route
                  path="estudiantes-carreras"
                  element={<EstudiantesCarreras />}
                />
              </Route>
            </Routes>
          </Router>
        </MainContextProvider>
      </QueryClientProvider>
    </Theme>
  );
}

export default App;
