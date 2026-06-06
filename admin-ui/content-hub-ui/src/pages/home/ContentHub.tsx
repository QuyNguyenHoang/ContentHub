import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Carousel,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const categories = [
  { icon: "⚛️", name: "Frontend", count: "2,500+" },
  { icon: "🖥️", name: "Backend", count: "1,800+" },
  { icon: "🤖", name: "AI", count: "900+" },
  { icon: "☁️", name: "Cloud", count: "1,200+" },
  { icon: "🐳", name: "DevOps", count: "700+" },
  { icon: "🗄️", name: "Database", count: "1,100+" },
];
const heroImages = [
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
];
const featuredPosts = [
  {
    title: "React 19 New Features",
    category: "Frontend",
    author: "John Doe",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    title: "Clean Architecture in .NET",
    category: "Backend",
    author: "Jane Smith",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
  {
    title: "Docker for Beginners",
    category: "DevOps",
    author: "Michael Brown",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <div style={{ background: "#f8fafc" }}>
      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg,#0d6efd,#6610f2)",
          minHeight: "90vh",
        }}
        className="d-flex align-items-center"
      >
        <Container>
          <Row className="align-items-center gy-5">
            <Col lg={5}>
              <Badge bg="light" text="primary" className="px-3 py-2 mb-4">
                🚀 Trusted by 50,000+ readers
              </Badge>

              <h2
                className="fw-bold text-white mb-4"
                style={{
                  fontSize: "clamp(3rem,6vw,5rem)",
                  lineHeight: "1.1",
                }}
              >
                Learn.
                <br />
                Share.
                <br />
                Grow.
              </h2>

              <p
                className="text-white-50 mb-4"
                style={{
                  fontSize: "1.2rem",
                  maxWidth: "550px",
                }}
              >
                Khám phá hàng nghìn bài viết chất lượng, chia sẻ kinh nghiệm
                thực tế và kết nối với cộng đồng công nghệ trên một nền tảng
                hiện đại.
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button size="lg" variant="light">
                  Explore Articles
                </Button>

                <Button size="lg" variant="outline-light" onClick={()=>navigate("/posts")}>
                  Start Reading
                </Button>
              </div>

              <div className="d-flex gap-4 text-white">
                <div>
                  <h4 className="fw-bold mb-0">50K+</h4>
                  <small>Members</small>
                </div>

                <div>
                  <h4 className="fw-bold mb-0">12K+</h4>
                  <small>Articles</small>
                </div>

                <div>
                  <h4 className="fw-bold mb-0">100+</h4>
                  <small>Topics</small>
                </div>
              </div>
            </Col>

            <Col lg={7}>
              <div
                style={{
                  background: "rgba(255,255,255,.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "24px",
                  padding: "12px",
                }}
              >
                <Carousel
                  fade
                  indicators
                  controls
                  interval={3000}
                  className="hero-carousel"
                >
                  {heroImages.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={image}
                        alt={`hero-${index}`}
                        className="d-block w-100"
                        style={{
                          height: "500px",
                          objectFit: "cover",
                          borderRadius: "20px",
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* STATS */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            {[
              {
                icon: "👥",
                value: "50K+",
                label: "Members",
              },
              {
                icon: "📰",
                value: "12K+",
                label: "Articles",
              },
              {
                icon: "🏷️",
                value: "100+",
                label: "Categories",
              },
              {
                icon: "💬",
                value: "300K+",
                label: "Comments",
              },
            ].map((item) => (
              <Col md={6} lg={3} key={item.label}>
                <Card
                  className="border-0 shadow-sm h-100 text-center"
                  style={{
                    borderRadius: "24px",
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="fs-1">{item.icon}</div>

                    <h2 className="fw-bold mt-3">{item.value}</h2>

                    <p className="text-muted mb-0">{item.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FEATURES */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose Content Hub?</h2>

            <p className="text-muted">
              Một nền tảng hiện đại để chia sẻ kiến thức và kết nối cộng đồng.
            </p>
          </div>

          <Row className="g-4">
            {[
              {
                icon: "✍️",
                title: "Easy Writing",
                desc: "Tạo và chia sẻ nội dung chỉ trong vài phút.",
              },
              {
                icon: "📚",
                title: "Rich Knowledge",
                desc: "Kho kiến thức phong phú từ cộng đồng.",
              },
              {
                icon: "💬",
                title: "Community",
                desc: "Thảo luận, trao đổi và học hỏi cùng nhau.",
              },
            ].map((feature) => (
              <Col md={4} key={feature.title}>
                <Card
                  className="border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "24px",
                  }}
                >
                  <Card.Body className="text-center p-5">
                    <div className="fs-1 mb-3">{feature.icon}</div>

                    <h4>{feature.title}</h4>

                    <p className="text-muted mb-0">{feature.desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CATEGORIES */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Explore Categories</h2>

            <p className="text-muted">Khám phá nội dung theo lĩnh vực.</p>
          </div>

          <Row className="g-4">
            {categories.map((category) => (
              <Col md={4} lg={2} key={category.name}>
                <Card
                  className="border-0 shadow-sm h-100 text-center"
                  style={{
                    borderRadius: "20px",
                    cursor: "pointer",
                  }}
                >
                  <Card.Body className="p-4">
                    <div className="fs-1">{category.icon}</div>

                    <h6 className="mt-3 fw-bold">{category.name}</h6>

                    <small className="text-muted">
                      {category.count} Articles
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FEATURED POSTS */}
      <section className="py-5 bg-white">
        <Container>
          <div className="mb-5">
            <h2 className="fw-bold">Featured Articles</h2>

            <p className="text-muted">
              Những bài viết nổi bật được quan tâm nhiều nhất.
            </p>
          </div>

          <Row className="g-4">
            {featuredPosts.map((post) => (
              <Col md={4} key={post.title}>
                <Card
                  className="border-0 shadow-sm h-100"
                  style={{
                    borderRadius: "24px",
                    overflow: "hidden",
                  }}
                >
                  <Card.Img
                    src={post.image}
                    style={{
                      height: "260px",
                      objectFit: "cover",
                    }}
                  />

                  <Card.Body className="p-4">
                    <Badge bg="primary">{post.category}</Badge>

                    <h4 className="mt-3">{post.title}</h4>

                    <p className="text-muted">
                      Khám phá kiến thức và kinh nghiệm thực tế từ cộng đồng.
                    </p>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold">{post.author}</div>

                        <small className="text-muted">{post.readTime}</small>
                      </div>

                      <Button variant="link" className="text-decoration-none">
                        Read →
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* WHY US */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={6}>
              <img
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f"
                alt=""
                className="img-fluid rounded-4 shadow"
              />
            </Col>

            <Col lg={6}>
              <h2 className="fw-bold mb-4">Why Content Hub?</h2>

              <div className="d-flex flex-column gap-3">
                <div>✅ Modern Interface</div>
                <div>✅ Fast Performance</div>
                <div>✅ Rich Content</div>
                <div>✅ Active Community</div>
                <div>✅ Mobile Friendly</div>
                <div>✅ Secure Platform</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-5">
        <Container>
          <div
            className="text-center text-white"
            style={{
              borderRadius: "32px",
              padding: "80px 30px",
              background: "linear-gradient(135deg,#0d6efd,#6610f2)",
            }}
          >
            <h2 className="fw-bold mb-3">Ready to Share Your Knowledge?</h2>

            <p
              className="lead mb-4 mx-auto"
              style={{
                maxWidth: "700px",
              }}
            >
              Tham gia cộng đồng hàng nghìn tác giả và bắt đầu hành trình chia
              sẻ kiến thức của bạn ngay hôm nay.
            </p>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button variant="light" size="lg">
                Start Writing
              </Button>

              <Button variant="outline-light" size="lg">
                Explore Articles
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
