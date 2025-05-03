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
} from "chart.js"
import { Calendar, Download, Filter, RefreshCw } from "lucide-react"

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend)

interface Transaction {
  transactionDate: string
  amount: number
  transactionType: "CASH_DEPOSIT" | "CASH_WITHDRAWAL" | "CASH_TRANSFER" | "CASH_CREDIT"
  targetAccountNumber?: string
}

interface Props {
  transactions: Transaction[]
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function TransactionLineChart({ transactions }: Props) {
  const currentYear = new Date().getFullYear()
  const currentMonth = months[new Date().getMonth()]
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth)
  const [animateChart, setAnimateChart] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "CASH_DEPOSIT",
    "CASH_WITHDRAWAL",
    "CASH_TRANSFER",
    "CASH_CREDIT",
  ])
  const chartRef = useRef<any>(null)

  // Extracting unique years from the transaction data
  const years = [...new Set(transactions.map((t) => new Date(t.transactionDate).getFullYear()))].sort((a, b) => b - a)

  // Trigger animation on initial load
  useEffect(() => {
    setTimeout(() => setAnimateChart(true), 500)
  }, [])

  // Filter transactions based on the selected year and month
  const filtered = transactions.filter((t) => {
    const d = new Date(t.transactionDate)
    return d.getFullYear() === selectedYear && months[d.getMonth()] === selectedMonth
  })

  // Group transactions by date and categorize by transaction type
  const grouped: any = {}
  filtered.forEach((t) => {
    const dateStr = new Date(t.transactionDate).toLocaleDateString()
    if (!grouped[dateStr]) {
      grouped[dateStr] = { CASH_DEPOSIT: 0, CASH_WITHDRAWAL: 0, CASH_TRANSFER: 0, CASH_CREDIT: 0 }
    }
    grouped[dateStr][t.transactionType] += t.amount
  })

  // Sorting the dates for the x-axis
  const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  // Calculate totals for each transaction type
  const totals = {
    deposit: sortedDates.reduce((sum, date) => sum + grouped[date].CASH_DEPOSIT, 0),
    withdrawal: sortedDates.reduce((sum, date) => sum + grouped[date].CASH_WITHDRAWAL, 0),
    transfer: sortedDates.reduce((sum, date) => sum + grouped[date].CASH_TRANSFER, 0),
    credit: sortedDates.reduce((sum, date) => sum + grouped[date].CASH_CREDIT, 0),
  }

  // Toggle transaction type selection
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        // Don't allow deselecting all types
        setSelectedTypes(selectedTypes.filter((t) => t !== type))
      }
    } else {
      setSelectedTypes([...selectedTypes, type])
    }
    setAnimateChart(false)
    setTimeout(() => setAnimateChart(true), 50)
  }

  // Format dates for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { day: "numeric" })
  }

  // Prepare chart data
  const data = {
    labels: sortedDates.map(formatDate),
    datasets: [
      {
        label: "Deposit",
        data: selectedTypes.includes("CASH_DEPOSIT") ? sortedDates.map((d) => grouped[d].CASH_DEPOSIT) : [],
        borderColor: "rgb(16, 185, 129)", // Emerald
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "rgb(16, 185, 129)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !selectedTypes.includes("CASH_DEPOSIT"),
      },
      {
        label: "Withdrawal",
        data: selectedTypes.includes("CASH_WITHDRAWAL") ? sortedDates.map((d) => grouped[d].CASH_WITHDRAWAL) : [],
        borderColor: "rgb(244, 63, 94)", // Rose
        backgroundColor: "rgba(244, 63, 94, 0.5)",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "rgb(244, 63, 94)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !selectedTypes.includes("CASH_WITHDRAWAL"),
      },
      {
        label: "Transfer",
        data: selectedTypes.includes("CASH_TRANSFER") ? sortedDates.map((d) => grouped[d].CASH_TRANSFER) : [],
        borderColor: "rgb(59, 130, 246)", // Blue
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !selectedTypes.includes("CASH_TRANSFER"),
      },
      {
        label: "Credit",
        data: selectedTypes.includes("CASH_CREDIT") ? sortedDates.map((d) => grouped[d].CASH_CREDIT) : [],
        borderColor: "rgb(139, 92, 246)", // Purple
        backgroundColor: "rgba(139, 92, 246, 0.5)",
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: "rgb(139, 92, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        hidden: !selectedTypes.includes("CASH_CREDIT"),
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
        title: {
          display: true,
          text: "Day of Month",
          color: "#6b7280",
          font: {
            size: 12,
            weight: "bold" as const,
          },
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
        title: {
          display: true,
          text: "Amount (₹)",
          color: "#6b7280",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
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
        displayColors: true,
        usePointStyle: true,
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || ""
            const value = context.raw || 0
            return `${label}: $${value.toLocaleString()}`
          },
        },
      },
    },
    animation: {
      duration: animateChart ? 1000 : 0,
    },
  }

  // Function to download chart as image
  const downloadChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image()
      const link = document.createElement("a")
      link.download = `Daily-Transactions-${selectedMonth}-${selectedYear}.png`
      link.href = url
      link.click()
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
        <div className="absolute -left-6 bottom-0 h-16 w-16 rounded-full bg-white/10"></div>
        <h2 className="relative flex items-center gap-2 text-xl font-bold">
          <Calendar className="h-5 w-5" /> Daily Transaction Breakdown
        </h2>
        <p className="relative mt-1 text-sm text-purple-100">Analyze your daily transaction patterns</p>
      </div>

      <div className="p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value)
                  setAnimateChart(false)
                  setTimeout(() => setAnimateChart(true), 50)
                }}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value))
                  setAnimateChart(false)
                  setTimeout(() => setAnimateChart(true), 50)
                }}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <button
            onClick={downloadChart}
            className="flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-600 transition-all hover:bg-purple-100"
          >
            <Download className="h-4 w-4" /> Download Chart
          </button>
        </div>

        {/* Transaction Type Filters */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Filter by Transaction Type:</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => toggleType("CASH_DEPOSIT")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedTypes.includes("CASH_DEPOSIT")
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedTypes.includes("CASH_DEPOSIT") ? "bg-emerald-500" : "bg-gray-400"
                }`}
              ></span>
              Deposits
            </button>
            <button
              onClick={() => toggleType("CASH_WITHDRAWAL")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedTypes.includes("CASH_WITHDRAWAL")
                  ? "bg-rose-100 text-rose-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedTypes.includes("CASH_WITHDRAWAL") ? "bg-rose-500" : "bg-gray-400"
                }`}
              ></span>
              Withdrawals
            </button>
            <button
              onClick={() => toggleType("CASH_TRANSFER")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedTypes.includes("CASH_TRANSFER")
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedTypes.includes("CASH_TRANSFER") ? "bg-blue-500" : "bg-gray-400"
                }`}
              ></span>
              Transfers
            </button>
            <button
              onClick={() => toggleType("CASH_CREDIT")}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedTypes.includes("CASH_CREDIT")
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  selectedTypes.includes("CASH_CREDIT") ? "bg-purple-500" : "bg-gray-400"
                }`}
              ></span>
              Credits
            </button>
          </div>
        </div>

        {sortedDates.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-emerald-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600">Total Deposits</p>
                    <p className="text-lg font-bold text-emerald-700">${totals.deposit.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <RefreshCw className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-rose-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-rose-600">Total Withdrawals</p>
                    <p className="text-lg font-bold text-rose-700">${totals.withdrawal.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-rose-100 p-2">
                    <RefreshCw className="h-4 w-4 text-rose-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600">Total Transfers</p>
                    <p className="text-lg font-bold text-blue-700">${totals.transfer.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2">
                    <RefreshCw className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-purple-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-purple-600">Total Credits</p>
                    <p className="text-lg font-bold text-purple-700">${totals.credit.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-2">
                    <RefreshCw className="h-4 w-4 text-purple-600" />
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
            <p className="text-gray-500">
              There are no transactions recorded for {selectedMonth} {selectedYear}.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
