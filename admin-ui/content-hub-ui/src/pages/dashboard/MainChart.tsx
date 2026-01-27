import { useEffect, useMemo, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'
import type { Chart as ChartJS } from 'chart.js'

const MainChart = () => {
  const chartRef = useRef<ChartJS<'line'> | null>(null)

  // =========================
  // Mock data (sau này thay bằng API)
  // =========================
  const labels = useMemo(
    () => ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    [],
  )

  const datasets = useMemo(
    () => [
      {
        label: 'Visits',
        backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
        borderColor: getStyle('--cui-info'),
        pointHoverBackgroundColor: getStyle('--cui-info'),
        borderWidth: 2,
        fill: true,
        data: [120, 140, 180, 130, 170, 160, 190],
      },
      {
        label: 'Unique Users',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-success'),
        pointHoverBackgroundColor: getStyle('--cui-success'),
        borderWidth: 2,
        data: [90, 110, 150, 100, 140, 130, 155],
      },
      {
        label: 'Bounce Rate',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-danger'),
        pointHoverBackgroundColor: getStyle('--cui-danger'),
        borderWidth: 1,
        borderDash: [8, 5],
        data: [65, 65, 65, 65, 65, 65, 65],
      },
    ],
    [],
  )

  // =========================
  // Theme sync (dark/light)
  // =========================
  useEffect(() => {
    const handleColorSchemeChange = () => {
      const chart = chartRef.current
      if (!chart) return

      const borderColor = getStyle('--cui-border-color-translucent')
      const textColor = getStyle('--cui-body-color')

      // X axis
      chart.options.scales!.x!.grid!.color = borderColor
      chart.options.scales!.x!.ticks!.color = textColor
      chart.options.scales!.x!.border!.color = borderColor

      // Y axis
      chart.options.scales!.y!.grid!.color = borderColor
      chart.options.scales!.y!.ticks!.color = textColor
      chart.options.scales!.y!.border!.color = borderColor

      chart.update()
    }

    document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)

    return () => {
      document.documentElement.removeEventListener('ColorSchemeChange', handleColorSchemeChange)
    }
  }, [])

  return (
    <CChartLine
      ref={chartRef}
      style={{ height: '300px', marginTop: '40px' }}
      data={{
        labels,
        datasets,
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false, // Dashboard style
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
              drawOnChartArea: false,
            },
            border: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
          y: {
            beginAtZero: true,
            max: 250,
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            border: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
              maxTicksLimit: 5,
              stepSize: Math.ceil(250 / 5),
            },
          },
        },
        elements: {
          line: {
            tension: 0.4, // smooth line
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      }}
    />
  )
}

export default MainChart
