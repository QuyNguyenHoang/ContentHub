import { Link } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'
import LoginForm from '../../../features/auth/login'

const LoginPage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={8} xl={7}>
            <CCardGroup className="shadow rounded-4 overflow-hidden">

              <CCard className="p-4 border-0">
                <CCardBody>
                  <h2 className="fw-bold mb-1">Welcome back 👋</h2>
                  <p className="text-body-secondary mb-4">
                    Sign in to ContentHub
                  </p>

                  {/* 👇 FORM LOGIC */}
                  <LoginForm />
                </CCardBody>
              </CCard>

              <CCard className="bg-primary text-white text-center border-0">
                <CCardBody className="d-flex flex-column justify-content-center">
                  <h3 className="fw-bold">New here?</h3>
                  <p className="opacity-75 mt-2">
                    Create an account to manage content
                  </p>
                  <Link to="/register" className="btn btn-light">
                    Register
                  </Link>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default LoginPage
