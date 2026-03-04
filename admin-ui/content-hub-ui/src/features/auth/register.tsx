import { useState } from "react"
import { useNavigate } from "react-router-dom"
import RegisterView from "../../pages/auth/register/Register"
import { registerApi } from "../../api/auth/auth.api"

const RegisterPage = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
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

    setLoading(true)

    try {
      const message = await registerApi(form)
      setSuccess(message || "Đăng ký thành công!")

      setTimeout(() => navigate("/login"), 2000)

    } catch (err: any) {
      setError(
        err.response?.data?.[0] ??
        err.response?.data ??
        "Đăng ký thất bại"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <RegisterView
      form={form}
      error={error}
      success={success}
      loading={loading}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  )
}

export default RegisterPage