import { createContext, useContext, useEffect, useState } from "react";

// ============================================================
// AuthContext
// Decodes the JWT stored in localStorage to expose the
// doctor's name and role throughout the application without
// prop-drilling or repeated localStorage reads.
// ============================================================

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJwt(token);
      if (decoded) {
        setUser({
          doctorId: decoded.sub,
          doctorName: decoded.doctor_name || "Doctor",
          role: decoded.role || "doctor",
        });
      }
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = decodeJwt(token);
    if (decoded) {
      setUser({
        doctorId: decoded.sub,
        doctorName: decoded.doctor_name || "Doctor",
        role: decoded.role || "doctor",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
