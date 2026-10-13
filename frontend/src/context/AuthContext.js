import { createContext, useContext, useEffect, useState } from "react";
import api from "./api"; // tumhara axios instance

const AuthContext = createContext({ loading: true, access: null, isOic: false });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ loading: true, access: null, isOic: false, error: false });

  useEffect(() => {
    api.get("/api/sso/2/user-details")
      .then((r) => setState({ loading: false, access: r.data.access, isOic: !!r.data.isOic, error: false }))
      .catch(() => setState({ loading: false, access: null, isOic: false, error: true }));
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}