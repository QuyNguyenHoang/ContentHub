import { Outlet } from "react-router-dom";
import { AppHeaderUser } from "../layouts/store/userArea/headerUser/indexUser";
import AppFooterUser from "../layouts/store/userArea/footer/AppFooterUser";

const UserLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* HEADER */}
      <AppHeaderUser />

      {/* MAIN */}
      <main className="flex-fill bg-light py-3">
        <div className="container-fluid">
          <div className="row">
            {/* CONTENT */}
            <div className="col-12 ">
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <AppFooterUser />
    </div>
  );
};

export default UserLayout;
