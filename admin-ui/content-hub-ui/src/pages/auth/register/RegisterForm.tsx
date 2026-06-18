import React, { useState } from "react";
import {
  BsPerson,
  BsPersonBadge,
  BsEnvelope,
  BsCalendarDate,
  BsLock,
  BsEye,
  BsEyeSlash,
  BsGithub,
  BsFacebook,
  BsGoogle,
} from "react-icons/bs";

import type { RegisterRequestDto } from "../../../api/auth/auth.api";
import type { ValidationErrors } from "../../../features/auth/RegisterComponent";
import { Link } from "react-router-dom";

interface Props {
  registerForm: RegisterRequestDto;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterRequestDto>>;
  handleRegister: (e: React.FormEvent) => void;
  loading: boolean;
  errors: ValidationErrors;
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>;
}

export default function RegisterForm({
  registerForm,
  setRegisterForm,
  handleRegister,
  loading,
  errors,
  setErrors,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name as keyof ValidationErrors]: undefined,
    }));
  };
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isChecked, setIsChecked] = useState(false);
  return (
    <div
      className="container  d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "550px" }}>
        <div className="card border-0 rounded-5 shadow-lg">
          <div className="card-body p-4 p-md-5">
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-2">Create Account</h2>
              <p className="text-muted mb-0">Create your account to continue</p>
            </div>

            <form onSubmit={handleRegister}>
              {/* First Name + Last Name */}
              <div className="row">
                <div className="col-12 col-md-6 mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <BsPerson />{" "}
                      <span className="text-danger small"> (*)</span>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.firstName ? "is-invalid" : ""
                      }`}
                      name="firstName"
                      placeholder="First Name"
                      value={registerForm.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  {errors.firstName && (
                    <div className="text-danger small mt-1">
                      {errors.firstName}
                    </div>
                  )}
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <div className="input-group">
                    <span className="input-group-text">
                      <BsPerson />
                      <span className="text-danger small"> (*)</span>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.lastName ? "is-invalid" : ""
                      }`}
                      name="lastName"
                      placeholder="Last Name"
                      value={registerForm.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  {errors.lastName && (
                    <div className="text-danger small mt-1">
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <BsPersonBadge />
                    <span className="text-danger small"> (*)</span>
                  </span>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.userName ? "is-invalid" : ""
                    }`}
                    name="userName"
                    placeholder="Username"
                    value={registerForm.userName}
                    onChange={handleChange}
                  />
                </div>

                {errors.userName && (
                  <div className="text-danger small mt-1">
                    {errors.userName}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <BsEnvelope />
                    <span className="text-danger small"> (*)</span>
                  </span>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    placeholder="Email Address"
                    value={registerForm.email}
                    onChange={handleChange}
                  />
                </div>

                {errors.email && (
                  <div className="text-danger small mt-1">{errors.email}</div>
                )}
              </div>

              {/* Date Of Birth */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <BsCalendarDate />
                  </span>
                  <input
                    type="date"
                    className={`form-control ${errors.dob ? "is-invalid" : ""}`}
                    name="dob"
                    value={registerForm.dob || ""}
                    onChange={handleChange}
                  />
                </div>

                {errors.dob && (
                  <div className="text-danger small mt-1">{errors.dob}</div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <BsLock />
                    <span className="text-danger small"> (*)</span>
                  </span>
                  <input
                    type={showPassword.password ? "text" : "password"}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    name="password"
                    placeholder="Password"
                    value={registerForm.password}
                    onChange={handleChange}
                  />
                  <span className="input-group-text p-0">
                    <button
                      type="button"
                      className="btn border-0 "
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          password: !prev.password,
                        }))
                      }
                      tabIndex={-1}
                    >
                      {showPassword.password ? <BsEye /> : <BsEyeSlash />}
                    </button>
                  </span>
                </div>

                {errors.password && (
                  <div className="text-danger small mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text">
                    <BsLock />
                    <span className="text-danger small"> (*)</span>
                  </span>
                  <input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={registerForm.confirmPassword}
                    onChange={handleChange}
                  />
                  <span className="input-group-text p-0">
                    <button
                      type="button"
                      className="btn border-0 "
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          confirmPassword: !prev.confirmPassword,
                        }))
                      }
                      tabIndex={-1}
                    >
                      {showPassword.confirmPassword ? (
                        <BsEye />
                      ) : (
                        <BsEyeSlash />
                      )}
                    </button>
                  </span>
                </div>

                {errors.confirmPassword && (
                  <div className="text-danger small mt-1">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-start align-items-center gap-1 mb-3">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <span>
                  I agree to the <Link to="#">Privacy Policy</Link>
                </span>
              </div>
              <div className="d-flex flex-column justify-content-center align-items-center gap-2">
                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-semibold"
                  disabled={loading || !isChecked}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
                <span>Or</span>
                {/* Social Login */}
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger flex-fill d-flex align-items-center justify-content-center gap-2"
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
              <div className="text-center mt-4">
                <small className="text-muted">
                  Already have an account?{" "}
                  <a href="/login" className="text-decoration-none fw-semibold">
                    Sign In
                  </a>
                </small>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
