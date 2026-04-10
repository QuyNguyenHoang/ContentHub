import { Suspense } from 'react'
import { CSpinner } from '@coreui/react'
import AppRoutes from './routes/AppRoutes'

import './components/layouts/styles/scss/style.scss'
import './components/layouts/styles/scss/examples.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <CSpinner color="primary" />
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  )
}
