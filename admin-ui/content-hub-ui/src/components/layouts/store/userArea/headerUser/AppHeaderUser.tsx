import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DecodeToken } from "../../../../../api/extentions/decodeToken";
import { userApi } from "../../../../../api/system/user.api";
import {
  BsArrow90DegDown,
  BsArrowBarLeft,
  BsArrowBarRight,
  BsArrowDown,
  BsBellFill,
  BsBoxArrowInRight,
  BsChevronBarDown,
  BsChevronDown,
  BsFacebook,
  BsHouse,
  BsHouseDoorFill,
  BsHouseExclamation,
  BsInfoCircle,
  BsLightbulb,
  BsLightbulbFill,
  BsList,
  BsMortarboard,
  BsNewspaper,
  BsPeople,
  BsPersonPlus,
  BsPlayBtn,
  BsQuestionCircle,
  BsSearch,
} from "react-icons/bs";

export interface UserInf {
  avatar?: string | null;
  fullName?: string;
  userName: string;
}

const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function AppHeaderUser() {
  const [showOption, setShowOption] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [inf, setInf] = useState<UserInf | null>(null);
  const [authId, setAuthId] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = DecodeToken.accessToken();
    const id = user?.userId;

    if (id) {
      setAuthId(id);
    }
  }, []);

  useEffect(() => {
    if (!authId) return;

    const fetchUser = async () => {
      try {
        const res = await userApi.getById(authId);
        setInf(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, [authId]);

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      setShowSearch(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* HEADER */}
      {/* NavBar */}
      <nav className="container-fluid bg-primary">
        <div className="container d-none d-md-flex justify-content-between align-items-center p-1">
          <div className="d-flex  align-items-center gap-3">
            <div>
              <Link
                to={""}
                className="d-flex flex-row  align-items-center text-decoration-none link-secondary gap-1 text-white "
              >
                <BsQuestionCircle />
                Guid
              </Link>
            </div>

            <div className="d-flex flex-row  align-items-center gap-1 text-white">
              <Link
                to={""}
                className="d-flex flex-row  align-items-center text-decoration-none link-secondary gap-1 text-white "
              >
                <BsFacebook />
                Facebook
              </Link>
            </div>
            <div className="d-flex flex-row  align-items-center gap-1 text-white">
              <Link
                to={""}
                className="d-flex flex-row  align-items-center text-decoration-none link-secondary gap-1 text-white "
              >
                <BsInfoCircle />
                About Me
              </Link>
            </div>
            <div className="d-flex flex-row  align-items-center gap-1 text-white">
              <Link
                to={""}
                className="d-flex flex-row  align-items-center text-decoration-none link-secondary gap-1 text-white "
              >
                <BsPlayBtn />
                Short
              </Link>
            </div>
            <div className="d-flex flex-row  align-items-center gap-1 text-white">
              <Link
                to={""}
                className="d-flex flex-row  align-items-center text-decoration-none link-secondary gap-1 text-white "
              >
                CONTENT HUB
              </Link>
            </div>
          </div>
          {!inf && (
            <div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-sm btn-outline-light rounded-pill fw-bold d-flex align-items-center gap-1"
                  onClick={() => navigate("/login")}
                >
                  <BsBoxArrowInRight />
                  <span>Login</span>
                </button>
                <button className="btn btn-sm btn-outline-light rounded-pill fw-bold d-flex align-items-center gap-1">
                  <BsPersonPlus />
                  <span>Register</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <header className="sticky-top bg-white shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center py-2">
            {/* LOGO */}
            <Link
              to="/"
              className="fw-bold fs-4 text-primary text-decoration-none"
            >
              <img src="/learning.png" height={40} alt="Logo" />
            </Link>

            {/* NAV */}
            <nav className="ms-4 d-none d-md-flex">
              <ul className="navbar-nav flex-row gap-3 fw-bold">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Trang chủ
                  </Link>
                </li>
                 <li className="nav-item">
                  <Link className="nav-link" to="/courses">
                     Portfolio
                  </Link>
                </li>
                

                <li className="nav-item">
                  <Link className="nav-link" to="/posts">
                    Tin tức
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">
                     Tài liệu
                  </Link>
                </li>
                

                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    Về chúng tôi
                  </Link>
                </li>
              </ul>
            </nav>

            {/* RIGHT SIDE */}
            <div className="ms-auto d-flex align-items-center gap-3">
              {inf && (
                <>
                  <button
                    className="btn btn-success btn-sm px-3"
                    onClick={() => navigate("/new")}
                  >
                    Create Post
                  </button>

                  <div className="d-flex justify-content-center">
                    {/* Search */}
                    <button
                      className="btn btn-light rounded-circle"
                      onClick={() => setShowSearch(true)}
                    >
                      <BsSearch />
                    </button>
                    {/* Mobile */}
                    <button
                      className="d-flex d-md-none justify-content-end btn btn-lg"
                      onClick={() => setShowOption(true)}
                    >
                      <BsList />
                    </button>
                  </div>
                  {/* Notification +  Avatar  */}
                  <div className="d-none d-md-flex gap-3">
                    {/* Notification */}
                    <div className="position-relative">
                      <button
                        className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center shadow-sm"
                        onClick={() => navigate("/notifications")}
                      >
                        <BsBellFill size={18} />
                      </button>

                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{
                          fontSize: "0.65rem",
                          minWidth: "18px",
                          height: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        3
                      </span>
                    </div>
                    {/* Dropdown */}
                    <div className="dropdown">
                      <button
                        className="btn p-0 border-0 bg-transparent"
                        data-bs-toggle="dropdown"
                      >
                        <img
                          src={inf.avatar || DEFAULT_AVATAR}
                          width={32}
                          height={32}
                          className="rounded-circle"
                          alt="avatar"
                        />
                      </button>

                      <ul className="dropdown-menu dropdown-menu-end shadow">
                        <li className="px-3 py-2 border-bottom">
                          <Link
                            to="/profile"
                            className="text-decoration-none text-dark"
                          >
                            <div className="fw-semibold">{inf.fullName}</div>

                            <small className="text-muted">
                              @{inf.userName}
                            </small>
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" to="/profile">
                            👤 Profile
                          </Link>
                        </li>

                        <li>
                          <Link className="dropdown-item" to="/my-post">
                            📝 Bài viết của tôi
                          </Link>
                        </li>

                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={handleLogout}
                          >
                            🚪 Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Options in mobile */}
        {showOption && (
          <div
            className="offcanvas-backdrop fade show"
            onClick={() => setShowOption(false)}
          ></div>
        )}
        <div
          className={`offcanvas offcanvas-end offcanvas-lg bg-light  ${showOption ? "show" : ""}`}
          style={{
            visibility: showOption ? "visible" : "hidden",
            width: "70vw",
          }}
        >
          <button
            className="btn  btn-close ms-auto p-2"
            onClick={() => setShowOption(false)}
          ></button>
          <ul className="list-unstyled d-flex flex-column gap-2 px-3">
            {/* Home */}
            <li>
              <Link
                className="d-flex align-items-center gap-2 text-dark fw-bold text-decoration-none"
                to="/"
              >
                <BsHouseDoorFill />
                Trang chủ
              </Link>
            </li>

            {/* <li>
              <button
                className="btn w-100 d-flex justify-content-between align-items-center text-dark fw-bold p-0"
                data-bs-toggle="collapse"
                data-bs-target="#courseMenu"
              >
                <div className="d-flex align-items-center gap-2">
                  <BsMortarboard />
                  Khóa học
                </div>
                <BsChevronDown/>
              </button>

              <ul id="courseMenu" className="collapse list-unstyled ps-4 mt-2">
                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Tất cả khóa học
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Lộ trình học
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Giảng viên
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Combo khóa học
                  </Link>
                </li>
              </ul>
            </li> */}
            <li>
              <button
                className="btn w-100 d-flex justify-content-between align-items-center text-dark fw-bold p-0"
                data-bs-toggle="collapse"
                data-bs-target="#courseMenu"
              >
                <div className="d-flex align-items-center gap-2">
                  <BsLightbulb />
                  Kiến Thức
                </div>
                <BsChevronDown />
              </button>

              <ul id="courseMenu" className="collapse list-unstyled ps-4 mt-2">
                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Bài viết
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Sổ tay kỹ thuật
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Ebook
                  </Link>
                </li>
              </ul>
            </li>
            {/* Knowledge */}
            <li>
              <button
                className="btn w-100 d-flex justify-content-between align-items-center text-dark fw-bold p-0"
                data-bs-toggle="collapse"
                data-bs-target="#courseMenu"
              >
                <div className="d-flex align-items-center gap-2">
                  <BsMortarboard />
                  Khóa học
                </div>
                <BsChevronDown />
              </button>

              <ul id="courseMenu" className="collapse list-unstyled ps-4 mt-2">
                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Tất cả khóa học
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Lộ trình học
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Giảng viên
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Combo khóa học
                  </Link>
                </li>
              </ul>
            </li>
            {/* Profile */}
            <li>
              <button
                className="btn w-100 d-flex justify-content-between align-items-center text-dark fw-bold p-0"
                data-bs-toggle="collapse"
                data-bs-target="#courseMenu"
              >
                <div className="d-flex align-items-center gap-2">
                  <BsPeople />
                  Profile
                </div>
                <BsChevronDown />
              </button>

              <ul id="courseMenu" className="collapse list-unstyled ps-4 mt-2">
                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Tài khoản
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Bảo mật
                  </Link>
                </li>

                <li>
                  <Link
                    className="d-flex align-items-center gap-2 text-dark text-decoration-none py-1"
                    to=""
                  >
                    Tài liệu của tôi
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              {inf ? (
                <div>
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      className="btn btn-sm btn-outline-danger rounded-pill fw-bold d-flex align-items-center gap-1"
                      onClick={() => handleLogout()}
                    >
                      <span className="text-danger">Logout</span>
                      <BsArrowBarRight color="red" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between gap-2 px-5">
                    <button
                      className="btn btn-sm btn-outline-success  rounded-pill fw-bold d-flex justify-content-center align-items-center gap-1 w-100"
                      onClick={() => navigate("/login")}
                    >
                      <BsBoxArrowInRight />
                      <span>Login</span>
                    </button>
                    <button className="btn btn-sm btn-outline-primary  rounded-pill fw-bold d-flex  justify-content-center align-items-center gap-1 w-100">
                      <BsPersonPlus />
                      <span>Register</span>
                    </button>
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      {showSearch && (
        <div
          ref={overlayRef}
          className="search-overlay"
          style={{zIndex:"2000"}}
          onClick={handleOverlayClick}
        >
          <div className="container-fluid shadow-lg rounded-2 bg-light">
            <form className="d-flex align-items-center p-3">
              <input
                ref={inputRef}
                type="search"
                className="form-control border-0 shadow-none"
                placeholder="Tìm kiếm..."
              />

              <button
                type="submit"
                className="btn btn-sm btn-outline-primary ms-2 text-nowrap rounded-pill"
              >
                Tìm kiếm
              </button>

              <button
                type="button"
                className="btn btn-close btn-light ms-2"
                onClick={() => setShowSearch(false)}
              ></button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
