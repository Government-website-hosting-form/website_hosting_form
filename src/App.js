import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

      </Routes>

    </BrowserRouter>
  );
}

export default App;