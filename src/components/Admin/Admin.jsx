import React from "react";
import styles from "./admin.module.css";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AdminContext";
import Swal from "sweetalert2";

const Admin = () => {
  const { user, setUser } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("https://bus-counter-backend-production.up.railway.app/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.target.email.value,
        password: e.target.password.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "User does not exist") {
          Swal.fire({
            title: "Error",
            text: "User does not exist",
            icon: "error",
          });
          console.log(data);
        } else if (data.message === "Incorrect password") {
          Swal.fire({
            title: "Error",
            text: "Incorrect password",
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Login Successful!",
            text: "Welcome back!",
            icon: "success",
          });
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Login Failed!",
          text: "Please check your email and password.",
          icon: "error",
        });
      });
  };
  return (
    <div className={styles.container}>
      <div>
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back Home
        </Link>
        <h3
          style={{
            textAlign: "center",
            margin: "20px 0",
            textTransform: "uppercase",
          }}
        >
          Login to Continue
        </h3>
        <form className={styles.form} onSubmit={handleLogin}>
          <div>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              required
            />
          </div>
          <input type="submit" value="Login" />
        </form>
      </div>
    </div>
  );
};

export default Admin;
