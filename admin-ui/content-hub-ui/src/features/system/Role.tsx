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
} from '@coreui/react'

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
    if (!window.confirm('Xóa các quyền đã chọn?')) return
    for (const id of selectedIds) {
      await roleApi.delete(id)
    }
    loadData()
  }

  // ===== PAGINATION =====
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <CCard>
      {/* ===== HEADER ===== */}
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
              onClick={() => navigate('/roles/create')}
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
  onClick={() => navigate(`/roles/${r.id}/permissions`)}
>
  Phân quyền
</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        )}

        {/* ===== FOOTER ===== */}
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
    </CCard>
  )
}

export default RoleList
