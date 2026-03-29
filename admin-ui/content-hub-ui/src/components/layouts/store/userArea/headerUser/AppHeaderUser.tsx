import { useState, useRef, useEffect } from "react";
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/react";
import { cilSearch, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  name?: string;
  email?: string;
}

const AppHeaderUser = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Kiểm tra login khi component mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setUserName(decoded.name || decoded.email || "Người dùng");
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Auto focus search input
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  // ESC đóng search
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Click outside đóng search
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      setShowSearch(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUserName(null);
    window.location.href = "/login";
  };

  return (
    <>
      {/* ===== HEADER ===== */}
      <CHeader position="sticky" className="shadow-sm bg-white z-3">
        <CContainer fluid>
          <CHeaderBrand href="/" className="fw-bold fs-4 text-primary">
            <img src="public/learning.png" height="40" />
          </CHeaderBrand>

          <CHeaderNav className="me-auto ms-4 d-none d-md-flex fw-bold">
            <CNavItem>
              <CNavLink href="/" active>
                Trang chủ
              </CNavLink>
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

          <div className="d-flex align-items-center gap-2">
            {/* Hiển thị user nếu đã login */}
            {userName ? (
              <>
                <CButton color="success" size="sm" href="/new">
                  Create Post
                </CButton>

                <CDropdown variant="btn-group">
                  <CDropdownToggle color="primary" size="sm">
                    {userName}
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem href="/profile">Profile</CDropdownItem>
                    <CDropdownItem onClick={handleLogout}>Logout</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </>
            ) : (
              <>
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
              </>
            )}

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
            <CForm className="d-flex align-items-center py-2">
              <CFormInput
                ref={inputRef}
                type="search"
                placeholder="Tìm kiếm khóa học, bài viết, kiến thức..."
                className="border-0 shadow-none fs-5"
              />

              <CButton
                color="primary"
                className="btn btn-sm ms-3 px-4 rounded-2"
              >
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
  );
};

export default AppHeaderUser;
