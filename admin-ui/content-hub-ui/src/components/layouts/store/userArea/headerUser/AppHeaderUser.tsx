import { useState, useRef, useEffect } from "react"
import {
  CHeader,
  CContainer,
  CHeaderBrand,
  CHeaderNav,
  CNavItem,
  CNavLink,
  CButton,
  CForm,
  CFormInput,
} from "@coreui/react"
import { cilSearch, cilX } from "@coreui/icons"
import CIcon from "@coreui/icons-react"

const AppHeaderUser = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  // Auto focus
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showSearch])

  // ESC đóng
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false)
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [])

  // Click outside đóng
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      setShowSearch(false)
    }
  }

  return (
    <>
      {/* ===== HEADER ===== */}
      <CHeader position="sticky" className="shadow-sm bg-white z-3">
      <CContainer fluid>
  <CHeaderBrand href="/" className="fw-bold fs-4 text-primary">
  <img 
    src="public/learning.png"
    height="40"
  />
</CHeaderBrand>

  <CHeaderNav className="me-auto ms-4 d-none d-md-flex fw-bold">
    <CNavItem>
      <CNavLink href="/" active>Trang chủ</CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink href="/courses">Khóa học</CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink href="/blog">Tin tức</CNavLink>
    </CNavItem>
    <CNavItem>
      <CNavLink href="/about">Về chúng tôi</CNavLink>
    </CNavItem>
  </CHeaderNav>

  {/* ===== AUTH BUTTONS ===== */}
  <div className="d-flex align-items-center gap-2">

    <CButton
      color="primary"
      variant="outline"
      size="sm"
      href="/login"
    >
      Đăng nhập
    </CButton>

    <CButton
      color="primary"
      size="sm"
      href="/register"
      className="px-3"
    >
      Đăng ký
    </CButton>

    {/* Search */}
    <CButton
      color="primary"
      variant="ghost"
      onClick={() => setShowSearch(true)}
      className="rounded-circle"
    >
      <CIcon icon={cilSearch} size="lg" />
    </CButton>

  </div>
</CContainer>
      </CHeader>

      {/* ===== SEARCH OVERLAY ===== */}
      {showSearch && (
        <div
          ref={overlayRef}
          className="search-overlay"
          onClick={handleOverlayClick}
        >
          <div className="search-box shadow-lg">
            <CForm className="d-flex align-items-center">
              <CFormInput
                ref={inputRef}
                type="search"
                placeholder="Tìm kiếm khóa học, bài viết, kiến thức..."
                className="flex-grow-1 border-0 shadow-none fs-5"
              />

              <CButton color="primary" className="ms-3 px-4 rounded-pill">
                Tìm kiếm
              </CButton>

              <CButton
                color="light"
                variant="ghost"
                className="ms-2"
                onClick={() => setShowSearch(false)}
              >
                <CIcon icon={cilX} size="lg" />
              </CButton>
            </CForm>
          </div>
        </div>
      )}
    </>
  )
}

export default AppHeaderUser