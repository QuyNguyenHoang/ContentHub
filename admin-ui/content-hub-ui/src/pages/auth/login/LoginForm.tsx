import React, { useState, type Dispatch, type SetStateAction } from "react";
import type { LoginRequestDto } from "../../../api/auth/auth.api";
import {
  BsEye,
  BsEyeSlash,
  BsFacebook,
  BsGithub,
  BsGoogle,
  BsLock,
  BsPerson,
} from "react-icons/bs";

interface Props {
  handleLogin: (e: React.FormEvent) => void;
  setLoginForm: Dispatch<SetStateAction<LoginRequestDto>>;
  loginWithRedirect: () => void;
  loading: boolean;
  loginForm: LoginRequestDto;
}

export default function LoginForm({
  handleLogin,
  setLoginForm,
  loginWithRedirect,
  loading,
  loginForm,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light position-relative px-3">
      {/* SIMPLE BACKGROUND  */}
      <div className="position-absolute top-0 start-0 w-100 h-100 bg-light">
        <div
          className="position-absolute top-0 start-0 w-100 h-100 opacity-50"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(13,110,253,0.08), transparent 40%), radial-gradient(circle at 80% 80%, rgba(13,110,253,0.06), transparent 40%)",
          }}
        />
      </div>

      {/* CARD */}
      <div
        className="w-100 position-relative"
        style={{ maxWidth: 420, zIndex: 1 }}
      >
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-md-5">
            {/* HEADER */}
            <div className="text-center mb-4">
              <div
                className="mx-auto mb-3 d-flex align-items-center justify-content-center bg-primary text-white rounded-circle"
                style={{ width: 52, height: 52 }}
              >
                <span className="fw-bold">CH</span>
              </div>

              <h4 className="fw-bold mb-1">Welcome back</h4>

              <p className="text-muted small mb-0">Sign in to ContentHub</p>
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin}>
              {/* USERNAME */}
              <div className="mb-2 ">
                <label className="form-label small text-muted">Username</label>

                <div></div>
                <div className="input-group  ">
                  <span className="input-group-text">
                    <BsPerson/>
                  </span>

                  <input
                    className="form-control"
                    placeholder="Enter username"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    autoComplete="username"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label small text-muted">Password</label>

                <div className="input-group input-group">
                  <span className="input-group-text">
                    <BsLock />
                  </span>

                  <input
                    className="form-control"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />

                  <span className="input-group-text p-0">
                    <button
                      type="button"
                      className="btn border-0 "
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? <BsEye /> : <BsEyeSlash />}
                    </button>
                  </span>
                </div>
              </div>

              {/* OPTIONS */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                  />
                  <label className="form-check-label small text-muted">
                    Remember me
                  </label>
                </div>

                <a href="#" className="small text-decoration-none text-primary">
                  Forgot password?
                </a>
              </div>

              <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                {/* BUTTON */}
                <button
                  type="submit"
                  className="btn btn-outline-primary w-100 py-2 fw-semibold d-flex justify-content-center align-items-center"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm me-2" />
                  )}
                  {loading ? "Signing in..." : "Sign in"}
                </button>
                <span>Or</span>
                {/* Social Login */}
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger flex-fill d-flex align-items-center justify-content-center gap-2"
                    onClick={()=>loginWithRedirect()}
                  >
                    <BsGoogle />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <BsFacebook />
                    <span>Facebook</span>
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark flex-fill d-flex align-items-center justify-content-center gap-2"
                  >
                    <BsGithub />
                    <span>GitHub</span>
                  </button>
                </div>
              </div>

              {/* FOOTER */}
              <div className="text-center mt-4">
                <span className="text-muted small">Don’t have an account?</span>{" "}
                <a
                  href="/register"
                  className="small text-primary text-decoration-none fw-semibold"
                >
                  Create account
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* FOOT NOTE */}
        <p className="text-center text-muted small mt-3 mb-0">
          Secure login • ContentHub
        </p>
      </div>
    </div>
  );
}
