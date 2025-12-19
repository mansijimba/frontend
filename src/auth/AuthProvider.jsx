import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login: attach token to user object
  const login = (userData, token) => {
    setLoading(true);
    const newUser = { ...userData, token }; // attach token
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  // Logout
  const logout = () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
  };

  // On app load, retrieve user and token from localStorage
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({ ...parsedUser, token }); // attach token
    } else {
      logout();
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated: user !== null }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
