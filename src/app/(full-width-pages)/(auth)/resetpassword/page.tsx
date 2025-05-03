"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset/send-otp`,
        { identifier }
      );
      setMessage(response.data.message);
      setStep(2);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset/verify-otp`,
        { identifier, otp }
      );
      setResetToken(response.data.passwordResetToken);
      setMessage("OTP verified. Enter new password.");
      setStep(3);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset`,
        { identifier, resetToken, newPassword }
      );
      setMessage(response.data.message || "Password reset successful!");
      setTimeout(() => router.push("/signin"), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full justify-center">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <button
          onClick={() => router.push("/signin")}
          className="mb-4 text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400 text-left"
        >
          ← Back to Sign In
        </button>

        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Forgot Password
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Recover access in three quick steps.
          </p>
        </div>

        <div className="space-y-6">
          {message && (
            <div className="p-3 text-sm text-blue-700 bg-blue-100 rounded-md">
              {message}
            </div>
          )}

          {step === 1 && (
            <>
              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Email / Account No.
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-brand-500 hover:bg-brand-600 rounded-md"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the code sent to your email"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block mb-2 text-sm text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-md"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
