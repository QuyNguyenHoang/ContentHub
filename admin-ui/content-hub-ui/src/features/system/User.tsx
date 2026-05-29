import { useEffect, useMemo, useState } from 'react'
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
  CBadge,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilCheckCircle,
  cilWarning,
  cilXCircle,
  // cilReload,
  cilX,
} from '@coreui/icons'

import { userApi } from '../../api/system/user.api'
import type { UserDto } from '../../api/system/user.api'

const UserList = () => {
  const navigate = useNavigate()

  // ================= STATE =================
  const [items, setItems] = useState<UserDto[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const pageSize = 10
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const [toast, setToast] = useState<{
    visible: boolean
    color: 'success' | 'danger' | 'warning'
    message: string
  }>({
    visible: false,
    color: 'success',
    message: '',
  })

  // ================= LOAD DATA =================
  const loadData = async (page = pageIndex) => {
    try {
      setLoading(true)

      const res = await userApi.getUserPaging({
        keyword,
        pageNumber: page,
        pageSize,
      })

      setItems(res.data.results)
      setTotalCount(res.data.rowCount)
      setSelectedIds([])
    } catch {
      setToast({
        visible: true,
        color: 'danger',
        message: 'Không thể tải danh sách user',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [pageIndex])

  // ================= SEARCH =================
  const handleSearch = () => {
    setPageIndex(1)
    loadData(1)
  }

  // ================= SELECT =================
  const isAllSelected =
    items.length > 0 && selectedIds.length === items.length

  const isIndeterminate =
    selectedIds.length > 0 &&
    selectedIds.length < items.length

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? items.map((x) => x.id) : [])
  }

  const toggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id],
    )
  }

  // ================= PAGINATION =================
  const totalPages = Math.ceil(totalCount / pageSize)

  const visiblePages = useMemo(() => {
    const range = 2
    const start = Math.max(1, pageIndex - range)
    const end = Math.min(totalPages, pageIndex + range)

    const pages = []
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }, [pageIndex, totalPages])

  // ================= DELETE =================
  const deleteItems = async () => {
    if (!window.confirm('Xóa các user đã chọn?')) return

    try {
      // await Promise.all(
      //   selectedIds.map((id) => userApi.delete(id)),
      // )

      setToast({
        visible: true,
        color: 'success',
        message: 'Xóa user thành công',
      })

      loadData()
    } catch (error: any) {
      setToast({
        visible: true,
        color: 'danger',
        message:
          error.response?.data?.message ||
          'Không thể xoá user',
      })
    }
  }

  return (
    <CCard>
      <CCardHeader>
        <strong>Quản lý người dùng</strong>
      </CCardHeader>

      <CCardBody>
        {/* ================= TOOLBAR ================= */}
        <CRow className="mb-3 align-items-center">
          <CCol>
            <CButton
              size="sm"
              color="success"
              onClick={() => navigate('/users/create')}
            >
              Thêm
            </CButton>

            <CButton
              size="sm"
              color="danger"
              className="ms-2"
              disabled={!selectedIds.length}
              onClick={deleteItems}
            >
              Xóa
            </CButton>

            <CButton
              size="sm"
              color="warning"
              className="ms-2"
              disabled={selectedIds.length !== 1}
              onClick={() =>
                navigate(`/users/update/${selectedIds[0]}`)
              }
            >
              Sửa
            </CButton>
          </CCol>

          <CCol md={4}>
            <CRow>
              <CCol>
                <CFormInput
                  placeholder="Tìm username hoặc email..."
                  value={keyword}
                  onChange={(e) =>
                    setKeyword(e.target.value)
                  }
                  onKeyDown={(e) =>
                    e.key === 'Enter' && handleSearch()
                  }
                />
              </CCol>
              <CCol xs="auto">
                <CButton onClick={handleSearch}>
                  Tìm
                </CButton>
              </CCol>
            </CRow>
          </CCol>
        </CRow>

        {/* ================= TABLE ================= */}
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
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={(e) =>
                      toggleSelectAll(
                        e.target.checked,
                      )
                    }
                  />
                </CTableHeaderCell>
                <CTableHeaderCell>Avatar</CTableHeaderCell>
                <CTableHeaderCell>Full Name</CTableHeaderCell>
                <CTableHeaderCell>UserName</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Email Confirmed</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Last Login</CTableHeaderCell>
                <CTableHeaderCell>Created</CTableHeaderCell>
                <CTableHeaderCell>Dob</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {items.map((u) => (
                <CTableRow key={u.id}>
                  <CTableDataCell>
                    <CFormCheck
                      checked={selectedIds.includes(u.id)}
                      onChange={() =>
                        toggleSelectItem(u.id)
                      }
                    />
                  </CTableDataCell>

                  <CTableDataCell>
                    {u.avatar ? (
                      <img
                        src={u.avatar}
                        width={40}
                        height={40}
                        style={{
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      '-'
                    )}
                  </CTableDataCell>

                  <CTableDataCell>
                    {u.fullName}
                  </CTableDataCell>

                  <CTableDataCell>
                    {u.userName}
                  </CTableDataCell>

                  <CTableDataCell>
                    {u.email}
                  </CTableDataCell>

                  <CTableDataCell>
                    {u.emailConfirmed ? (
                      <CBadge color="success">
                        Yes
                      </CBadge>
                    ) : (
                      <CBadge color="secondary">
                        No
                      </CBadge>
                    )}
                  </CTableDataCell>

                  <CTableDataCell>
                    <CBadge
                      color={
                        u.isActive
                          ? 'success'
                          : 'danger'
                      }
                    >
                      {u.isActive
                        ? 'Active'
                        : 'Inactive'}
                    </CBadge>
                  </CTableDataCell>

                  <CTableDataCell>
                    {u.lastLoginDate
                      ? new Date(
                          u.lastLoginDate,
                        ).toLocaleDateString()
                      : '-'}
                  </CTableDataCell>

                  <CTableDataCell>
                    {new Date(
                      u.dateCreated,
                    ).toLocaleDateString()}
                  </CTableDataCell>
                 <CTableDataCell>
                  {u.dob
                    ? new Date(u.dob).toLocaleDateString()
                    : '-'}
                </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {/* ================= PAGINATION ================= */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <div>Tổng: {totalCount}</div>

          <CPagination>
            <CPaginationItem
              disabled={pageIndex === 1}
              onClick={() =>
                setPageIndex((p) => p - 1)
              }
            >
              «
            </CPaginationItem>

            {visiblePages.map((p) => (
              <CPaginationItem
                key={p}
                active={pageIndex === p}
                onClick={() =>
                  setPageIndex(p)
                }
              >
                {p}
              </CPaginationItem>
            ))}

            <CPaginationItem
              disabled={pageIndex === totalPages}
              onClick={() =>
                setPageIndex((p) => p + 1)
              }
            >
              »
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardBody>

      {/* ================= TOAST ================= */}
      <CToaster placement="top-end">
        <CToast
          visible={toast.visible}
          color={toast.color}
          autohide
          delay={3000}
          className="shadow-lg"
          onClose={() =>
            setToast((t) => ({
              ...t,
              visible: false,
            }))
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
              onClick={() =>
                setToast((t) => ({
                  ...t,
                  visible: false,
                }))
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

export default UserList