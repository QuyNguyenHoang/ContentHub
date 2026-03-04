import { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CSpinner,
  CAlert,
  CRow,
  CCol,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { userApi } from '../../api/system/user.api'

const toInputDate = (date?: string | null) => {
  if (!date) return ''
  const d = new Date(date)
  return isNaN(d.getTime())
    ? ''
    : d.toISOString().split('T')[0]
}

const toIsoDate = (date?: string | null) => {
  if (!date) return null
  return new Date(date).toISOString()
}

const UserUpdateForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dob, setDob] = useState<string>('') // dùng string thay vì string | null
  const [avatar, setAvatar] = useState<string>('')

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ===== LOAD USER =====
  useEffect(() => {
    const loadUser = async () => {
      if (!id) return

      try {
        setLoading(true)
        const res = await userApi.getById(id)

        setFirstName(res.data.firstName ?? '')
        setLastName(res.data.lastName ?? '')
        setDob(toInputDate(res.data.dob))
        setAvatar(res.data.avatar ?? '')
      } catch {
        setError('Không thể tải dữ liệu user')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [id])

  // ===== SUBMIT =====
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    try {
      setSubmitting(true)
      setError(null)

      await userApi.update(id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dob: toIsoDate(dob),
        avatar: avatar.trim() || null,
      })

      navigate('/users')
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          'Cập nhật thất bại',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center my-5">
        <CSpinner />
      </div>
    )
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Update User</strong>
      </CCardHeader>

      <CCardBody>
        {error && <CAlert color="danger">{error}</CAlert>}

        <CForm onSubmit={handleSubmit}>
          <CRow>
            <CCol>
              <CFormInput
                label="First Name"
                value={firstName}
                onChange={(e) =>
                  setFirstName(e.target.value)
                }
                required
                disabled={submitting}
              />
            </CCol>

            <CCol>
              <CFormInput
                label="Last Name"
                value={lastName}
                onChange={(e) =>
                  setLastName(e.target.value)
                }
                required
                disabled={submitting}
              />
            </CCol>
          </CRow>

          <CFormInput
            className="mt-3"
            type="date"
            label="Date of Birth"
            value={dob}
            onChange={(e) =>
              setDob(e.target.value)
            }
            disabled={submitting}
          />

          <CFormInput
            className="mt-3"
            label="Avatar URL"
            value={avatar}
            onChange={(e) =>
              setAvatar(e.target.value)
            }
            disabled={submitting}
          />

          {avatar && (
            <div className="mt-3">
              <img
                src={avatar}
                alt="preview"
                width={80}
                height={80}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                onError={(e) =>
                  (e.currentTarget.style.display =
                    'none')
                }
              />
            </div>
          )}

          <div className="mt-4">
            <CButton
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? 'Saving...'
                : 'Save'}
            </CButton>{' '}
            <CButton
              color="secondary"
              onClick={() =>
                navigate('/users')
              }
              disabled={submitting}
            >
              Cancel
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default UserUpdateForm