import { createContext, useContext, useEffect, useState } from "react";
import { apiPost } from "../api";


const DUMMY_USER = {
  sso_id: "DUMMY-SSO-0001",
  full_name: "Test User",
  email: "dummy.user@example.com",
  phone: "9999999999",
  designation: "Tester",
 
};

const STORAGE_KEY = "bsdc_form_ids";

function loadIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const FormContext = createContext(null);

export function FormProvider({ children }) {
  const [ids, setIds] = useState(loadIds);
  const [userReady, setUserReady] = useState(false);


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  
  useEffect(() => {
    async function ensureDummyUser() {
      if (ids.userId) {
        setUserReady(true);
        return;
      }
      try {
        const res = await apiPost("/users", DUMMY_USER);
        setIds((prev) => ({ ...prev, userId: res.id }));
      } catch (err) {
        console.error("Could not create/fetch dummy user:", err);
      } finally {
        setUserReady(true);
      }
    }
    ensureDummyUser();
   
  }, []);

  function setId(key, value) {
    setIds((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm() {
    localStorage.removeItem(STORAGE_KEY);
    setIds({});
  }

  return (
    <FormContext.Provider value={{ ids, setId, userReady, resetForm }}>
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error("useFormContext must be used inside <FormProvider>");
  return ctx;
}
