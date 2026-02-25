'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from 'next-auth/react'

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const { data: session } = useSession()

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-4"
            >
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="text-2xl font-serif font-bold tracking-wider text-slate-900">
                            ZYRA
                        </Link>

                        <div className="hidden md:flex items-center gap-8">
                            {['Men', 'Women', 'Kids', 'Sale'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/category/${item.toLowerCase()}`}
                                    className={`text-sm tracking-wide transition-colors ${item === 'Sale' ? 'text-amber-500 font-medium' : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-slate-900 hover:text-amber-500 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {/* User Menu */}
                        {session?.user ? (
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 text-slate-700 hover:text-amber-500 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                                        {session.user.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <ChevronDown className="w-3 h-3" />
                                </button>

                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 8 }}
                                            className="absolute right-0 top-12 w-52 bg-white shadow-xl border border-slate-100 py-2 z-50"
                                            onMouseLeave={() => setShowUserMenu(false)}
                                        >
                                            <div className="px-4 py-3 border-b border-slate-100">
                                                <p className="text-sm font-semibold text-slate-900 truncate">{session.user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                                            </div>
                                            <Link
                                                href="/orders"
                                                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-500 transition-colors"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                <ShoppingBag className="w-4 h-4" /> My Orders
                                            </Link>
                                            <button
                                                onClick={() => { setShowUserMenu(false); signOut({ callbackUrl: '/' }) }}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/signin"
                                className="hidden md:flex items-center gap-1.5 text-slate-700 hover:text-amber-500 transition-colors text-sm font-medium"
                            >
                                <User className="w-5 h-5" />
                                Sign In
                            </Link>
                        )}

                        <button className="relative text-slate-900 hover:text-amber-500 transition-colors">
                            <ShoppingBag className="w-5 h-5" />
                            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>
                        <button
                            className="md:hidden text-slate-900"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-[80vw] max-w-sm bg-white shadow-2xl p-6"
                        >
                            <div className="flex justify-end mb-8">
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {['Men', 'Women', 'Kids', 'Sale'].map((item) => (
                                    <Link
                                        key={item}
                                        href={`/category/${item.toLowerCase()}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-2xl font-serif text-slate-900"
                                    >
                                        {item}
                                    </Link>
                                ))}
                            </div>

                            <div className="mt-auto absolute bottom-8 left-6 right-6 space-y-3">
                                {session?.user ? (
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); signOut({ callbackUrl: '/' }) }}
                                        className="w-full bg-slate-100 hover:bg-red-50 text-red-500 p-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                                    >
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                ) : (
                                    <>
                                        <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white p-6 text-lg">
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="outline" className="w-full border-slate-300 text-slate-700 p-6 text-lg">
                                                Create Account
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
