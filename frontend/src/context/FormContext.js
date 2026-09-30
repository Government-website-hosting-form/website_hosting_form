import { createContext, useContext, useEffect, useState } from "react";
import { apiGet } from "../api";

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
    async function ensureRealUser() {
      if (ids.userId) {
        setUserReady(true);
        return;
      }

      const ssoId = localStorage.getItem("ssoId");
      if (!ssoId) {
        setUserReady(true);
        return;
      }

      try {
        const res = await apiGet(
          "/api/sso/mapping/me?ssoId=" + encodeURIComponent(ssoId)
        );
        if (res.success && res.user) {
          setIds((prev) => ({ ...prev, userId: res.user.user_id }));
        }
      } catch (err) {
        console.error("Could not fetch logged-in user:", err);
      } finally {
        setUserReady(true);
      }
    }
    ensureRealUser();
  }, []);

  function setId(key, value) {
    setIds((prev) => ({ ...prev, [key]: value }));
  }

  function resetForm(opts = {}) {
    localStorage.removeItem(STORAGE_KEY);
    setIds((prev) =>
      opts.keepUser && prev.userId ? { userId: prev.userId } : {}
    );
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