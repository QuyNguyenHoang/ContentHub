import React, { useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import type { LoginRequestDto } from "../../../api/auth/auth.api";
import { BsEye, BsEyeSlash } from "react-icons/bs";

interface Props {
  handleLogin: (e: React.FormEvent) => void;
  setLoginForm: Dispatch<SetStateAction<LoginRequestDto>>;
  loading: boolean;
  loginForm: LoginRequestDto;
}
export default function LoginForm({
  handleLogin,
  setLoginForm,
  loading,
  loginForm,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-9 col-lg-8 col-xl-7">
            <div className="d-flex shadow rounded-4 overflow-hidden">
              {/* LEFT - LOGIN FORM */}
              <div className="p-4 bg-white flex-fill">
                <h2 className="fw-bold mb-1">Welcome back 👋</h2>

                <p className="text-secondary mb-4">Sign in to ContentHub</p>

                {/* FORM */}
                <form onSubmit={handleLogin}>
                  {/* USERNAME */}
                  <div className="input-group mb-3">
                    <span className="input-group-text">👤</span>

                    <input
                      className="form-control"
                      placeholder="Username"
                      value={loginForm.username}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="input-group mb-4 position-relative">
                    <span className="input-group-text">🔒</span>

                    <input
                      className="form-control"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                      disabled={loading}
                    />

                    {/* TOGGLE PASSWORD */}
                    <button
                      type="button"
                      className="btn btn-sm position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                      style={{ zIndex: 10 }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <BsEye /> : <BsEyeSlash />}
                    </button>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                    disabled={loading}
                  >
                    {loading && (
                      <span className="spinner-border spinner-border-sm me-2" />
                    )}

                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              </div>

              {/* RIGHT - INFO PANEL */}
              <div className="bg-primary text-white text-center p-4 d-flex flex-column justify-content-center flex-fill">
                <h3 className="fw-bold">New here?</h3>

                <p className="opacity-75 mt-2">
                  Create an account to manage content
                </p>

                <Link to="/register" className="btn btn-light mt-3">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
