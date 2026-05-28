import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CFormInput,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCheckCircle,
  cilWarning,
  cilXCircle,
  cilReload,
  cilX,
} from '@coreui/icons'

import { roleApi } from '../../api/system/role.api'
import type { RoleResponse } from '../../api/system/role.api'

const RoleList = () => {
  const navigate = useNavigate()

  // ===== STATE =====
  const [items, setItems] = useState<RoleResponse[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // ===== TOAST =====
  const [toast, setToast] = useState<{
    visible: boolean
    color: 'success' | 'danger' | 'warning'
    message: string
  }>({
    visible: false,
    color: 'success',
    message: '',
  })

  // ===== LOAD DATA =====
  const loadData = async () => {
    try {
      setLoading(true)
      const res = await roleApi.getPaging({
        keyword,
        pageIndex,
        pageSize,
      })

      setItems(res.data.results)
      setTotalCount(res.data.rowCount)
      setSelectedIds([])
    } catch {
      setToast({
        visible: true,
        color: 'danger',
        message: 'Không thể tải danh sách role',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [pageIndex])

  // ===== SELECT =====
  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? items.map((x) => x.id) : [])
  }

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  // ===== DELETE =====
  const deleteItems = async () => {
    if (!window.confirm('Xóa các role đã chọn?')) return

    try {
      for (const id of selectedIds) {
        await roleApi.delete(id)
      }

      setToast({
        visible: true,
        color: 'success',
        message: 'Xóa role thành công',
      })

      loadData()
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        'Không thể xoá role'

      setToast({
        visible: true,
        color: 'danger',
        message,
      })
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <CCard>
      <CCardHeader>
        <strong>Quản lý quyền</strong>
      </CCardHeader>

      <CCardBody>
        {/* ===== TOOLBAR ===== */}
        <CRow className="mb-3">
          <CCol>
            <CButton
              size="sm"
              color="success"
              onClick={() => navigate('/admin/roles/create')}
            >
              Thêm
            </CButton>

            <CButton
              size="sm"
              color="danger"
              className="ms-1"
              disabled={selectedIds.length === 0}
              onClick={deleteItems}
            >
              Xóa
            </CButton>

            <CButton
              size="sm"
              color="warning"
              className="ms-1"
              disabled={selectedIds.length !== 1}
              onClick={() => navigate(`/roles/edit/${selectedIds[0]}`)}
            >
              Sửa
            </CButton>
          </CCol>

          <CCol>
            <CRow>
              <CCol>
                <CFormInput
                  placeholder="Nhập tên..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadData()}
                />
              </CCol>
              <CCol xs="auto">
                <CButton onClick={loadData}>Tìm</CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>

        {/* ===== TABLE ===== */}
        {loading ? (
          <div className="text-center my-5">
            <CSpinner />
          </div>
        ) : (
          <CTable hover striped responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell style={{ width: 40 }}>
                  <CFormCheck
                    checked={
                      items.length > 0 &&
                      selectedIds.length === items.length
                    }
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                </CTableHeaderCell>
                <CTableHeaderCell>Tên</CTableHeaderCell>
                <CTableHeaderCell>Mô tả</CTableHeaderCell>
                <CTableHeaderCell style={{ width: 150 }} />
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {items.map((r) => (
                <CTableRow key={r.id}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedIds.includes(r.id)}
                      onChange={() => toggleSelectItem(r.id)}
                    />
                  </CTableDataCell>
                  <CTableDataCell>{r.name}</CTableDataCell>
                  <CTableDataCell>{r.displayName}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="info"
                      size="sm"
                      onClick={() =>
                        navigate(`/admin/roles/${r.id}/permissions`)
                      }
                    >
                      Phân quyền
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {/* ===== PAGINATION ===== */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>Tổng số: {totalCount}</div>

          <CPagination>
            <CPaginationItem
              disabled={pageIndex === 1}
              onClick={() => setPageIndex((p) => p - 1)}
            >
              «
            </CPaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <CPaginationItem
                key={i}
                active={pageIndex === i + 1}
                onClick={() => setPageIndex(i + 1)}
              >
                {i + 1}
              </CPaginationItem>
            ))}

            <CPaginationItem
              disabled={pageIndex === totalPages}
              onClick={() => setPageIndex((p) => p + 1)}
            >
              »
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardBody>

      {/* ===== TOAST ===== */}
      <CToaster placement="top-end">
        <CToast
          visible={toast.visible}
          color={toast.color}
          autohide
          delay={4000}
          className="shadow-lg"
          onClose={() =>
            setToast((t) => ({ ...t, visible: false }))
          }
        >
          <CToastHeader closeButton={false}>
            <CIcon
              icon={
                toast.color === 'success'
                  ? cilCheckCircle
                  : toast.color === 'warning'
                  ? cilWarning
                  : cilXCircle
              }
              className="me-2"
            />
            <strong className="me-auto">
              {toast.color === 'success'
                ? 'Thành công'
                : toast.color === 'warning'
                ? 'Cảnh báo'
                : 'Lỗi'}
            </strong>

            <CButton
              size="sm"
              color="link"
              className="p-0 me-2"
              onClick={() => {
                loadData()
                setToast((t) => ({ ...t, visible: false }))
              }}
            >
              <CIcon icon={cilReload} />
            </CButton>

            <CButton
              size="sm"
              color="link"
              className="p-0"
              onClick={() =>
                setToast((t) => ({ ...t, visible: false }))
              }
            >
              <CIcon icon={cilX} />
            </CButton>
          </CToastHeader>

          <CToastBody>{toast.message}</CToastBody>
        </CToast>
      </CToaster>
    </CCard>
  )
}

export default RoleList
