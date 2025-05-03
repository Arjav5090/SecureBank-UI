/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { TrendingUp, Calendar, Download, RefreshCw } from "lucide-react"

// Registering the necessary components for Chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler)

interface Transaction {
  transactionDate: string
  amount: number
}

interface Props {
  transactions: Transaction[]
}

export default function TransactionChart({ transactions }: Props) {
  const [animateChart, setAnimateChart] = useState(false)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year" | "all">("month")
  const chartRef = useRef<any>(null)

  // Trigger animation on initial load
  useEffect(() => {
    setTimeout(() => setAnimateChart(true), 500)
  }, [])

  // Filter transactions based on time range
  const filteredTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.transactionDate)
    const now = new Date()

    if (timeRange === "week") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(now.getDate() - 7)
      return transactionDate >= oneWeekAgo
    } else if (timeRange === "month") {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(now.getMonth() - 1)
      return transactionDate >= oneMonthAgo
    } else if (timeRange === "year") {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      return transactionDate >= oneYearAgo
    }

    return true // "all" time range
  })

  // Sort transactions by date
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime(),
  )

  // Group transactions by date
  const groupedByDate: Record<string, number> = {}
  sortedTransactions.forEach((t) => {
    const dateStr = new Date(t.transactionDate).toLocaleDateString()
    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = 0
    }
    groupedByDate[dateStr] += t.amount
  })

  // Get dates and amounts for chart
  const dates = Object.keys(groupedByDate)
  const amounts = Object.values(groupedByDate)

  // Calculate statistics
  const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0)
  const averageAmount = amounts.length > 0 ? totalAmount / amounts.length : 0
  const maxAmount = Math.max(...(amounts.length > 0 ? amounts : [0]))
  const minAmount = Math.min(...(amounts.length > 0 ? amounts : [0]))

  // Format dates based on time range
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    if (timeRange === "week") {
      return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric" })
    } else if (timeRange === "month") {
      return date.toLocaleDateString("en-US", { day: "numeric", month: "short" })
    } else if (timeRange === "year") {
      return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" })
    }
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  // Prepare the chart data
  const data = {
    labels: dates.map(formatDate),
    datasets: [
      {
        label: "Transaction Amount",
        data: amounts,
        borderColor: "rgba(59, 130, 246, 1)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4, // Smooth curve
        pointBackgroundColor: "rgba(59, 130, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "rgba(59, 130, 246, 1)",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  }

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value: any) => "$" + value.toLocaleString(),
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.8)",
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const value = context.raw || 0
            return `Amount: $${value.toLocaleString()}`
          },
        },
      },
    },
    animation: {
      duration: animateChart ? 1500 : 0,
      easing: "easeOutQuart",
    },
  }

  // Function to download chart as image
  const downloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image()
      const link = document.createElement("a")
      link.download = `Transaction-Trend-${timeRange}.png`
      link.href = url
      link.click()
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
        <div className="absolute -left-6 bottom-0 h-16 w-16 rounded-full bg-white/10"></div>
        <h2 className="relative flex items-center gap-2 text-xl font-bold">
          <TrendingUp className="h-5 w-5" /> Transaction Trend Analysis
        </h2>
        <p className="relative mt-1 text-sm text-blue-100">Track your transaction patterns over time</p>
      </div>

      <div className="p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setTimeRange("week")
                setAnimateChart(false)
                setTimeout(() => setAnimateChart(true), 50)
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                timeRange === "week" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => {
                setTimeRange("month")
                setAnimateChart(false)
                setTimeout(() => setAnimateChart(true), 50)
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                timeRange === "month" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Last Month
            </button>
            <button
              onClick={() => {
                setTimeRange("year")
                setAnimateChart(false)
                setTimeout(() => setAnimateChart(true), 50)
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                timeRange === "year" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Last Year
            </button>
            <button
              onClick={() => {
                setTimeRange("all")
                setAnimateChart(false)
                setTimeout(() => setAnimateChart(true), 50)
              }}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                timeRange === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Time
            </button>
          </div>

          <button
            onClick={downloadChart}
            className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-all hover:bg-blue-100"
          >
            <Download className="h-4 w-4" /> Download Chart
          </button>
        </div>

        {dates.length > 0 ? (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600">Total Volume</p>
                    <p className="text-lg font-bold text-blue-700">${totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600">Average</p>
                    <p className="text-lg font-bold text-emerald-700">
                      ${averageAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <RefreshCw className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-purple-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-purple-600">Highest</p>
                    <p className="text-lg font-bold text-purple-700">${maxAmount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-amber-600">Lowest</p>
                    <p className="text-lg font-bold text-amber-700">${minAmount.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-amber-100 p-2">
                    <Calendar className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Chart */}
            <div className="relative h-96 w-full">
              <Line ref={chartRef} data={data} options={options} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">No Data Available</h3>
            <p className="text-gray-500">There are no transactions recorded for the selected time period.</p>
          </div>
        )}
      </div>
    </div>
  )
}
