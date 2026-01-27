import { Suspense } from 'react'
import { CSpinner } from '@coreui/react'
import AppRoutes from './routes/AppRoutes'

import './components/layouts/styles/scss/style.scss'
import './components/layouts/styles/scss/examples.scss'
export default function App() {
  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center vh-100">
          <CSpinner color="primary" />
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  )
}
