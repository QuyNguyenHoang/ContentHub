import {
  CContainer,
  CRow,
  CCol,
  CFooter,
} from "@coreui/react"

const AppFooterUser = () => {
  return (
    <CFooter className="bg-dark text-light pt-5 pb-3 mt-5">
      <CContainer>

        <CRow className="mb-4">

          {/* ===== BRAND ===== */}
          <CCol md={4} className="mb-4">
            <h4 className="fw-bold text-white">MyCMS</h4>
            <p className="text-muted">
              Nền tảng chia sẻ kiến thức, khóa học và bài viết công nghệ.
              Xây dựng cộng đồng học tập chất lượng.
            </p>
          </CCol>

          {/* ===== QUICK LINKS ===== */}
          <CCol md={2} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Liên kết</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="footer-link">Trang chủ</a></li>
              <li><a href="/courses" className="footer-link">Khóa học</a></li>
              <li><a href="/blog" className="footer-link">Tin tức</a></li>
              <li><a href="/about" className="footer-link">Giới thiệu</a></li>
            </ul>
          </CCol>

          {/* ===== SUPPORT ===== */}
          <CCol md={3} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Hỗ trợ</h6>
            <ul className="list-unstyled">
              <li><a href="/faq" className="footer-link">FAQ</a></li>
              <li><a href="/policy" className="footer-link">Chính sách</a></li>
              <li><a href="/terms" className="footer-link">Điều khoản</a></li>
              <li><a href="/contact" className="footer-link">Liên hệ</a></li>
            </ul>
          </CCol>

          {/* ===== CONTACT ===== */}
          <CCol md={3} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Liên hệ</h6>
            <p className="mb-1">Email: support@mycms.com</p>
            <p className="mb-1">Hotline: 0123 456 789</p>
            <p className="mb-0">Cao Lãnh, Việt Nam</p>
          </CCol>

        </CRow>

        <hr className="border-secondary" />

        {/* ===== COPYRIGHT ===== */}
        <div className="text-center text-muted small">
          © {new Date().getFullYear()} MyCMS. All rights reserved.
        </div>

      </CContainer>
    </CFooter>
  )
}

export default AppFooterUser