import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CRow,
  CCol,
} from "@coreui/react"
import CIcon from "@coreui/icons-react"
import {
  cilUser,
  cilLockLocked,
  cilEnvelopeClosed,
  cilCalendar,
} from "@coreui/icons"

import { registerApi } from "../../../api/auth/auth.api"

/* =========================
   Types
========================= */

interface RegisterFormData {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
  confirmPassword: string
  dob: string // luôn là string cho input
}

/* =========================
   Helper: Extract API Error
========================= */

const extractApiError = (err: any): string => {
  const data = err.response?.data

  if (!data) return "Unexpected error"

  if (Array.isArray(data)) return data.join(", ")

  if (data.errors)
    return Object.values(data.errors).flat().join(", ")

  return data.title || "Unexpected error"
}

/* =========================
   Component
========================= */

const RegisterPage = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "", // luôn string
  })

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      return
    }

    // Convert dob sang null nếu rỗng
    const payload = {
      ...form,
      dob: form.dob ? form.dob : null,
    }

    setLoading(true)

    try {
      const message = await registerApi(payload)
      setSuccess(message || "Đăng ký thành công! Vui lòng kiểm tra email.")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err: any) {
      setError(extractApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <div style={{ width: 500 }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold">Create Account</h3>
          <p className="text-medium-emphasis">
            Join our platform and start your journey
          </p>
        </div>

        <CForm onSubmit={handleSubmit}>
          {error && (
            <CAlert color="danger" className="mb-3">
              {error}
            </CAlert>
          )}

          {success && (
            <CAlert color="success" className="mb-3">
              {success}
            </CAlert>
          )}

          <CRow>
            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  First Name
                </label>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    required
                  />
                </CInputGroup>
              </div>
            </CCol>

            <CCol md={6}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Last Name
                </label>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilUser} />
                  </CInputGroupText>
                  <CFormInput
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    required
                  />
                </CInputGroup>
              </div>
            </CCol>
          </CRow>

          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilUser} />
              </CInputGroupText>
              <CFormInput
                name="userName"
                value={form.userName}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilEnvelopeClosed} />
              </CInputGroupText>
              <CFormInput
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Date of Birth
            </label>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilCalendar} />
              </CInputGroupText>
              <CFormInput
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
              />
            </CInputGroup>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              Confirm Password
            </label>
            <CInputGroup>
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </CInputGroup>
          </div>

          <CButton
            type="submit"
            color="primary"
            size="lg"
            className="w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </CButton>
        </CForm>
      </div>
    </div>
  )
}

export default RegisterPage