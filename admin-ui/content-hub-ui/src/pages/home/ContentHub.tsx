import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CCarousel,
  CCarouselItem,
} from "@coreui/react";

export default function ContentHub() {
  return (
    <div className="bg-light min-vh-100 py-4">
      <CContainer>
        {/* HERO */}
        <CCarousel controls indicators interval={40000} className="mb-5">
          <CCarouselItem>
            <div className="p-5 text-center bg-white border rounded shadow-sm">
              <h2 className="fw-bold">📰 Content Hub</h2>
              <p className="text-muted">
                Nền tảng chia sẻ kiến thức, câu chuyện và kinh nghiệm trong cuộc
                sống.
              </p>
              <CButton
                color="primary"
                className="mt-2"
                href="/posts"
              >
                Bắt đầu đọc
              </CButton>
            </div>
          </CCarouselItem>

          <CCarouselItem>
            <div className="p-5 text-center bg-white border rounded shadow-sm">
              <h2 className="fw-bold">✍️ Chia sẻ nội dung</h2>
              <p className="text-muted">
                Tạo và đăng bài viết một cách dễ dàng, nhanh chóng.
              </p>
              <CButton color="dark" className="mt-2">
                Tạo bài viết
              </CButton>
            </div>
          </CCarouselItem>

          <CCarouselItem>
            <div className="p-5 text-center bg-white border rounded shadow-sm">
              <h2 className="fw-bold">💬 Kết nối cộng đồng</h2>
              <p className="text-muted">
                Trao đổi, thảo luận và học hỏi từ những người khác.
              </p>
              <CButton color="success" className="mt-2">
                Khám phá
              </CButton>
            </div>
          </CCarouselItem>
        </CCarousel>

        {/* TÍNH NĂNG */}
        <CRow className="g-4 mb-5">
          <CCol md={4}>
            <CCard className="h-100 shadow-sm border">
              <CCardBody className="text-center p-4">
                <h5 className="fw-semibold">✍️ Viết bài dễ dàng</h5>
                <p className="text-muted small mb-0">
                  Giao diện đơn giản giúp bạn tạo và chia sẻ nội dung nhanh
                  chóng.
                </p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={4}>
            <CCard className="h-100 shadow-sm border">
              <CCardBody className="text-center p-4">
                <h5 className="fw-semibold">📚 Khám phá nội dung</h5>
                <p className="text-muted small mb-0">
                  Đọc nhiều bài viết thuộc các chủ đề khác nhau.
                </p>
              </CCardBody>
            </CCard>
          </CCol>

          <CCol md={4}>
            <CCard className="h-100 shadow-sm border">
              <CCardBody className="text-center p-4">
                <h5 className="fw-semibold">💬 Tương tác</h5>
                <p className="text-muted small mb-0">
                  Bình luận và trao đổi với cộng đồng.
                </p>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        {/* GIỚI THIỆU */}
        <CCard className="shadow-sm border mb-4">
          <CCardHeader className="bg-white fw-semibold">
            📌 Giới thiệu
          </CCardHeader>
          <CCardBody>
            <p className="text-muted mb-0">
              Content Hub được xây dựng nhằm mang lại một không gian đơn giản và
              hiệu quả để mọi người chia sẻ kiến thức, kinh nghiệm và ý tưởng.
              Chúng tôi hướng đến việc tạo ra một cộng đồng tích cực, nơi mọi
              người có thể học hỏi lẫn nhau.
            </p>
          </CCardBody>
        </CCard>
      </CContainer>
    </div>
  );
}
