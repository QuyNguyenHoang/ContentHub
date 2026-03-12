import { useEffect, useState } from 'react'
import { pingApi } from '../../api/testApi'
import type { PingResponse } from '../../api/testApi'
import { CAlert, CSpinner } from '@coreui/react'
import './../../../../content-hub-ui/src/index.css'
const ApiTest = () => {
  console.log('API URL =', import.meta.env.VITE_API_URL)

  const [data, setData] = useState<PingResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('ApiTest mounted')

    pingApi()
      .then(res => {
        console.log('API RESPONSE:', res) // 👈 DEBUG QUAN TRỌNG
        setData(res)
      })
      .catch(err => {
        console.error(err)
        setError('Không kết nối được API')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <CSpinner color="primary" />

  if (error) return <CAlert color="danger">{error}</CAlert>

  return (
    <CAlert color="success">
      <strong>{data?.message}</strong>
      <div>Server time: {data?.time}</div>
    </CAlert>
  )
}

export default ApiTest
