import React, { createContext, useContext, useEffect } from "react";
import Swal from "sweetalert2";
const Auth = createContext();

export const useAuth = () => useContext(Auth);

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const userStore = localStorage.getItem("user");
    if (userStore) {
      setUser(JSON.parse(userStore));
      setIsAuthenticated(true);
      setLoading(false);
    }
    setLoading(false);
  }, []);
  const logout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "red",
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    }).then((result) => {
      if (result.value) {
        localStorage.removeItem("user");
        setIsAuthenticated(false);
        setUser(null);
        Swal.fire({
          title: "Logged out!",
          text: "You have been logged out",
          icon: "success",
        });
        window.location.href = "/";
      }
    });
  };
  return (
    <Auth.Provider
      value={{
        isAuthenticated,
        user,
        setIsAuthenticated,
        setUser,
        loading,
        setLoading,
        logout,
      }}
    >
      {children}
    </Auth.Provider>
  );
};

export default AuthProvider;
