import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";

import OrganizationDetails from "./pages/OrganizationDetails";
import ApplicationDetails from "./pages/ApplicationDetails";
import MainDetails from "./pages/MainDetails";
import CertificateDetails from "./pages/CertificateDetails";
import InfraDetails from "./pages/InfraDetails";
import HardwareDetails from "./pages/HardwareDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/organization" element={<OrganizationDetails />} />
        <Route path="/ApplicationDetails" element={<ApplicationDetails />} />
        <Route path="/maindetails" element={<MainDetails />} />
        <Route path="/certificatedetails" element={<CertificateDetails />} />
        <Route path="/infradetails" element={<InfraDetails />} />
        <Route path="/hardwaredetails" element={<HardwareDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;