import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { FormProvider } from "./context/FormContext";
import LandingPage from "./pages/LandingPage";

import OrganizationDetails from "./pages/OrganizationDetails";
import ApplicationDetails from "./pages/ApplicationDetails";
import MainDetails from "./pages/MainDetails";
import CertificateDetails from "./pages/CertificateDetails";
import StagingDetails from "./pages/StagingDetails";
import ProductionDetails from "./pages/ProductionDetails";
import InfraOtherDetails from "./pages/InfraOtherDetails";
import HardwareDetails from "./pages/HardwareDetails";
import SslDetails from "./pages/SslDetails";
import Checklist from "./pages/Checklist";
import PreviewDetails from "./pages/PreviewDetails";

function App() {
  return (
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/organization" element={<OrganizationDetails />} />
          <Route path="/applicationdetails" element={<ApplicationDetails />} />
          <Route path="/maindetails" element={<MainDetails />} />
          <Route path="/certificatedetails" element={<CertificateDetails />} />
          <Route path="/stagingdetails" element={<StagingDetails />} />
          <Route path="/productiondetails" element={<ProductionDetails />} />
          <Route path="/infraotherdetails" element={<InfraOtherDetails />} />
          <Route path="/hardwaredetails" element={<HardwareDetails />} />
          <Route path="/ssldetails" element={<SslDetails />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/previewdetails" element={<PreviewDetails />} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  );
}

export default App;