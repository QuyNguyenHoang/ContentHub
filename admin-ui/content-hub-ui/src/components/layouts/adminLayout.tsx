import AppContent from './store/AppContent'
import { AppSidebar, AppHeader, AppFooter } from './store/index'

const adminLayout = () => {
  return (
    <div className="d-flex">
      <AppSidebar />

      <div className="wrapper d-flex flex-column min-vh-100 grow">
        <AppHeader />

        <div className="body grow">
          <AppContent />
        </div>

        <AppFooter />
      </div>
    </div>
  )
}

export default adminLayout