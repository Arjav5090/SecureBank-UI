/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import axios from "axios"
import { toast } from "react-toastify"

interface GeneratePINFormData {
  newPin: string
  confirmPin: string
  password: string
}

interface UpdatePINFormData {
  oldPin: string
  newPin: string
  confirmNewPin: string
  password: string
}

const AccountPinPage = () => {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showGeneratePINForm, setShowGeneratePINForm] = useState(true)

  // States for forms
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<GeneratePINFormData>()

  const {
    register: registerUpdate,
    handleSubmit: handleSubmitUpdate,
    setError: setErrorUpdate,
    formState: { errors: updateErrors },
  } = useForm<UpdatePINFormData>()

  // Check PIN status on mount
  useEffect(() => {
    const fetchPinStatus = async () => {
      try {
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_NAME as string)
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/pin/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const hasPin = response.data.includes("has been created")
        setShowGeneratePINForm(!hasPin)
      } catch (error) {
        console.error("Error checking PIN status:", error)
        toast.error("Failed to check PIN status")
      } finally {
        setLoading(false)
      }
    }

    fetchPinStatus()
  }, [])

  // Form submission for generating PIN
  const onSubmitGeneratePIN: SubmitHandler<GeneratePINFormData> = async (data) => {
    if (data.newPin !== data.confirmPin) {
      setError("confirmPin", {
        type: "manual",
        message: "PINs do not match.",
      })
      return
    }

    setSubmitting(true)
    try {
      const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_NAME as string)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/account/pin/create`,
        {
          pin: data.newPin,
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success("PIN generated successfully")
      setShowGeneratePINForm(false)
    } catch (error: any) {
      console.error("Error generating PIN:", error)
      toast.error(error?.response?.data?.message || "Failed to generate PIN")
    } finally {
      setSubmitting(false)
    }
  }

  // Form submission for updating PIN
  const onSubmitUpdatePIN: SubmitHandler<UpdatePINFormData> = async (data) => {
    if (data.newPin !== data.confirmNewPin) {
      setErrorUpdate("confirmNewPin", {
        type: "manual",
        message: "New PINs do not match.",
      })
      return
    }

    setUpdating(true)
    try {
      const token = localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_NAME as string)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/account/pin/update`,
        {
          oldPin: data.oldPin,
          newPin: data.newPin,
          password: data.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success("PIN updated successfully")
    } catch (error: any) {
      console.error("Error updating PIN:", error)
      toast.error(error?.response?.data?.message || "Failed to update PIN")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"></div>
            <p className="mt-2 text-sm text-slate-500">Checking PIN status...</p>
          </div>
        ) : (
          <>
            {showGeneratePINForm ? (
              <>
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-semibold text-slate-800">Generate PIN</h2>
                  <p className="text-sm text-slate-500">Create a 4-digit PIN for your account</p>
                </div>
                <form onSubmit={handleSubmit(onSubmitGeneratePIN)} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="newPin" className="block text-sm font-medium text-slate-700">
                      New PIN
                    </label>
                    <input
                      {...register("newPin", {
                        required: "New PIN is required",
                        minLength: { value: 4, message: "PIN must be 4 digits" },
                        maxLength: { value: 4, message: "PIN must be 4 digits" },
                        pattern: { value: /^\d{4}$/, message: "PIN must contain only digits" },
                      })}
                      type="password"
                      id="newPin"
                      placeholder="Enter 4-digit PIN"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                        errors.newPin ? "border-red-500" : "border-slate-300"
                      }`}
                      maxLength={4}
                    />
                    {errors.newPin && <p className="text-sm font-medium text-red-500">{errors.newPin.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPin" className="block text-sm font-medium text-slate-700">
                      Confirm PIN
                    </label>
                    <input
                      {...register("confirmPin", { required: "Confirm PIN is required" })}
                      type="password"
                      id="confirmPin"
                      placeholder="Confirm your PIN"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                        errors.confirmPin ? "border-red-500" : "border-slate-300"
                      }`}
                      maxLength={4}
                    />
                    {errors.confirmPin && (
                      <p className="text-sm font-medium text-red-500">{errors.confirmPin.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                      Password
                    </label>
                    <input
                      {...register("password", { required: "Password is required" })}
                      type="password"
                      id="password"
                      placeholder="Enter your account password"
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                        errors.password ? "border-red-500" : "border-slate-300"
                      }`}
                    />
                    {errors.password && <p className="text-sm font-medium text-red-500">{errors.password.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 mt-4"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Generating PIN...
                      </div>
                    ) : (
                      "Generate PIN"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="py-10 text-center">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-slate-800">PIN Already Exists</h3>
                  <p className="text-slate-500">
                    You already have a PIN set up for your account. You can update it below.
                  </p>
                  <form onSubmit={handleSubmitUpdate(onSubmitUpdatePIN)} className="space-y-4 text-left mt-6">
                    <div className="space-y-2">
                      <label htmlFor="oldPin" className="block text-sm font-medium text-slate-700">
                        Current PIN
                      </label>
                      <input
                        {...registerUpdate("oldPin", {
                          required: "Current PIN is required",
                          pattern: { value: /^\d{4}$/, message: "PIN must be 4 digits" },
                        })}
                        type="password"
                        id="oldPin"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                          updateErrors.oldPin ? "border-red-500" : "border-slate-300"
                        }`}
                        maxLength={4}
                      />
                      {updateErrors.oldPin && <p className="text-sm text-red-500">{updateErrors.oldPin.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="newPin" className="block text-sm font-medium text-slate-700">
                        New PIN
                      </label>
                      <input
                        {...registerUpdate("newPin", {
                          required: "New PIN is required",
                          pattern: { value: /^\d{4}$/, message: "PIN must be 4 digits" },
                        })}
                        type="password"
                        id="newPin"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                          updateErrors.newPin ? "border-red-500" : "border-slate-300"
                        }`}
                        maxLength={4}
                      />
                      {updateErrors.newPin && <p className="text-sm text-red-500">{updateErrors.newPin.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmNewPin" className="block text-sm font-medium text-slate-700">
                        Confirm New PIN
                      </label>
                      <input
                        {...registerUpdate("confirmNewPin", { required: "Please confirm your new PIN" })}
                        type="password"
                        id="confirmNewPin"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                          updateErrors.confirmNewPin ? "border-red-500" : "border-slate-300"
                        }`}
                        maxLength={4}
                      />
                      {updateErrors.confirmNewPin && <p className="text-sm text-red-500">{updateErrors.confirmNewPin.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                        Account Password
                      </label>
                      <input
                        {...registerUpdate("password", { required: "Password is required" })}
                        type="password"
                        id="password"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-300 ${
                          updateErrors.password ? "border-red-500" : "border-slate-300"
                        }`}
                      />
                      {updateErrors.password && <p className="text-sm text-red-500">{updateErrors.password.message}</p>}
                    </div>

                    <button
                      type="submit"
                      disabled={updating}
                      className="w-full bg-slate-700 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                    >
                      {updating ? (
                        <div className="flex items-center justify-center">
                          <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                          Updating PIN...
                        </div>
                      ) : (
                        "Update PIN"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AccountPinPage
