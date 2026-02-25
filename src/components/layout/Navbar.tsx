'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'bg-white/80 backdrop-blur-md shadow-sm py-4'
                        : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="text-2xl font-serif font-bold tracking-wider text-slate-900">
                            AURA
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
                        <button className="hidden md:block text-slate-900 hover:text-amber-500 transition-colors">
                            <User className="w-5 h-5" />
                        </button>
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

                            <div className="mt-auto absolute bottom-8 left-6 right-6">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white p-6 text-lg">
                                    Sign In
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
