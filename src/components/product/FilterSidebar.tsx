'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'

export function FilterSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [priceRange, setPriceRange] = useState(5000)
    // Track whether we're on a desktop viewport — starts false (SSR-safe)
    const [isDesktop, setIsDesktop] = useState(false)

    // Only runs on the client, so no hydration mismatch
    useEffect(() => {
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768)
        checkDesktop()
        window.addEventListener('resize', checkDesktop)
        return () => window.removeEventListener('resize', checkDesktop)
    }, [])

    const showSidebar = isOpen || isDesktop

    return (
        <>
            {/* Mobile Filter Toggle */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden flex items-center gap-2 mb-6 text-sm font-bold uppercase tracking-wider text-slate-900 border border-slate-200 px-4 py-2"
            >
                <SlidersHorizontal className="w-4 h-4" />
                Filter
            </button>

            {/* Desktop Sidebar & Mobile Drawer */}
            <AnimatePresence>
                {showSidebar && (
                    <motion.aside
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '-100%', opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`
              fixed md:sticky top-0 left-0 h-full md:h-auto w-[85vw] max-w-sm md:w-64 bg-white md:bg-transparent z-50 md:z-auto p-6 md:p-0 shadow-2xl md:shadow-none overflow-y-auto pt-24 md:pt-0
              ${isOpen ? 'block' : 'hidden md:block'}
            `}
                    >
                        <div className="flex md:hidden justify-between items-center mb-8 border-b pb-4">
                            <span className="font-serif text-2xl text-slate-900">Filters</span>
                            <button onClick={() => setIsOpen(false)}>
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Category Filter */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                                    Category
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </h3>
                                <ul className="space-y-3 text-slate-600">
                                    {['New Arrivals', 'Dresses', 'Tops & Shirts', 'Ethnic Wear', 'Bottoms', 'Accessories'].map(item => (
                                        <li key={item} className="flex items-center gap-3 hover:text-amber-500 cursor-pointer transition-colors">
                                            <div className="w-4 h-4 border border-slate-300 rounded-sm" />
                                            <span className="text-sm">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="h-px bg-slate-200" />

                            {/* Price Filter */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                                    Price Range
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </h3>
                                <div className="px-2">
                                    <input
                                        type="range"
                                        min="500"
                                        max="10000"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        className="w-full accent-amber-500"
                                    />
                                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                                        <span>₹500</span>
                                        <span className="font-semibold text-slate-900">Up to ₹{priceRange}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-slate-200" />

                            {/* Color Filter */}
                            <div>
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                                    Color
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {['bg-black', 'bg-white border text-black', 'bg-red-900', 'bg-emerald-800', 'bg-amber-600', 'bg-blue-900'].map((color, i) => (
                                        <button key={i} className={`w-8 h-8 rounded-full ${color} shadow-sm border border-slate-200 hover:scale-110 transition-transform`} />
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
