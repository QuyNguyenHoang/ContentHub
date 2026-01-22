import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilLockLocked } from '@coreui/icons'
import { loginApi } from '../../api/auth.api'

const LoginForm = () => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await loginApi({
        username,
        password,
      })

      // ✅ login OK → redirect
      navigate('/', { replace: true })
    } catch (err: any) {
      // ❗ backend bạn đang return BadRequest("Đăng nhập không đúng")
      setError(
        err.response?.data ??
          err.response?.data?.message ??
          'Sai tài khoản hoặc mật khẩu'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <CForm onSubmit={handleSubmit}>
      {error && <CAlert color="danger">{error}</CAlert>}

      <CInputGroup className="mb-3">
        <CInputGroupText>
          <CIcon icon={cilUser} />
        </CInputGroupText>
        <CFormInput
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          disabled={loading}
        />
      </CInputGroup>

      <CInputGroup className="mb-4">
        <CInputGroupText>
          <CIcon icon={cilLockLocked} />
        </CInputGroupText>
        <CFormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </CInputGroup>

      <CButton
        type="submit"
        color="primary"
        className="w-100 d-flex align-items-center justify-content-center"
        disabled={loading}
      >
        {loading && (
          <span className="spinner-grow spinner-grow-sm me-2" />
        )}
        {loading ? 'Logging in...' : 'Login'}
      </CButton>
    </CForm>
  )
}

export default LoginForm
