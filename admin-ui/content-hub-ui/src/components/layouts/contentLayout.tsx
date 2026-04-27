import { Outlet } from "react-router-dom";
import { AppHeaderUser } from "../layouts/store/userArea/headerUser/indexUser";
import AppFooterUser from "../layouts/store/userArea/footer/AppFooterUser";

const ContentLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">

      {/* HEADER */}
      <AppHeaderUser />

      {/* MAIN */}
      <main className="flex-fill bg-light">
        <div className="container-fluid">
          <div className="row">

            {/* LEFT NAV */}
            <div className="d-none d-md-block col-md-1 bg-white border-end">
              <div className="position-sticky top-0 vh-100 p-3">
                <h6>Left Nav</h6>
              </div>
            </div>

            {/* CONTENT */}
            <div className="col-12 col-md-8 py-3 pb-5">
              <div className="bg-white p-4 rounded shadow-sm">
                <Outlet />
              </div>
            </div>

            {/* RIGHT NAV */}
            <div className="d-none d-md-block col-md-3 bg-white border-start">
              <div className="position-sticky top-0 vh-100 p-3">
                <h6>Right Nav</h6>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <AppFooterUser />

      {/* MOBILE NAV */}
      <div className="d-md-none position-fixed bottom-0 start-0 w-100 bg-white border-top shadow p-2">
        <div className="d-flex justify-content-around">
          <span>🏠</span>
          <span>🔍</span>
          <span>👤</span>
        </div>
      </div>

    </div>
  );
};

export default ContentLayout;