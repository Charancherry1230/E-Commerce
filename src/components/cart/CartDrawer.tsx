'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    // Mock Cart Items
    const [items, setItems] = useState([
        {
            id: "prod_1",
            title: "Premium Men Apparel 12",
            brand: "Zaraa",
            price: 1999,
            quantity: 1,
            size: "M",
            image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80"
        }
    ])

    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

    const updateQuantity = (id: string, delta: number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const newQ = item.quantity + delta
                return newQ > 0 ? { ...item, quantity: newQ } : item
            }
            return item
        }))
    }

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id))
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100]">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-serif text-2xl text-slate-900 flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6" />
                                Your Cart
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-slate-50 transition-colors rounded-full text-slate-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                                    <ShoppingBag className="w-16 h-16 mb-4 text-slate-200" />
                                    <p className="text-lg font-medium">Your cart is empty.</p>
                                    <p className="text-sm">Discover our collection to find something you'll love.</p>
                                    <Button onClick={onClose} className="mt-6 bg-slate-900 text-white rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold w-full">Continue Shopping</Button>
                                </div>
                            ) : (
                                <AnimatePresence>
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, x: 50 }}
                                            className="flex gap-4 border-b border-slate-100 pb-6"
                                        >
                                            <div className="relative w-24 h-32 shrink-0 bg-slate-100">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            </div>

                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{item.brand}</p>
                                                        <h3 className="text-sm font-semibold text-slate-900 leading-tight pr-4">{item.title}</h3>
                                                    </div>
                                                    <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-slate-500 mt-2">Size: {item.size}</p>

                                                <div className="mt-auto flex justify-between items-end">
                                                    <div className="flex items-center border border-slate-200">
                                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 text-slate-500 hover:text-amber-500"><Minus className="w-3 h-3" /></button>
                                                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 text-slate-500 hover:text-amber-500"><Plus className="w-3 h-3" /></button>
                                                    </div>
                                                    <p className="font-bold text-slate-900">{formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-slate-100 bg-slate-50">
                                <div className="flex justify-between items-center text-slate-600 mb-2">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-900">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 mb-6 text-sm">
                                    <span>Shipping</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-lg font-serif">Estimated Total</span>
                                    <span className="text-2xl font-bold text-slate-900">{formatPrice(subtotal)}</span>
                                </div>

                                <Link href="/checkout" onClick={onClose}>
                                    <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-none py-7 text-sm font-bold uppercase tracking-widest shadow-xl shadow-slate-900/10">
                                        Proceed to Checkout
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
