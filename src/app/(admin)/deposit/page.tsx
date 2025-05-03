/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import { Coins, Lock, DollarSign, CheckCircle, AlertCircle, Loader2 } from "lucide-react"


type DepositFormData = {
  amount: number
  pin: string
}

export default function DepositPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
    setError,
  } = useForm<DepositFormData>({ mode: "onChange" })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [pinFocused, setPinFocused] = useState(false)
  const [amountValue, setAmountValue] = useState("")
  const router = useRouter()

  // Watch the amount field to format it
  const amount = watch("amount")

  // Format the amount as the user types
  useEffect(() => {
    if (amount) {
      setAmountValue(new Intl.NumberFormat("en-US").format(amount))
    }
  }, [amount])

 

  const onSubmit = async (data: DepositFormData) => {
    // Validate if amount is a multiple of 100
    if (data.amount % 100 !== 0) {
      setError("amount", {
        type: "manual",
        message: "Amount must be a multiple of 100",
      })
      return
    }

    try {
      setLoading(true)
      const tokenName = process.env.NEXT_PUBLIC_TOKEN_NAME || "defaultTokenName"
      const token = localStorage.getItem(tokenName)

      if (!token) {
        toast.error("Authentication token missing. Please login.")
        return
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/account/deposit`,
        {
          amount: data.amount,
          pin: data.pin,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setSuccess(true)


      setTimeout(() => {
        toast.success(response.data.msg || "Cash deposited successfully")
        reset()
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Deposit failed", error)
      if (error.response) {
        const { status, data } = error.response
        if (status === 400) {
          toast.error(data.error || "Invalid request. Please check your input.")
        } else if (status === 401) {
          toast.error("Unauthorized. Please check your PIN or login again.")
        } else if (status === 404) {
          toast.error("Account not found.")
        } else {
          toast.error("Something went wrong. Please try again.")
        }
      } else {
        toast.error("Network error. Please check your connection.")
      }
    } finally {
      if (!success) {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4">
      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 p-6 pb-16">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Deposit Money</h2>
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                <Coins className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-indigo-100 mt-1">Securely add funds to your account</p>
          </div>

          {/* Floating card */}
          <div className="relative mx-4 -mt-10 rounded-xl bg-white p-6 shadow-lg border border-indigo-50">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-8"
                >
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Deposit Successful!</h3>
                  <p className="text-gray-600 text-center">
                    Your money has been deposited successfully. Redirecting to dashboard...
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Amount input */}
                  <div className="space-y-2">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Amount to Deposit
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="amount"
                        type="number"
                        {...register("amount", {
                          required: "Amount is required",
                          min: { value: 1, message: "Amount must be positive" },
                          validate: {
                            multipleOf100: (value) => value % 100 === 0 || "Amount must be a multiple of 100",
                          },
                          valueAsNumber: true,
                        })}
                        placeholder="Enter amount"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          errors.amount ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
                        } focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                        autoComplete="off"
                      />
                      {amountValue && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium">
                          ${amountValue}
                        </div>
                      )}
                    </div>
                    {errors.amount && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm flex items-center"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.amount.message}
                      </motion.p>
                    )}
                  </div>

                  {/* PIN input */}
                  <div className="space-y-2">
                    <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                      Account PIN
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="pin"
                        type="password"
                        {...register("pin", {
                          required: "PIN is required",
                          minLength: { value: 4, message: "PIN must be exactly 4 digits" },
                          maxLength: { value: 4, message: "PIN must be exactly 4 digits" },
                          pattern: { value: /^\d{4}$/, message: "PIN must contain only digits" },
                        })}
                        placeholder="Enter 4-digit PIN"
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                          errors.pin ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
                        } focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
                        autoComplete="off"
                        onFocus={() => setPinFocused(true)}
                        onBlur={() => setPinFocused(false)}
                      />
                      <AnimatePresence>
                        {pinFocused && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute mt-2 right-0 bg-gray-800 text-white text-xs rounded p-2 max-w-xs"
                          >
                            Your PIN is the 4-digit code you set up for your account
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {errors.pin && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm flex items-center"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.pin.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={!isValid || loading}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all ${
                      isValid && !loading
                        ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 shadow-lg hover:shadow-indigo-200"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Deposit Now"
                    )}
                  </motion.button>

                  {/* Security note */}
                  <div className="text-center text-xs text-gray-500 mt-4">
                    <p className="flex items-center justify-center">
                      <Lock className="h-3 w-3 mr-1" />
                      Your transaction is secure and encrypted
                    </p>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom section */}
          <div className="p-6">
            <div className="rounded-xl bg-indigo-50 p-4">
              <h3 className="font-medium text-indigo-800 mb-2">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    1
                  </span>
                  <span>Deposits are processed immediately to your account</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    2
                  </span>
                  <span>Amount must be a multiple of 100</span>
                </li>
                <li className="flex items-start">
                  <span className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    3
                  </span>
                  <span>You&rsquo;ll receive a confirmation once the deposit is complete</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
