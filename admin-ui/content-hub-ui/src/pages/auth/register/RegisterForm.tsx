import React from "react";
import {
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CCol,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilLockLocked,
  cilEnvelopeClosed,
  cilCalendar,
} from "@coreui/icons";

import type { RegisterRequestDto } from "../../../api/auth/auth.api";

/* =========================
   Props
========================= */
interface Props {
  registerForm: RegisterRequestDto;
  setRegisterForm: React.Dispatch<React.SetStateAction<RegisterRequestDto>>;
  handleRegister: (e: React.FormEvent) => void;
  loading: boolean;
}

/* =========================
   UI Component
========================= */
export default function RegisterForm({
  registerForm,
  setRegisterForm,
  handleRegister,
  loading,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRegisterForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: 500 }}>
        <h3 className="text-center mb-4">Create Account</h3>

        <CForm onSubmit={handleRegister}>

          {/* FIRST + LAST NAME */}
          <CRow>
            <CCol md={6}>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  name="firstName"
                  placeholder="First Name"
                  value={registerForm.firstName}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>

            <CCol md={6}>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  name="lastName"
                  placeholder="Last Name"
                  value={registerForm.lastName}
                  onChange={handleChange}
                />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* USERNAME */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              name="userName"
              placeholder="Username"
              value={registerForm.userName}
              onChange={handleChange}
            />
          </CInputGroup>

          {/* EMAIL */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilEnvelopeClosed} />
            </CInputGroupText>
            <CFormInput
              type="email"
              name="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={handleChange}
            />
          </CInputGroup>

          {/* DOB */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilCalendar} />
            </CInputGroupText>
            <CFormInput
              type="date"
              name="dob"
              value={registerForm.dob || ""}
              onChange={handleChange}
            />
          </CInputGroup>

          {/* PASSWORD */}
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilLockLocked} />
            </CInputGroupText>
            <CFormInput
              type="password"
              name="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={handleChange}
            />
          </CInputGroup>

          {/* CONFIRM PASSWORD */}
          <CInputGroup className="mb-4">
            <CInputGroupText>
              <CIcon icon={cilLockLocked} />
            </CInputGroupText>
            <CFormInput
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={registerForm.confirmPassword}
              onChange={handleChange}
            />
          </CInputGroup>

          {/* BUTTON */}
          <CButton
            type="submit"
            color="primary"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </CButton>

        </CForm>
      </div>
    </div>
  );
}