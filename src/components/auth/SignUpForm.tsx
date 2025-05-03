"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    countryCode: "",
    phoneNumber: "", // updated key
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const { fname, lname, email, password, countryCode, phoneNumber, address } = formData;
    if (fname && lname && email && password && countryCode && phoneNumber && address) {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${fname.trim()} ${lname.trim()}`,
            email: email.trim(),
            password: password.trim(),
            countryCode: countryCode.trim(),
            phoneNumber: phoneNumber.trim(), // key matches backend
            address: address.trim(),
          }),
        });

        const isJson = response.headers.get("content-type")?.includes("application/json");
        const data = isJson ? await response.json() : await response.text();
        console.log("Raw signup response:", data);

        if (response.ok) {
          toast.success("Signup successful! Please log in.");
          router.push("/signin");
        } else {
          toast.error(data.error || "Signup failed");
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("An error occurred, please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create your account to access the dashboard.
            </p>
          </div>
          <form onSubmit={handleSignUp}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input type="text" name="fname" value={formData.fname} onChange={handleChange} />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input type="text" name="lname" value={formData.lname} onChange={handleChange} />
                </div>
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <Label>Password *</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Country Code *</Label>
                  <Input name="countryCode" value={formData.countryCode} onChange={handleChange} placeholder="e.g. US" />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="e.g. 1234567890"
                  />
                </div>
              </div>
              <div>
                <Label>Address *</Label>
                <Input name="address" value={formData.address} onChange={handleChange} />
              </div>
              <div>
                <Button className="w-full" size="sm" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
            </div>
          </form>

          <div className="mt-5">
            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
