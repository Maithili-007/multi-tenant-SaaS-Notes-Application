import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser, validateToken } from "../services/api.js";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuthStatus(); }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token && await validateToken()) {
        const savedUser = localStorage.getItem("user");
        const savedTenant = localStorage.getItem("tenant");
        if (savedUser && savedTenant) {
          setUser(JSON.parse(savedUser));
          setTenant(JSON.parse(savedTenant));
        }
      } else {
        localStorage.clear();
      }
    } catch {
      localStorage.clear();
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    setLoading(true);
    const response = await loginUser(email, password);
    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));
    localStorage.setItem("tenant", JSON.stringify(response.tenant));
    setUser(response.user);
    setTenant(response.tenant);
    setLoading(false);
    return response;
  };

  const logout = () => {
    setUser(null);
    setTenant(null);
    localStorage.clear();
  };

  const updateTenant = (updated) => {
    setTenant(updated);
    localStorage.setItem("tenant", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, tenant, loading, login, logout, updateTenant }}>
      {children}
    </AuthContext.Provider>
  );
}
