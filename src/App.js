import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ApplicationDetails from "./pages/ApplicationDetails";

import LandingPage from "./pages/LandingPage";
import OrganizationDetails from "./pages/OrganizationDetails";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/organization"
          element={<OrganizationDetails />}
        />

        <Route
          path="/application"
          element={<ApplicationDetails />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;