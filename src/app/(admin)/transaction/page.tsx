"use client"

import type React from "react"

import { useEffect, useState } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import {
  ArrowDownCircle,
  ArrowUpCircle,

  Search,
  ArrowLeftRight,
  Calendar,
  DollarSign,
  CreditCard,
  User,
} from "lucide-react"
import DailyTransactionChart from "@/components/charts/DailyTransactionChart"
import MonthlyTransactionChart from "@/components/charts/MonthlyTransactionChart"
import TransactionChart from "@/components/charts/TransactionChart"
import TransactionLineChart from "@/components/charts/TransactionLineChart"

interface Transaction {
  id: number
  amount: number
  transactionDate: string
  transactionType: 'CASH_DEPOSIT' | 'CASH_WITHDRAWAL' | 'CASH_TRANSFER' | 'CASH_CREDIT';
  sourceAccountNumber: string
  targetAccountNumber: string
}

interface DecodedToken {
  sub: string
}



export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [filterCriteria, setFilterCriteria] = useState("")
  const [userAccountNumber, setUserAccountNumber] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)


  useEffect(() => {
    const tokenName = process.env.NEXT_PUBLIC_TOKEN_NAME || "token"

    const authToken = localStorage.getItem(tokenName)
    if (authToken) {
      const decodedToken = jwtDecode<DecodedToken>(authToken)
      setUserAccountNumber(decodedToken.sub)
    }

    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    setLoading(true)
    try {
      const tokenName = process.env.NEXT_PUBLIC_TOKEN_NAME || "token"
      const authToken = localStorage.getItem(tokenName)

      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/transactions`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      setTransactions(response.data)
      setFilteredTransactions(response.data)
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setLoading(false)
    }
  }

 

  const getTransactionStatus = (transaction: Transaction) => {
    const status = transaction.transactionType.slice(5).toLowerCase()
    if (status === "transfer" && transaction.targetAccountNumber === userAccountNumber) {
      return "Credit"
    }
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setFilterCriteria(value)
    filterTransactions(value, searchTerm)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    filterTransactions(filterCriteria, value)
  }

  const filterTransactions = (criteria: string, search: string) => {
    let filtered = [...transactions]

    // Filter by transaction type
    if (criteria === "Deposit") {
      filtered = filtered.filter((txn) => txn.transactionType === "CASH_DEPOSIT")
    } else if (criteria === "Withdrawal") {
      filtered = filtered.filter((txn) => txn.transactionType === "CASH_WITHDRAWAL")
    } else if (criteria === "Transfer") {
      filtered = filtered.filter((txn) => txn.transactionType === "CASH_TRANSFER")
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (txn) =>
          txn.id.toString().includes(search) ||
          txn.amount.toString().includes(search) ||
          txn.sourceAccountNumber.toLowerCase().includes(searchLower) ||
          txn.targetAccountNumber.toLowerCase().includes(searchLower) ||
          getTransactionStatus(txn).toLowerCase().includes(searchLower),
      )
    }

    setFilteredTransactions(filtered)
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Deposit":
        return <ArrowDownCircle className="h-5 w-5 text-emerald-500" />
      case "Withdrawal":
        return <ArrowUpCircle className="h-5 w-5 text-rose-500" />
      case "Credit":
        return <ArrowDownCircle className="h-5 w-5 text-emerald-500" />
      case "Transfer":
        return <ArrowLeftRight className="h-5 w-5 text-blue-500" />
      default:
        return <ArrowLeftRight className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleRowClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction === selectedTransaction ? null : transaction)
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4 md:mb-0">Transaction History</h1>

         
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 transition-all duration-300 hover:shadow-lg">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Filter Transactions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by ID, amount, account..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="relative">
                <select
                  value={filterCriteria}
                  onChange={handleFilterChange}
                  className="w-full p-3 border border-slate-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all pr-10"
                >
                  <option value="">All Transactions</option>
                  <option value="Deposit">Deposits</option>
                  <option value="Withdrawal">Withdrawals</option>
                  <option value="Transfer">Transfers/Credited</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-slate-600">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3 hidden md:table-cell">Date</th>
                    <th className="px-6 py-3 hidden lg:table-cell">ID</th>
                    <th className="px-6 py-3 hidden lg:table-cell">Source</th>
                    <th className="px-6 py-3 hidden lg:table-cell">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((txn) => {
                    const status = getTransactionStatus(txn)
                    const isSelected = selectedTransaction?.id === txn.id

                    return (
                      <>
                        <tr
                          key={txn.id}
                          className={`hover:bg-slate-50 cursor-pointer transition-colors ${isSelected ? "bg-blue-50" : ""}`}
                          onClick={() => handleRowClick(txn)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getTransactionIcon(status)}
                              <span
                                className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  status === "Deposit" || status === "Credit"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : status === "Withdrawal"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {status}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm font-bold ${
                                status === "Deposit" || status === "Credit"
                                  ? "text-emerald-600"
                                  : status === "Withdrawal" || status === "Transfer"
                                    ? "text-rose-600"
                                    : "text-slate-900"
                              }`}
                            >
                              {status === "Deposit" || status === "Credit" ? "+" : "-"}${txn.amount.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-slate-600">{formatDate(txn.transactionDate)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-sm text-slate-500">#{txn.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-sm text-slate-600">{txn.sourceAccountNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="text-sm text-slate-600">{txn.targetAccountNumber}</div>
                          </td>
                        </tr>
                        {isSelected && (
                          <tr className="bg-blue-50 md:hidden">
                            <td colSpan={6} className="px-6 py-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                                  <span className="text-slate-600">{formatDate(txn.transactionDate)}</span>
                                </div>
                                <div className="flex items-center">
                                  <CreditCard className="h-4 w-4 text-slate-400 mr-2" />
                                  <span className="text-slate-600">#{txn.id}</span>
                                </div>
                                <div className="flex items-center">
                                  <User className="h-4 w-4 text-slate-400 mr-2" />
                                  <span className="text-slate-600">From: {txn.sourceAccountNumber}</span>
                                </div>
                                <div className="flex items-center">
                                  <User className="h-4 w-4 text-slate-400 mr-2" />
                                  <span className="text-slate-600">To: {txn.targetAccountNumber}</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <DollarSign className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Transactions Found</h3>
              <p className="text-slate-500 max-w-md">
                {searchTerm || filterCriteria
                  ? "No transactions match your current filters. Try adjusting your search criteria."
                  : "You don't have any transactions yet. Once you make transactions, they will appear here."}
              </p>
              {(searchTerm || filterCriteria) && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setFilterCriteria("")
                    setFilteredTransactions(transactions)
                  }}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}
        </div>

        {filteredTransactions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Transaction Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-600 font-medium">Total Deposits</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      ₹
                      {transactions
                        .filter(
                          (t) =>
                            t.transactionType === "CASH_DEPOSIT" ||
                            (t.transactionType === "CASH_TRANSFER" && t.targetAccountNumber === userAccountNumber),
                        )
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <ArrowDownCircle className="h-10 w-10 text-emerald-200" />
                </div>
              </div>

              <div className="bg-rose-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-rose-600 font-medium">Total Withdrawals</p>
                    <p className="text-2xl font-bold text-rose-700">
                      ₹
                      {transactions
                        .filter((t) => t.transactionType === "CASH_WITHDRAWAL")
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <ArrowUpCircle className="h-10 w-10 text-rose-200" />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Total Transfers</p>
                    <p className="text-2xl font-bold text-blue-700">
                      ₹
                      {transactions
                        .filter(
                          (t) => t.transactionType === "CASH_TRANSFER" && t.sourceAccountNumber === userAccountNumber,
                        )
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <ArrowLeftRight className="h-10 w-10 text-blue-200" />
                </div>
              </div>
            </div>
          </div>
        )}
        {filteredTransactions.length > 0 && (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
    <h3 className="text-lg font-semibold text-slate-800 mb-6">Transaction Insights</h3>

    <div className="grid grid-cols-1 gap-8">
  {/* Daily Transactions */}
  <div className="p-4 rounded-lg border border-slate-100 shadow-sm">
    <h4 className="text-md font-semibold text-slate-700 mb-4">Daily Transactions</h4>
    <DailyTransactionChart transactions={filteredTransactions} />
  </div>

  {/* Monthly Transactions */}
  <div className="p-4 rounded-lg border border-slate-100 shadow-sm">
    <h4 className="text-md font-semibold text-slate-700 mb-4">Monthly Transactions</h4>
    <MonthlyTransactionChart transactions={filteredTransactions} />
  </div>

  {/* Transaction Type Chart */}
  <div className="p-4 rounded-lg border border-slate-100 shadow-sm">
    <h4 className="text-md font-semibold text-slate-700 mb-4">Transaction Types</h4>
    <TransactionChart transactions={filteredTransactions} />
  </div>

  {/* Transaction Amount Line Chart */}
  <div className="p-4 rounded-lg border border-slate-100 shadow-sm">
    <h4 className="text-md font-semibold text-slate-700 mb-4">Transaction Amount Trend</h4>
    <TransactionLineChart transactions={filteredTransactions} />
  </div>
</div>

  </div>
)}

      </div>
    </div>
  )
}
