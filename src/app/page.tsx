/* eslint-disable react/no-unescaped-entities */
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Shield,
  Clock,
  Users,
  Banknote,
  LogIn,
  UserPlus,
  LogOut,
  ChevronRight,
  Globe,
  Smartphone,
  Lock,
  CreditCard,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import Image from 'next/image'
import logo from '../../public/images/logo/logo.png'

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const logout = () => {
    localStorage.removeItem("authToken")
    router.push("/")
  }

  const features = [
    {
      title: "Advanced Security",
      description: "Security give which keep your assets protected 24/7.",
      icon: <Shield className="h-8 w-8" />,
      color: "from-blue-600 to-indigo-700",
    },
    {
      title: "Real-time Transactions",
      description: "Instant transfers and payments.",
      icon: <Clock className="h-8 w-8" />,
      color: "from-emerald-500 to-teal-700",
    },
    {
      title: "Global Banking",
      description: "Access your accounts and make transactions anywhere in the world.",
      icon: <Globe className="h-8 w-8" />,
      color: "from-purple-600 to-violet-800",
    },
    
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-white">
      {/* Header */}
      <header
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "py-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-md" : "py-4 bg-transparent"}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">

                <Image src={logo} alt="Logo" height={35} width={35} className="mt-1"/>

            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              SecureBank
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Benefits
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              FAQ
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link
                  href="/signin"
                  className="relative overflow-hidden group px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="relative z-10 flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </span>
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link
                  href="/signup"
                  className="relative overflow-hidden px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-300"
                >
                  <span className="relative z-10 flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Account
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="relative overflow-hidden px-6 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            )}
          </div>

          <button
            className="md:hidden text-gray-700 dark:text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-lg rounded-b-2xl overflow-hidden">
            <nav className="flex flex-col py-4 px-6 space-y-4">
              <Link
                href="#features"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefits
              </Link>
              <Link
                href="#testimonials"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </Link>
              <Link
                href="#faq"
                className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/signin"
                      className="flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Account
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-blue-400/10 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
                <div>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                    <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2"></span>
                    Next Generation Banking
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    Banking Reimagined for the{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      Digital Age
                    </span>
                  </h1>
                </div>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0">
                  Experience banking that's secure, intelligent, and designed for the way you live. Join thousands
                  who've already made the switch.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/signup"
                    className="relative overflow-hidden group px-8 py-4 rounded-xl text-base font-medium text-white transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center">
                      Get Started
                      <ChevronRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"></span>
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  </Link>
                  <Link
                    href="#features"
                    className="px-8 py-4 rounded-xl text-base font-medium border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-3">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 bg-gray-200 dark:bg-gray-700"
                        ></div>
                      ))}
                    </div>
                    <span>Trusted by 10,000+ customers</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span>5.0 (2,500+ reviews)</span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-1/2 relative">
                <div className="relative z-10 bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl overflow-hidden p-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-3xl"></div>
                  <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden aspect-[4/3]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <div className="relative w-3/4 h-3/4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="font-bold">SecureBank Dashboard</span>
                            </div>
                            <div className="flex space-x-2">
                              <div className="h-3 w-3 rounded-full bg-red-500"></div>
                              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            </div>
                          </div>
                          <div className="flex-1 grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Balance</div>
                              <div className="text-2xl font-bold">$24,156.00</div>
                              <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                              </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Savings Goal</div>
                              <div className="text-2xl font-bold">$30,000.00</div>
                              <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
                                <span>+12.4%</span>
                                <span className="ml-auto">80%</span>
                              </div>
                            </div>
                            <div className="col-span-2 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Recent Transactions</div>
                              <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                  <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 mr-2"></div>
                                      <div className="text-sm">
                                        <div className="font-medium">Amazon</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">May 12</div>
                                      </div>
                                    </div>
                                    <div className="text-sm font-medium">-$24.99</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-1/4 -left-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 z-20 hidden lg:block">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Mobile Banking</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Always accessible</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1/4 -right-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 z-20 hidden lg:block">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Bank-grade Security</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Your data is protected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 z-0"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Experience Next-Level Banking</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Discover how SecureBank is revolutionizing the way you manage your finances with cutting-edge technology
                and unparalleled security.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                  <div className="relative h-96">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 ${activeFeature === index ? "opacity-100" : "opacity-0"}`}
                        >
                          <div className="w-full h-full p-8 flex items-center justify-center">
                            <div
                              className={`h-24 w-24 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                            >
                              <div className="text-white">{feature.icon}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <div className="space-y-8">
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer ${activeFeature === index ? "bg-white dark:bg-gray-800 shadow-lg" : "hover:bg-white/50 dark:hover:bg-gray-800/50"}`}
                      onClick={() => setActiveFeature(index)}
                    >
                      <div className="flex items-start">
                        <div
                          className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mr-4 shrink-0`}
                        >
                          <div className="text-white">{feature.icon}</div>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section
          id="benefits"
          className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-blue-400/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-indigo-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Choose SecureBank?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We combine cutting-edge technology with exceptional service to provide you with the best banking
                experience possible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {[
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Bank-Grade Security",
                  description:
                    "Security that will keep your data and assets safe.",
                  color: "from-blue-600 to-indigo-600",
                },
                {
                  icon: <Smartphone className="h-6 w-6" />,
                  title: "Mobile-First Banking ",
                  description:
                    "Manage your accounts, make payments, and track your spending from anywhere with our award-winning app.",
                  color: "from-emerald-500 to-teal-600",
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "24/7 Support",
                  description:
                    "Our dedicated team is available around the clock to assist you with any questions or concerns.",
                  color: "from-amber-500 to-orange-600",
                },
               
               
                {
                  icon: <Globe className="h-6 w-6" />,
                  title: "Global Access",
                  description:
                    "Use your accounts and cards worldwide with no foreign transaction fees and preferential exchange rates.",
                  color: "from-cyan-500 to-blue-600",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-500 transition-all duration-300"></div>
                  <div className="p-8">
                    <div
                      className={`h-14 w-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-6`}
                    >
                      <div className="text-white">{benefit.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">What Our Customers Say</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Join thousands of satisfied customers who have made the switch to SecureBank.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Small Business Owner",
                  quote:
                    "SecureBank has transformed how I manage my business finances. Their mobile app is intuitive and their customer service is exceptional.",
                  rating: 5,
                },
                {
                  name: "Michael Chen",
                  role: "Software Engineer",
                  quote:
                    "I've been with SecureBank for 3 years now and I'm impressed with their security features. I can rest easy knowing my money is safe.",
                  rating: 5,
                },
                {
                  name: "Emily Rodriguez",
                  role: "Teacher",
                  quote:
                    "The savings tools at SecureBank have helped me plan for my future. Their financial advisors provided personalized guidance that made all the difference.",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 relative">
                  <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 text-6xl text-blue-100 dark:text-blue-900/30 font-serif">
                    "
                  </div>
                  <div className="flex items-center mb-6">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Find answers to common questions about SecureBank and our services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "How secure is SecureBank?",
                  answer:
                    "SecureBank employs bank-grade security measures including 256-bit encryption, multi-factor authentication, and continuous monitoring to ensure your accounts and personal information remain secure at all times.",
                },
                {
                  question: "How do I open an account?",
                  answer:
                    "Opening an account is simple and can be done entirely online in just a few minutes. Click on 'Create Account' at the top of the page, fill out the application form, verify your identity, and fund your account.",
                },
                {
                  question: "Are there any fees for using SecureBank?",
                  answer:
                    "SecureBank offers fee-free checking accounts with no minimum balance requirements. We're transparent about our fees for specialized services, which you can find in our fee schedule.",
                },
                {
                  question: "Can I access my accounts from anywhere?",
                  answer:
                    "Yes, you can access your SecureBank accounts from anywhere in the world through our website or mobile app. We also offer global ATM access with no foreign transaction fees.",
                },
                {
                  question: "What kind of customer support do you offer?",
                  answer:
                    "We provide 24/7 customer support via phone, chat, and email. Our dedicated team is always ready to assist you with any questions or concerns you may have.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between p-6 cursor-pointer">
                      <h3 className="text-lg font-medium">{faq.question}</h3>
                      <ChevronDown className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 z-0"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 z-0"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">Ready to experience better banking?</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    Join thousands of satisfied customers who have made the switch to SecureBank. Open an account in
                    minutes and start enjoying the benefits today.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/signup"
                      className="relative overflow-hidden group px-8 py-4 rounded-xl text-base font-medium text-white transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center">
                        Create Account
                        <ChevronRight className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl"></span>
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Link>
                    
                  </div>
                </div>
                <div className="md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 md:p-12">
                  <div className="h-full flex flex-col justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                      <div className="flex items-center mb-4">
                        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                        <h3 className="font-bold">Our Guarantee</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        We're so confident you'll love banking with us that we offer a 90-day satisfaction guarantee. If
                        you're not completely satisfied, we'll help you transition your accounts and refund any fees.
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>FDIC Insured</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>24/7 Support</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        <span>10,000+ Customers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} SecureBank. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
