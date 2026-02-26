'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, ChevronRight, ShoppingBag, Clock, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MOCK_ORDERS = [
    {
        id: 'ORD-84392',
        date: 'Oct 24, 2023',
        status: 'Delivered',
        total: 12999,
        items: [
            { title: 'Artisan Sabyasachi Saree 1', quantity: 1, price: 12999 }
        ]
    },
    {
        id: 'ORD-77210',
        date: 'Sep 12, 2023',
        status: 'Shipped',
        total: 8499,
        items: [
            { title: 'Premium Peter England Blazer 3', quantity: 1, price: 8499 }
        ]
    }
]

export default function OrdersPage() {
    return (
        <div className="min-h-screen pt-32 pb-24 px-8 max-w-5xl mx-auto w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">My Orders</h1>
                <p className="text-slate-500 font-light max-w-2xl">
                    Track your luxury acquisitions and view your order history with ZYRA.
                </p>
            </motion.div>

            <div className="space-y-8">
                {MOCK_ORDERS.length > 0 ? (
                    MOCK_ORDERS.map((order, idx) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-white border border-slate-100 shadow-sm overflow-hidden"
                        >
                            <div className="bg-slate-50 px-8 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-slate-100">
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Order Placed</p>
                                        <p className="text-sm font-medium text-slate-900">{order.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total</p>
                                        <p className="text-sm font-bold text-slate-900">₹{order.total.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Order #</p>
                                        <p className="text-sm font-medium text-slate-700 underline underline-offset-4 cursor-pointer hover:text-amber-500 transition-colors uppercase">
                                            {order.id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full">
                                    {order.status === 'Delivered' ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <Clock className="w-4 h-4 text-amber-500" />
                                    )}
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-6 py-4 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-24 bg-slate-100 flex items-center justify-center">
                                                <Package className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <div>
                                                <h4 className="font-serif text-lg text-slate-900 mb-1">{item.title}</h4>
                                                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                                <Button variant="link" className="p-0 h-auto text-amber-500 text-xs mt-2 underline-offset-4 font-bold uppercase tracking-widest">
                                                    View Item
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="hidden sm:flex flex-col items-end gap-3">
                                            <Button variant="outline" className="rounded-none border-slate-200 text-xs font-bold uppercase tracking-widest px-6 hover:bg-slate-900 hover:text-white transition-all">
                                                Track Package
                                            </Button>
                                            <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900">
                                                Write Review
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-200">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-serif text-slate-900 mb-2">No Acquisitions Yet</h3>
                        <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Your luxury journey with ZYRA hasn&apos;t started. Explore our collections today.</p>
                        <Link href="/category/men">
                            <Button className="bg-slate-900 text-white rounded-none px-8 py-6 font-bold uppercase tracking-widest text-xs">
                                Start Shopping
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
