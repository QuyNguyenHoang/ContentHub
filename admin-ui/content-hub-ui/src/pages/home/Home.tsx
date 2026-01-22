import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'

export default function Home() {
  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Home</CCardHeader>
            <CCardBody>
              <h4>Welcome to Content Hub Admin 🎉</h4>
              <p>Đây là trang Home (Dashboard)</p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
