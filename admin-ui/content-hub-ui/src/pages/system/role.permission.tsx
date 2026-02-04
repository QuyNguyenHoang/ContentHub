import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CRow,
  CSpinner,
} from '@coreui/react'
import { roleApi } from '../../api/system/role.api'
import type { PermissionDto, RoleClaimDto } from '../../api/system/role.api'

const RolePermission = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [data, setData] = useState<PermissionDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // ===== LOAD =====
  useEffect(() => {
    if (!id) return

    const load = async () => {
      try {
        setLoading(true)
        const res = await roleApi.getPermissions(id)
        setData(res.data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  // ===== GROUP PERMISSIONS =====
  const groups = useMemo(() => {
    if (!data) return {}

    return data.roleClaims.reduce<Record<string, RoleClaimDto[]>>(
      (acc, cur) => {
        acc[cur.type] ??= []
        acc[cur.type].push(cur)
        return acc
      },
      {},
    )
  }, [data])

  // ===== TOGGLE SINGLE =====
  const togglePermission = (value: string) => {
    if (!data) return

    setData({
      ...data,
      roleClaims: data.roleClaims.map((p) =>
        p.value === value ? { ...p, selected: !p.selected } : p,
      ),
    })
  }

  // ===== TOGGLE GROUP =====
  const toggleGroup = (type: string, checked: boolean) => {
    if (!data) return

    setData({
      ...data,
      roleClaims: data.roleClaims.map((p) =>
        p.type === type ? { ...p, selected: checked } : p,
      ),
    })
  }

  // ===== SAVE =====
  const savePermissions = async () => {
    if (!data) return

    try {
      setSaving(true)
      await roleApi.savePermissions(data)
      alert('Cập nhật quyền thành công')
      navigate('/roles')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !data) {
    return (
      <div className="text-center my-5">
        <CSpinner />
      </div>
    )
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Phân quyền cho Role</strong>
      </CCardHeader>

      <CCardBody>
        {Object.entries(groups).map(([type, permissions]) => {
          const total = permissions.length
          const checkedCount = permissions.filter(p => p.selected).length
          const allChecked = checkedCount === total
          const indeterminate = checkedCount > 0 && !allChecked

          return (
            <div
              key={type}
              className="mb-4 border rounded p-3 bg-light"
            >
              {/* GROUP HEADER */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="text-primary">
                  {type.replace('Permissions.', '')}
                </strong>

                <CFormCheck
                  label="Chọn tất cả"
                  checked={allChecked}
                  indeterminate={indeterminate}
                  onChange={(e) =>
                    toggleGroup(type, e.target.checked)
                  }
                />
              </div>

              {/* ITEMS */}
              <CRow>
                {permissions.map((p) => (
                  <CCol md={4} key={p.value} className="mb-2">
                    <div className="border rounded px-2 py-1">
                      <CFormCheck
                        label={p.displayName || p.value}
                        checked={p.selected}
                        onChange={() => togglePermission(p.value)}
                      />
                    </div>
                  </CCol>
                ))}
              </CRow>
            </div>
          )
        })}

        <div className="mt-4 d-flex gap-2">
          <CButton
            color="primary"
            onClick={savePermissions}
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </CButton>

          <CButton
            color="secondary"
            variant="outline"
            onClick={() => navigate('/roles')}
          >
            Hủy
          </CButton>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default RolePermission
