import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Patients from "./pages/Patients";
import Login from "./pages/Login";
import PrivateRoute from "./pages/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute children={undefined} />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pacientes" element={<Patients />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;