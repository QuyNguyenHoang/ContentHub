export function PostSideBar() {
  return (
    <div>
      {/* Collapse đơn giản: desktop luôn hiện, mobile ẩn */}
      <div className="collapse d-lg-block" id="sidebarHot">
        <div
          className="bg-white rounded-4 border-0 shadow-lg p-3"
          style={{ height: "100vh" }}
        >
          {/* Tiêu đề HOT */}
          <h5 className="text-danger text-center mb-3">HOT</h5>

          {/* Danh sách link */}
          <ul className="nav flex-column gap-2">
            <li className="nav-item">
              <a href="#" className="nav-link text-dark fw-medium p-2 rounded">
                Link 1
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-dark fw-medium p-2 rounded">
                Link 2
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link text-dark fw-medium p-2 rounded">
                Link 3
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
