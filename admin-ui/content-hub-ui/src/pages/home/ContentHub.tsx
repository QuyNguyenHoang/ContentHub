import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'

export default function ContentHub() {
  return (
    <CContainer className="mt-4">
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Home</CCardHeader>
            <CCardBody>
              <h4>Welcome to Content Hub User 🎉</h4>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  )
}
