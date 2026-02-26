'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/CartProvider'

type ProductProps = {
    product: {
        id: string
        title: string
        slug: string
        brand: string
        originalPrice: number
        discountedPrice: number
        rating: number
        sizes?: string[]
        images: { url: string; isDefault: boolean }[]
    }
}

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price)
}

export function ProductCard({ product }: ProductProps) {
    const [isHovered, setIsHovered] = useState(false)
    const { addItem } = useCart()

    const defaultImg = product.images.find(img => img.isDefault)?.url || product.images[0]?.url || ''
    const hoverImg = product.images.find(img => !img.isDefault)?.url || defaultImg

    const discountPercent = Math.round(
        ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            key={product.id}
            className="group relative flex flex-col gap-4 font-sans"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-slate-100">
                <Image
                    src={defaultImg}
                    alt={product.title}
                    fill
                    unoptimized={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-opacity duration-500 ease-in-out ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                />
                <Image
                    src={hoverImg}
                    alt={`${product.title} back view`}
                    fill
                    unoptimized={true}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover absolute inset-0 transition-all duration-700 ease-in-out ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
                        }`}
                />

                {/* Discount Badge */}
                {discountPercent > 0 && (
                    <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 shadow-md z-10">
                        {discountPercent}% OFF
                    </div>
                )}

                {/* Quick Add Overlay */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-4 left-4 right-4 z-20"
                            onClick={(e) => {
                                e.preventDefault() // prevent navigating to product page
                                addItem({
                                    id: product.id,
                                    title: product.title,
                                    price: product.discountedPrice,
                                    image: defaultImg,
                                    quantity: 1,
                                    size: product.sizes?.[0] || 'M',
                                    brand: product.brand
                                })
                            }}
                        >
                            <Button
                                className="w-full bg-white/90 backdrop-blur text-slate-900 hover:bg-slate-900 hover:text-white transition-colors flex items-center gap-2 shadow-lg"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Quick Add
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Link>

            <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold tracking-wider uppercase">{product.brand}</span>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-slate-700">{product.rating}</span>
                    </div>
                </div>
                <Link href={`/product/${product.slug}`} className="text-sm font-medium text-slate-900 line-clamp-1 group-hover:underline decoration-amber-500 underline-offset-4">
                    {product.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-bold text-slate-900">{formatPrice(product.discountedPrice)}</span>
                    {product.originalPrice > product.discountedPrice && (
                        <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
