import { Outlet } from "react-router-dom"
import { AppHeaderUser } from "./store/userArea/headerUser/indexUser"
import AppFooterUser from "./store/userArea/footer/AppFooterUser"

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const UserLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">

  
      <AppHeaderUser />


      <main className="flex-fill container my-4">
        <Outlet />
        <div className="min-vh-100">
          <p>tét</p>
        </div>
      </main>

      <AppFooterUser />

    </div>
  )
}

export default UserLayout