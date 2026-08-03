import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { FormProvider } from "./context/FormContext";
import LandingPage from "./pages/LandingPage";

import OrganizationDetails from "./pages/OrganizationDetails";
import ApplicationDetails from "./pages/ApplicationDetails";
import MainDetails from "./pages/MainDetails";
import CertificateDetails from "./pages/CertificateDetails";
import InfraDetails from "./pages/InfraDetails";
import HardwareDetails from "./pages/HardwareDetails";
import SslDetails from "./pages/SslDetails";
import Checklist from "./pages/Checklist";
import SsoSuccess from "./pages/SsoSuccess";
import SsoFailed from "./pages/SsoFailed";
import Mapping from "./pages/Mapping";
import SsoPending from "./pages/SsoPending";
import SsoNotActive from "./pages/SsoNotActive";

function App() {
  return (
    <FormProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/organization" element={<OrganizationDetails />} />
          <Route path="/ApplicationDetails" element={<ApplicationDetails />} />
          <Route path="/maindetails" element={<MainDetails />} />
          <Route path="/certificatedetails" element={<CertificateDetails />} />
          <Route path="/infradetails" element={<InfraDetails />} />
          <Route path="/hardwaredetails" element={<HardwareDetails />} />
          <Route path="/ssldetails" element={<SslDetails />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/sso/success" element={<SsoSuccess />} />
          <Route path="/sso/failed" element={<SsoFailed />} />
          <Route path="/sso/mapping" element={<Mapping />} />
          <Route path="/sso/pending" element={<SsoPending />} />
          <Route path="/sso/not-active" element={<SsoNotActive />} />
        </Routes>
      </BrowserRouter>
    </FormProvider>
  );
}

export default App;