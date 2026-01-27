import AppContent from './store/AppContent'
import { AppSidebar, AppHeader, AppFooter } from './store/index'

const adminLayout = () => {
    return (
        <div>
            <AppSidebar />
            <div className="wrapper d-flex flex-column min-vh-100">
                <AppHeader />
                <div className="body flex-grow-1">
                <AppContent/>
                </div>
            <AppFooter/>
            </div>
        </div>
    )
}

export default adminLayout
