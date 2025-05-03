/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Calendar, ArrowLeft, ArrowRight, DollarSign, TrendingUp, TrendingDown, RefreshCcw } from "lucide-react"

// Registering the Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

interface Transaction {
  transactionDate: string
  amount: number
  transactionType: "CASH_DEPOSIT" | "CASH_WITHDRAWAL" | "CASH_TRANSFER" | "CASH_CREDIT"
  targetAccountNumber?: string
}

interface Props {
  transactions: Transaction[]
}

export default function DailyTransactionPieChart({ transactions }: Props) {
  // Default to today's date
  const today = new Date().toISOString().slice(0, 10)
  const [selectedDate, setSelectedDate] = useState<string>(today)
  const [animateChart, setAnimateChart] = useState(false)

  // Function to go to previous day
  const goToPreviousDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - 1)
    setSelectedDate(date.toISOString().slice(0, 10))
    resetAnimation()
  }

  // Function to go to next day
  const goToNextDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + 1)
    setSelectedDate(date.toISOString().slice(0, 10))
    resetAnimation()
  }

  // Reset animation when date changes
  const resetAnimation = () => {
    setAnimateChart(false)
    setTimeout(() => setAnimateChart(true), 50)
  }

  // Trigger animation on initial load
  useEffect(() => {
    setTimeout(() => setAnimateChart(true), 500)
  }, [])

  // Filter transactions based on the selected date
  const filtered = transactions.filter((t) => {
    const d = new Date(t.transactionDate).toISOString().slice(0, 10)
    return d === selectedDate
  })

  // Calculate totals for each transaction type
  const typeTotals = { Deposit: 0, Withdrawal: 0, Transfer: 0, Credit: 0 }
  filtered.forEach((t) => {
    const type = t.transactionType.replace("CASH_", "").toLowerCase()
    if (type === "transfer") typeTotals.Credit += t.amount
    else typeTotals[type.charAt(0).toUpperCase() + type.slice(1)] += t.amount
  })

  // Calculate total amount for the day
  const totalAmount = Object.values(typeTotals).reduce((sum, amount) => sum + amount, 0)

  // Format date for display
  const formattedDate = new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Data to be passed to Pie chart
  const data = {
    labels: Object.keys(typeTotals),
    datasets: [
      {
        data: Object.values(typeTotals),
        backgroundColor: ["#10b981", "#f43f5e", "#3b82f6", "#8b5cf6"], // Emerald, Rose, Blue, Purple
        borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2,
        hoverBackgroundColor: ["#059669", "#e11d48", "#2563eb", "#7c3aed"], // Darker versions
        hoverBorderColor: "#ffffff",
        borderRadius: 4,
      },
    ],
  }

  // Chart options for responsiveness and styling
  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
            const label = context.label || ""
            const value = context.raw || 0
            const percentage = ((value / totalAmount) * 100).toFixed(1)
            return `${label}: $${value.toLocaleString()} (${percentage}%)`
          },
        },
      },
    },
    animation: {
      animateScale: animateChart,
      animateRotate: animateChart,
      duration: 1000,
    },
    cutout: "50%", // Donut style
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden border-b border-gray-100 bg-gradient-to-r from-emerald-500 to-blue-500 p-6 text-white">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10"></div>
        <div className="absolute -left-6 bottom-0 h-16 w-16 rounded-full bg-white/10"></div>
        <h2 className="relative flex items-center gap-2 text-xl font-bold">
          <Calendar className="h-5 w-5" /> Daily Transaction Summary
        </h2>
        <p className="relative mt-1 text-sm text-blue-100">View your daily transaction breakdown</p>
      </div>

      <div className="p-6">
        {/* Date Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={goToPreviousDay}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </button>

          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                resetAnimation()
              }}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Calendar className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <button
            onClick={goToNextDay}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
          >
            Next <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Date Display */}
        

        {filtered.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-emerald-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-emerald-600">Deposits</p>
                    <p className="text-lg font-bold text-emerald-700">${typeTotals.Deposit.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-rose-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-rose-600">Withdrawals</p>
                    <p className="text-lg font-bold text-rose-700">${typeTotals.Withdrawal.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-rose-100 p-2">
                    <TrendingDown className="h-4 w-4 text-rose-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-blue-600">Transfers</p>
                    <p className="text-lg font-bold text-blue-700">${typeTotals.Transfer.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-2">
                    <RefreshCcw className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-purple-50 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-purple-600">Credits</p>
                    <p className="text-lg font-bold text-purple-700">${typeTotals.Credit.toLocaleString()}</p>
                  </div>
                  <div className="rounded-full bg-purple-100 p-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="relative h-72 w-full">
              <Pie data={data} options={options} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg bg-gray-50 p-8 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">No Transactions Found</h3>
            <p className="text-gray-500">There are no transactions recorded for this date.</p>
          </div>
        )}
      </div>
    </div>
  )
}
