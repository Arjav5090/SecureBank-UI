/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import TransactionsPage from "../transaction/page"


interface UserData {
  name: string
  email: string
  phoneNumber: string
  accountNumber: string
  accountType: string
  address: string
  branch: string
  ifscCode: string
}

interface AccountDetails {
  balance: number
  accountNumber: string
  accountType: string
  branch: string
  ifscCode: string
}

export default function UserDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  //const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [animateBalance, setAnimateBalance] = useState(false)

  // Fetch user data and account details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenName = process.env.NEXT_PUBLIC_TOKEN_NAME || "defaultTokenName"
        const token = localStorage.getItem(tokenName)

        if (!token) {
          throw new Error("Authentication token not found. Please log in.")
        }

        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const accountResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/account`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setUserData(userResponse.data)
        setAccountDetails(accountResponse.data)
        setTimeout(() => setAnimateBalance(true), 500)
      } catch (error: any) {
        console.error("Error fetching data:", error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const refreshData = async () => {
    setIsRefreshing(true)
    setAnimateBalance(false)
    try {
      const tokenName = process.env.NEXT_PUBLIC_TOKEN_NAME || "defaultTokenName"
      const token = localStorage.getItem(tokenName)

      if (!token) {
        throw new Error("Authentication token not found. Please log in.")
      }

      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const accountResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUserData(userResponse.data)
      setAccountDetails(accountResponse.data)
      setTimeout(() => setAnimateBalance(true), 500)
    } catch (error: any) {
      console.error("Error refreshing data:", error)
      setError(error.message)
    } finally {
      setTimeout(() => setIsRefreshing(false), 800)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(text)
    setTimeout(() => setCopiedText(null), 2000)
  }

  
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">Something went wrong</h2>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-white transition-colors hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-100"></div>
            <svg
              className="absolute inset-0 h-full w-full animate-spin text-indigo-600"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="animate-dash"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="280"
              ></circle>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Loading your dashboard</h3>
          <p className="text-gray-500">Please wait while we fetch your information</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 bg-gray-50">
      {/* Header with welcome message and balance display */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl">
              Welcome back, <span className="text-indigo-600">{userData?.name}</span>
            </h1>
            <p className="mt-1 text-gray-500">Here&apos;s your financial overview and recent transactions</p>
          </div>
          <button
            onClick={refreshData}
            className="mt-4 md:mt-0 flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
            disabled={isRefreshing}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>

        {/* Creative Balance Display */}
       
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-2 md:grid-cols-1">
  <div className="overflow-hidden rounded-md bg-white shadow transition-all hover:shadow-md">
    <div className="border-b border-gray-100 bg-indigo-50 px-3 py-2">
      <h2 className="text-sm font-semibold text-indigo-700">Account Information</h2>
    </div>
    <div className="p-3">
      <div className="grid grid-cols-2 gap-2">
        {/* Current Balance */}
        <div className="group relative rounded-md border border-gray-100 bg-gray-50 p-2 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
          <p className="text-[10px] font-medium text-gray-500">Current Balance</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            ${accountDetails?.balance.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Account Type */}
        <div className="group relative rounded-md border border-gray-100 bg-gray-50 p-2 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
          <p className="text-[10px] font-medium text-gray-500">Account Type</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">{accountDetails?.accountType}</p>
        </div>

        {/* Branch */}
        <div className="group relative rounded-md border border-gray-100 bg-gray-50 p-2 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
          <p className="text-[10px] font-medium text-gray-500">Branch</p>
          <p className="mt-1 text-sm font-semibold text-gray-800">{accountDetails?.branch}</p>
        </div>

        {/* Account Number */}
        <div className="group relative rounded-md border border-gray-100 bg-gray-50 p-2 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
          <p className="text-[10px] font-medium text-gray-500">Account Number</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800 truncate">{accountDetails?.accountNumber}</p>
            <button
              onClick={() => copyToClipboard(accountDetails?.accountNumber || "")}
              className="text-[10px] text-indigo-500 hover:underline"
            >
              Copy
            </button>
          </div>
        </div>

        {/* IFSC Code */}
        <div className="group relative rounded-md border border-gray-100 bg-gray-50 p-2 hover:border-indigo-200 hover:bg-indigo-50 transition-all">
          <p className="text-[10px] font-medium text-gray-500">IFSC Code</p>
          <div className="mt-1 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800 truncate">{accountDetails?.ifscCode}</p>
            <button
              onClick={() => copyToClipboard(accountDetails?.ifscCode || "")}
              className="text-[10px] text-indigo-500 hover:underline"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>



      {/* Transaction History */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-md">
        <div className="border-b border-gray-100 bg-indigo-50 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-indigo-700">Transaction History</h2>
            <div className="flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Last Updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
        <div className="p-0">
          <TransactionsPage />
        </div>
      </div>
    </div>
  )
}
