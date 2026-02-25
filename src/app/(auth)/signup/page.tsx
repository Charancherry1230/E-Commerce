'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { signUpAction } from '@/actions/auth'

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError('')
        const formData = new FormData(e.currentTarget)
        const result = await signUpAction(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left — Fashion Image */}
            <div className="hidden lg:block relative w-1/2">
                <Image
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=1400"
                    alt="ELARA Fashion"
                    fill
                    unoptimized
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-12 left-10 text-white">
                    <p className="text-amber-400 uppercase tracking-[0.3em] text-xs font-bold mb-3">New Member</p>
                    <h2 className="font-serif text-4xl leading-tight">Begin Your<br /><em className="font-light">ELARA Story</em></h2>
                </div>
                <Link href="/" className="absolute top-8 left-10 text-white text-2xl font-serif font-bold tracking-widest hover:text-amber-400 transition-colors">
                    ELARA
                </Link>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16 bg-white">
                <div className="w-full max-w-md">
                    <Link href="/" className="lg:hidden text-2xl font-serif font-bold tracking-widest text-slate-900 mb-10 block">
                        ELARA
                    </Link>

                    <h1 className="font-serif text-3xl text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500 text-sm mb-10">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-amber-500 font-semibold hover:underline underline-offset-4">
                            Sign in
                        </Link>
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                Full Name
                            </label>
                            <input
                                name="name"
                                type="text"
                                required
                                placeholder="Your full name"
                                className="w-full border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    placeholder="Min. 6 characters"
                                    className="w-full border border-slate-200 px-4 py-3 pr-12 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-900"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                                Confirm Password
                            </label>
                            <input
                                name="confirmPassword"
                                type="password"
                                required
                                placeholder="Re-enter your password"
                                className="w-full border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400 text-sm"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                                {error}
                            </div>
                        )}

                        <p className="text-xs text-slate-400">
                            By creating an account, you agree to ELARA&apos;s{' '}
                            <span className="text-amber-500 cursor-pointer">Terms</span> &amp;{' '}
                            <span className="text-amber-500 cursor-pointer">Privacy Policy</span>.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-amber-500 text-white py-4 font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
