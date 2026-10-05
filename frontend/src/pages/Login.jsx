import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";

import appLogo from "../assets/logo/app_logo.png";
import realDoctor from "../assets/login-scenes/real_doctor.png";
import loginBackground from "../assets/login-scenes/login-background.png";

import {
  loginUser,
  registerDoctor,
} from "../services/authService";


function Login() {
  const navigate = useNavigate();

  // ============================================================
  // LOGIN CARD REF
  // Used to make doctor height equal to login card height
  // ============================================================

  const loginCardRef = useRef(null);


  // ============================================================
  // LOGIN / REGISTER MODE
  // ============================================================

  const [isRegister, setIsRegister] = useState(false);


  // ============================================================
  // FORM STATES
  // ============================================================

  const [doctorId, setDoctorId] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  // ============================================================
  // DYNAMIC DOCTOR HEIGHT
  //
  // Doctor height always follows the real login card height.
  //
  // Works when:
  // Login -> Register
  // Register -> Login
  // Browser resize
  // Different laptop / desktop resolutions
  // ============================================================

  useEffect(() => {
    const card = loginCardRef.current;

    if (!card) {
      return;
    }

    const updateDoctorHeight = () => {
      const cardHeight = card.getBoundingClientRect().height;

      document.documentElement.style.setProperty(
        "--login-card-height",
        `${cardHeight}px`
      );
    };

    // Initial measurement
    updateDoctorHeight();

    // Watch login card size changes
    const observer = new ResizeObserver(() => {
      updateDoctorHeight();
    });

    observer.observe(card);

    // Also update after window resize
    window.addEventListener("resize", updateDoctorHeight);

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        updateDoctorHeight
      );

      document.documentElement.style.removeProperty(
        "--login-card-height"
      );
    };
  }, []);


  // ============================================================
  // LOGIN
  // ============================================================

  const handleLogin = async () => {
    if (!doctorId || !password) {
      alert("Please enter Doctor ID and Password");
      return;
    }

    if (!/^\d{4}$/.test(doctorId)) {
      alert("Doctor ID must be a 4-digit number");
      return;
    }

    try {
      const data = await loginUser(
        Number(doctorId),
        password
      );

      // ========================================================
      // JWT TOKEN
      // ========================================================

      localStorage.setItem(
        "token",
        data.access_token
      );


      // ========================================================
      // DOCTOR ID
      // ========================================================

      localStorage.setItem(
        "doctor_id",
        doctorId
      );


      // ========================================================
      // DECODE JWT
      // ========================================================

      const tokenPayload = JSON.parse(
        atob(
          data.access_token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/")
        )
      );


      // ========================================================
      // DOCTOR NAME
      // ========================================================

      localStorage.setItem(
        "doctor_name",
        tokenPayload.doctor_name || "Doctor"
      );


      alert("Login Successful!");


      // ========================================================
      // DASHBOARD
      // ========================================================

      navigate("/dashboard");

    } catch (error) {
      console.error("Login Error:", error);

      const detail =
        error?.response?.data?.detail;

      if (typeof detail === "string") {
        alert(detail);
      } else if (Array.isArray(detail)) {
        alert(
          detail
            .map(
              (item) =>
                item?.msg || "Invalid input"
            )
            .join("\n")
        );
      } else if (
        typeof error?.response?.data === "string"
      ) {
        alert(error.response.data);
      } else if (error?.message) {
        alert(error.message);
      } else {
        alert(
          "Login failed. Please check your credentials."
        );
      }
    }
  };


  // ============================================================
  // REGISTER
  // ============================================================

  const handleRegister = async () => {
    if (
      !doctorId ||
      !doctorName ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill all fields");
      return;
    }


    if (!/^\d{4}$/.test(doctorId)) {
      alert("Doctor ID must be a 4-digit number");
      return;
    }


    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }


    if (password.length < 6) {
      alert(
        "Password must contain at least 6 characters"
      );
      return;
    }


    try {
      const data = await registerDoctor(
        Number(doctorId),
        doctorName,
        password
      );


      alert(
        `Registration Successful!\n\nDoctor ID: ${data.doctor_id}\nDoctor Name: ${data.doctor_name}`
      );


      // ========================================================
      // CLEAR FORM
      // ========================================================

      setDoctorId("");
      setDoctorName("");
      setPassword("");
      setConfirmPassword("");


      // ========================================================
      // GO BACK TO LOGIN
      // ========================================================

      setIsRegister(false);

    } catch (error) {
      console.error("Registration Error:", error);

      const detail =
        error?.response?.data?.detail;

      if (typeof detail === "string") {
        alert(detail);
      } else if (Array.isArray(detail)) {
        alert(
          detail
            .map(
              (item) =>
                item?.msg || "Invalid input"
            )
            .join("\n")
        );
      } else if (
        typeof error?.response?.data === "string"
      ) {
        alert(error.response.data);
      } else if (error?.message) {
        alert(error.message);
      } else {
        alert(
          "Registration failed. Please try again."
        );
      }
    }
  };


  // ============================================================
  // SWITCH LOGIN / REGISTER
  // ============================================================

  const switchMode = () => {
    setIsRegister(!isRegister);

    setDoctorId("");
    setDoctorName("");
    setPassword("");
    setConfirmPassword("");
  };


  // ============================================================
  // UI
  // ============================================================

  return (
    <main className="login-page">


      {/* ======================================================
          FIXED HOSPITAL BACKGROUND
          ====================================================== */}

      <div
        className="login-background"
        style={{
          backgroundImage: `url(${loginBackground})`,
        }}
      />


      {/* ======================================================
          LEFT SIDE KARUNYA LOGO
          ====================================================== */}

      <section className="brand-section">

        <img
          src={appLogo}
          alt="Karunya Hospitals"
          className="karunya-logo"
        />


        <div className="brand-title">

          <span>
            AMR Clinical
          </span>

          <strong>
            Recommendation
          </strong>

          <span>
            Support System
          </span>

        </div>

      </section>


      {/* ======================================================
          CENTER LOGIN / REGISTER CARD
          ====================================================== */}

      <section className="login-wrapper">

        <div
          ref={loginCardRef}
          className="login-card"
        >


          {/* ==================================================
              LOGIN CARD LOGO
              ================================================== */}

          <img
            src={appLogo}
            alt="Karunya Hospitals"
            className="card-logo"
          />


          {/* ==================================================
              TITLE
              ================================================== */}

          <h1>
            {isRegister
              ? "Doctor Registration"
              : "Doctor Login"}
          </h1>


          {/* ==================================================
              SUBTITLE
              ================================================== */}

          <p className="login-subtitle">
            {isRegister
              ? "Create your secure doctor account"
              : "Access your clinical workspace"}
          </p>


          {/* ==================================================
              DOCTOR ID
              ================================================== */}

          <div className="field">

            <label>
              Doctor ID
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="e.g. 2767"
              value={doctorId}
              onChange={(e) => {
                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setDoctorId(value);
              }}
            />

          </div>


          {/* ==================================================
              DOCTOR NAME
              Only registration
              ================================================== */}

          {isRegister && (
            <div className="field">

              <label>
                Doctor Name
              </label>

              <input
                type="text"
                placeholder="Enter doctor name"
                value={doctorName}
                onChange={(e) =>
                  setDoctorName(
                    e.target.value
                  )
                }
              />

            </div>
          )}


          {/* ==================================================
              PASSWORD
              ================================================== */}

          <div className="field">

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
            />

          </div>


          {/* ==================================================
              CONFIRM PASSWORD
              Only registration
              ================================================== */}

          {isRegister && (
            <div className="field">

              <label>
                Confirm Password
              </label>

              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
              />

            </div>
          )}


          {/* ==================================================
              LOGIN / REGISTER BUTTON
              ================================================== */}

          <button
            type="button"
            className="login-button"
            onClick={
              isRegister
                ? handleRegister
                : handleLogin
            }
          >

            <span>
              {isRegister
                ? "Register"
                : "Login"}
            </span>

            <span className="button-arrow">
              →
            </span>

          </button>


          {/* ==================================================
              LOGIN / REGISTER SWITCH
              ================================================== */}

          <div className="register-switch">

            <span>
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              onClick={switchMode}
            >
              {isRegister
                ? "Login"
                : "Register as Doctor"}
            </button>

          </div>


          {/* ==================================================
              SECURE ACCESS
              ================================================== */}

          <div className="secure-access">

            <span>
              🔒
            </span>

            <span>
              Secure Clinical Access
            </span>

          </div>

        </div>

      </section>


      {/* ======================================================
          RIGHT SIDE DOCTOR
          Doctor height = Login Card height
          ====================================================== */}

      <div className="doctor-section">

        <img
          src={realDoctor}
          alt="Doctor"
          className="real-doctor"
          draggable="false"
        />

      </div>


      {/* ======================================================
          FOOTER
          ====================================================== */}

      <footer className="login-footer">

        <span>
          Karunya Hospitals
        </span>

        <b>
          •
        </b>

        <span>
          AMR Clinical Recommendation Support System
        </span>

      </footer>


    </main>
  );
}


export default Login;