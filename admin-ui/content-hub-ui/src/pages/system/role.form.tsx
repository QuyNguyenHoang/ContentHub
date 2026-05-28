import { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
} from '@coreui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { roleApi } from '../../api/system/role.api'

const RoleForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')

  useEffect(() => {
    if (id) {
      roleApi.getById(id).then((res) => {
        setName(res.data.name)
        setDisplayName(res.data.displayName)
      })
    }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (id) {
      await roleApi.update(id, { name, displayName })
    } else {
      await roleApi.create({ name, displayName })
    }

    navigate('/admin/roles')
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>{id ? 'Edit Role' : 'Create Role'}</strong>
      </CCardHeader>

      <CCardBody>
        <CForm onSubmit={handleSubmit}>
          <CFormInput
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <CFormInput
            className="mt-3"
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />

          <div className="mt-4">
            <CButton type="submit">Save</CButton>{' '}
            <CButton color="secondary" onClick={() => navigate('/roles')}>
              Cancel
            </CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default RoleForm
