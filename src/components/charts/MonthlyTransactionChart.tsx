/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect, useRef } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarController,
  type ChartData,
} from "chart.js"
import { Calendar, Download, TrendingUp, Filter } from "lucide-react"

// Registering Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController)

interface Transaction {
  transactionDate: string
  amount: number
  transactionType: "CASH_DEPOSIT" | "CASH_WITHDRAWAL" | "CASH_TRANSFER" | "CASH_CREDIT"
  targetAccountNumber?: string
}

interface Props {
  transactions: Transaction[]
}

export default function MonthlyTransactionChart({ transactions }: Props) {
  const [animateChart, setAnimateChart] = useState(false)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [showAllMonths, setShowAllMonths] = useState(true)
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const chartRef = useRef<any>(null)

  // Extract unique years from transactions
  const years = [...new Set(transactions.map((t) => new Date(t.transactionDate).getFullYear()))].sort((a, b) => b - a)

  // Trigger animation on initial load
  useEffect(() => {
    setTimeout(() => setAnimateChart(true), 500)
  }, [])

  // Group transactions by month and year
  const grouped: Record<
    string,
    { [key in "CASH_DEPOSIT" | "CASH_WITHDRAWAL" | "CASH_TRANSFER" | "CASH_CREDIT"]: number }
  > = {}

  transactions
    .filter((t) => new Date(t.transactionDate).getFullYear() === selectedYear)
    .forEach((t) => {
      const monthYear = new Date(t.transactionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
      if (!grouped[monthYear]) {
        grouped[monthYear] = { CASH_DEPOSIT: 0, CASH_WITHDRAWAL: 0, CASH_TRANSFER: 0, CASH_CREDIT: 0 }
      }
      grouped[monthYear][t.transactionType] += t.amount
    })

  // Sort months based on the Date
  const allMonths = Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())

  // Filter months if not showing all
  const sortedMonths = showAllMonths ? allMonths : allMonths.filter((month) => selectedMonths.includes(month))

  // Calculate totals for each transaction type
  const totals = {
    deposit: sortedMonths.reduce((sum, month) => sum + grouped[month].CASH_DEPOSIT, 0),
    withdrawal: sortedMonths.reduce((sum, month) => sum + grouped[month].CASH_WITHDRAWAL, 0),
    transfer: sortedMonths.reduce((sum, month) => sum + grouped[month].CASH_TRANSFER, 0),
    credit: sortedMonths.reduce((sum, month) => sum + grouped[month].CASH_CREDIT, 0),
  }

  // Prepare data for the Bar chart
  const data: ChartData<"bar"> = {
    labels: sortedMonths.map((m) => m.split(" ")[0]), // Just show month name without year
    datasets: [
      {
        label: "Deposit",
        data: sortedMonths.map((m) => grouped[m].CASH_DEPOSIT),
        backgroundColor: "rgba(16, 185, 129, 0.7)", // Emerald
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "rgb(16, 185, 129)",
      },
      {
        label: "Withdrawal",
        data: sortedMonths.map((m) => grouped[m].CASH_WITHDRAWAL),
        backgroundColor: "rgba(244, 63, 94, 0.7)", // Rose
        borderColor: "rgb(244, 63, 94)",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "rgb(244, 63, 94)",
      },
      {
        label: "Transfer",
        data: sortedMonths.map((m) => grouped[m].CASH_TRANSFER),
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Blue
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "rgb(59, 130, 246)",
      },
      {
        label: "Credit",
        data: sortedMonths.map((m) => grouped[m].CASH_CREDIT),
        backgroundColor: "rgba(139, 92, 246, 0.7)", // Purple
        borderColor: "rgb(139, 92, 246)",
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: "rgb(139, 92, 246)",
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
      link.download = `Monthly-Transactions-${selectedYear}.png`
      link.href = url
      link.click()
    }
  }

  // Handle month selection
  const toggleMonth = (month: string) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter((m) => m !== month))
    } else {
      setSelectedMonths([...selectedMonths, month])
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
        <div className="absolute -left-6 bottom-0 h-16 w-16 rounded-full bg-white/10"></div>
        <h2 className="relative flex items-center gap-2 text-xl font-bold">
          <Calendar className="h-5 w-5" /> Monthly Transaction Analysis
        </h2>
        <p className="relative mt-1 text-sm text-blue-100">Compare your monthly transaction patterns</p>
      </div>

      <div className="p-6">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(Number(e.target.value))
                  setAnimateChart(false)
                  setTimeout(() => setAnimateChart(true), 50)
                }}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>

            <button
              onClick={() => setShowAllMonths(!showAllMonths)}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
            >
              <Filter className="h-4 w-4" /> {showAllMonths ? "Filter Months" : "Show All"}
            </button>
          </div>

          <button
            onClick={downloadChart}
            className="flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 transition-all hover:bg-indigo-100"
          >
            <Download className="h-4 w-4" /> Download Chart
          </button>
        </div>

        {/* Month Filter */}
        {!showAllMonths && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-medium text-gray-700">Select Months to Display:</h3>
            <div className="flex flex-wrap gap-2">
              {allMonths.map((month) => (
                <button
                  key={month}
                  onClick={() => toggleMonth(month)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedMonths.includes(month)
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {month.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {sortedMonths.length > 0 ? (
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
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
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
                    <TrendingUp className="h-4 w-4 text-rose-600" />
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
                    <TrendingUp className="h-4 w-4 text-blue-600" />
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
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="relative h-96 w-full">
              <Bar ref={chartRef} data={data} options={options} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">No Data Available</h3>
            <p className="text-gray-500">
              {!showAllMonths && selectedMonths.length === 0
                ? "Please select at least one month to display data."
                : `There are no transactions recorded for ${selectedYear}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
