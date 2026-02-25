'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STEPS = ['Shipping', 'Payment', 'Review']

export default function CheckoutPage() {
    const [currentStep, setCurrentStep] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    const handleNext = async () => {
        if (currentStep < 2) {
            setCurrentStep(prev => prev + 1)
        } else {
            setIsProcessing(true)
            try {
                // Trigger Razorpay
                const res = await fetch('/api/razorpay', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: 1999 })
                })
                const order = await res.json()

                // Mock successful payment after slight delay to simulate razorpay UI pop up.
                setTimeout(() => {
                    setIsProcessing(false)
                    setPaymentSuccess(true)
                }, 1500)

            } catch (err) {
                setIsProcessing(false)
                console.error(err)
            }
        }
    }

    if (paymentSuccess) {
        return (
            <div className="min-h-screen pt-32 pb-24 px-8 flex items-center justify-center bg-slate-50">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20 }}
                    className="max-w-md w-full bg-white p-12 text-center shadow-xl border border-slate-100"
                >
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h1 className="text-3xl font-serif text-slate-900 mb-4">Payment Successful</h1>
                    <p className="text-slate-500 mb-8">Your luxury order #ORD-84392 is confirmed. You will receive an email confirmation shortly.</p>
                    <Button onClick={() => window.location.href = '/'} className="w-full bg-slate-900 text-white rounded-none py-6 font-bold uppercase tracking-widest text-xs">
                        Return to Store
                    </Button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-24 px-8 max-w-7xl mx-auto w-full">
            <div className="mb-12">
                <h1 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 text-center">Checkout</h1>

                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-4 md:gap-8 max-w-xl mx-auto">
                    {STEPS.map((step, idx) => (
                        <div key={step} className="flex items-center gap-2">
                            <span className={`text-sm font-bold uppercase tracking-wider transition-colors ${idx <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                                {idx + 1}. {step}
                            </span>
                            {idx < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-slate-300" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Left Column - Forms */}
                <div className="lg:col-span-2 space-y-8">
                    <AnimatePresence mode="wait">
                        {currentStep === 0 && (
                            <motion.div
                                key="shipping"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-8 border border-slate-100 shadow-sm"
                            >
                                <h2 className="text-2xl font-serif text-slate-900 mb-6">Shipping Details</h2>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">First Name</label>
                                        <input type="text" className="w-full border-b border-slate-300 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="John" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Last Name</label>
                                        <input type="text" className="w-full border-b border-slate-300 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="Doe" />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Address</label>
                                        <input type="text" className="w-full border-b border-slate-300 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="123 Luxury Avenue" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">City</label>
                                        <input type="text" className="w-full border-b border-slate-300 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="Mumbai" />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">PIN Code</label>
                                        <input type="text" className="w-full border-b border-slate-300 py-3 focus:border-amber-500 outline-none transition-colors" placeholder="400001" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 1 && (
                            <motion.div
                                key="payment"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-8 border border-slate-100 shadow-sm"
                            >
                                <h2 className="text-2xl font-serif text-slate-900 mb-6">Payment Method</h2>
                                <div className="flex flex-col gap-4">
                                    <label className="relative flex items-center gap-4 p-4 border border-amber-500 bg-amber-50/30 cursor-pointer">
                                        <input type="radio" name="payment" checked readOnly className="w-4 h-4 accent-amber-500" />
                                        <span className="font-semibold text-slate-900">Razorpay (Cards / UPI / NetBanking)</span>
                                    </label>
                                    <label className="relative flex items-center gap-4 p-4 border border-slate-200 cursor-not-allowed opacity-50">
                                        <input type="radio" name="payment" disabled className="w-4 h-4" />
                                        <span className="font-semibold text-slate-900">Cash on Delivery</span>
                                        <span className="ml-auto text-xs text-slate-400">Not available for this order</span>
                                    </label>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 2 && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-8 border border-slate-100 shadow-sm"
                            >
                                <h2 className="text-2xl font-serif text-slate-900 mb-6">Review Order</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between pb-4 border-b border-slate-100">
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Premium Men Apparel 12</h4>
                                            <p className="text-sm text-slate-500">Size: M | Qty: 1</p>
                                        </div>
                                        <span className="font-bold text-slate-900">₹1,999</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column - Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-50 p-8 border border-slate-100 sticky top-32">
                        <h3 className="font-serif text-xl text-slate-900 mb-6">Order Summary</h3>

                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-slate-900">₹1,999</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Shipping</span>
                                <span className="text-emerald-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Taxes</span>
                                <span className="font-medium text-slate-900">Calculated</span>
                            </div>
                        </div>

                        <div className="h-px bg-slate-200 w-full mb-6" />

                        <div className="flex justify-between items-center mb-8">
                            <span className="font-serif text-lg">Total</span>
                            <span className="text-2xl font-bold text-slate-900">₹1,999</span>
                        </div>

                        <Button
                            onClick={handleNext}
                            disabled={isProcessing}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-none py-7 text-xs font-bold uppercase tracking-widest shadow-lg shadow-amber-500/20"
                        >
                            {isProcessing ? 'Processing via Razorpay...' : currentStep === 2 ? 'Pay Now' : 'Continue'}
                        </Button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-xs">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Secure encrypted checkout</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
