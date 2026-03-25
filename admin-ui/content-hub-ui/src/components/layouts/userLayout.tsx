import { Outlet } from "react-router-dom";
import { AppHeaderUser } from "../layouts/store/userArea/headerUser/indexUser";
import AppFooterUser from "../layouts/store/userArea/footer/AppFooterUser";

const UserLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* HEADER */}
      <AppHeaderUser />

      {/* MAIN */}
      <main className="flex-fill py-4 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-12">
              <div className="bg-white p-4 rounded shadow-sm">
                <Outlet />
              </div>
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