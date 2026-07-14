import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";

import OrganizationDetails from "./pages/OrganizationDetails";
import ApplicationDetails from "./pages/ApplicationDetails";
import MainDetails from "./pages/MainDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/organization" element={<OrganizationDetails />} />
        <Route path="/ApplicationDetails" element={<ApplicationDetails />} />
        <Route path="/maindetails" element={<MainDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;