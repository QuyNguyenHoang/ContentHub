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
import { cilBell, cilSearch, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { DecodeToken } from "../../../../../api/extentions/decodeToken";
import { userApi } from "../../../../../api/system/user.api";
import { Link, useNavigate } from "react-router-dom";

export interface userInf {
  avatar?: string | null;
  fullName?: string;
  userName: string;
}

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const AppHeaderUser = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [inf, setInf] = useState<userInf | null>(null);
  const [authId, setAuthId] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  // ✅ Lấy userId
  useEffect(() => {
    const user = DecodeToken.accessToken();
    const id = user?.userId;
    if (id) setAuthId(id);
  }, []);

  // ✅ Lấy thông tin user
  useEffect(() => {
    if (!authId) return;

    const fetchUser = async () => {
      try {
        const res = await userApi.getById(authId);
        setInf(res.data);
      } catch (err) {
        console.log("get user fail", err);
      }
    };

    fetchUser();
  }, [authId]);

  // Auto focus search
  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  // ESC đóng search
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSearch(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) setShowSearch(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
    <>
      {/* HEADER */}
      <CHeader position="sticky" className="shadow-sm bg-white z-3">
        <CContainer fluid>
          {/* LOGO */}
          <CHeaderBrand href="/" className="fw-bold fs-4 text-primary">
            <img src="/learning.png" height="40" />
          </CHeaderBrand>

          {/* NAV */}
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

          <div className="d-flex align-items-center gap-3">
            {inf ? (
              <>
                {/* CREATE POST */}
                <CButton color="success" size="sm" className="px-3" onClick={()=>navigate("/new")}>
                  Create Post
                </CButton>

                {/* NOTIFICATION */}
                <div className="position-relative">
                  <CButton
                    className="btn-outline-primary rounded-circle d-flex align-items-center justify-content-center p-2"
                    onClick={() => navigate("/notifications")}
                  >
                    <CIcon icon={cilBell} />
                  </CButton>

                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    3
                  </span>
                </div>

                {/* USER DROPDOWN */}
                <CDropdown alignment="end">
                  <CDropdownToggle
                    color="light"
                    className="p-0 border-0 bg-transparent"
                  >
                    <img
                      src={inf.avatar || DEFAULT_AVATAR}
                      width="32"
                      height="32"
                      className="rounded-circle"
                    />
                  </CDropdownToggle>

                  <CDropdownMenu className="shadow rounded-3 p-2 mt-2">
                    {/* INFO */}
                    <div className="px-3 py-2 border-bottom">
                      <div className="d-flex flex-column">
                        <Link
                          to="/profile"
                          className="text-decoration-none text-nowrap text-black link-primary d-flex flex-column"
                        >
                          <span className="fw-semibold">{inf?.fullName}</span>
                          <small className="text-muted">@{inf?.userName}</small>
                        </Link>
                      </div>
                    </div>

                    {/* MENU */}
                    <CDropdownItem href="/profile">👤 Profile</CDropdownItem>

                    <CDropdownItem href="/my-post">
                      📝 Bài viết của tôi
                    </CDropdownItem>

                    <CDropdownItem
                      onClick={handleLogout}
                      className="text-danger"
                    >
                      🚪 Logout
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </>
            ) : (
              <>
                <CButton color="primary" variant="outline" size="sm">
                  Đăng nhập
                </CButton>

                <CButton color="primary" size="sm">
                  Đăng ký
                </CButton>
              </>
            )}

            {/* SEARCH */}
            <CButton
              color="light"
              variant="ghost"
              onClick={() => setShowSearch(true)}
              className="rounded-circle d-flex align-items-center justify-content-center"
            >
              <CIcon icon={cilSearch} />
            </CButton>
          </div>
        </CContainer>
      </CHeader>

      {/* SEARCH OVERLAY */}
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
                placeholder="Tìm kiếm..."
                className="border-0 shadow-none fs-5"
              />

              <CButton className="ms-3 px-4">Tìm kiếm</CButton>

              <CButton
                color="light"
                variant="ghost"
                className="ms-2"
                onClick={() => setShowSearch(false)}
              >
                <CIcon icon={cilX} />
              </CButton>
            </CForm>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeaderUser;
