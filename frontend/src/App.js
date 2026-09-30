import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { FormProvider } from "./context/FormContext";
import AuthGate from "./components/AuthGate";

function App() {
  return (
    <FormProvider>
      <BrowserRouter>
        <AuthGate />
      </BrowserRouter>
    </FormProvider>
  );
}

export default App;