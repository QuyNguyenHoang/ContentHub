import { Outlet } from "react-router-dom";
import { AppHeaderUser } from "../layouts/store/userArea/headerUser/indexUser";
import AppFooterUser from "../layouts/store/userArea/footer/AppFooterUser";

const UserLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppHeaderUser />

      <main className="flex-fill container-fluid my-4">
        <div className="row justify-content-center gx-3">
          <div className="col-lg-2 col-12 bg-warning p-3 rounded mb-3 mb-lg-0 d-none d-lg-block me-2" />

          <div className="col-12 col-lg-7 bg-gray text-white p-4 rounded mb-3 mb-lg-0 min-vh-100">
            <Outlet />
          </div>

          <div className="col-lg-2 col-12 bg-danger p-3 rounded d-none d-lg-block ms-2">
            {/* Sidebar phải */}

            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold">Sidebar</h5>
                <ul className="list-unstyled">
                  <li>🔥 Trending</li>
                  <li>📚 Categories</li>
                  <li>🏷 Tags</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AppFooterUser />
    </div>
  );
};

export default UserLayout;
