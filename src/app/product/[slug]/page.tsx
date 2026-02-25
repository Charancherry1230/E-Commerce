'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Star, Truck, ShieldCheck, ChevronDown, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProductBySlug } from '@/actions/product'

type Product = Awaited<ReturnType<typeof getProductBySlug>>

export default function ProductDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const [product, setProduct] = useState<Product | null>(null)
    const [activeImage, setActiveImage] = useState<string>('')
    const [selectedSize, setSelectedSize] = useState<string>('')
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProduct() {
            const data = await getProductBySlug(slug)
            setProduct(data)
            if (data?.images?.length) {
                setActiveImage(data.images[0].url)
            }
            setLoading(false)
        }
        loadProduct()
    }, [slug])

    if (loading) return <div className="min-h-screen pt-32 pb-24 text-center text-slate-500 animate-pulse font-serif text-2xl">Loading...</div>
    if (!product) return <div className="min-h-screen pt-32 pb-24 text-center text-slate-500 font-serif text-2xl">Product not found.</div>

    const discountPercent = Math.round(
        ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
    )

    const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)

    return (
        <div className="pt-28 pb-24 px-8 max-w-7xl mx-auto w-full min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left Column - Gallery */}
                <div className="flex flex-col-reverse md:flex-row gap-4 h-fit sticky top-28">
                    {/* Vertical Thumbnails */}
                    <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar py-1">
                        {product.images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(img.url)}
                                className={`relative w-20 h-24 md:w-24 md:h-32 shrink-0 border-2 transition-all ${activeImage === img.url ? 'border-amber-500 shadow-md' : 'border-transparent hover:border-slate-300'
                                    }`}
                            >
                                <Image src={img.url} alt={`Thumbnail ${i}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>

                    {/* Main Hero Image Zoom Wrapper */}
                    <div className="relative w-full aspect-[3/4] md:aspect-[4/5] bg-slate-100 overflow-hidden group">
                        <motion.div
                            layoutId={`product-image-${product.id}`}
                            className="w-full h-full relative origin-center"
                        >
                            <Image
                                src={activeImage}
                                alt={product.title}
                                fill
                                priority
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Right Column - Details */}
                <div className="flex flex-col h-fit">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500 mb-4">{product.brand}</p>
                    <h1 className="text-3xl lg:text-5xl font-serif text-slate-900 mb-6 leading-tight">{product.title}</h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-bold text-slate-900 text-sm">{product.rating}</span>
                        </div>
                        <span className="text-slate-400 text-sm underline decoration-slate-300 underline-offset-4 cursor-pointer">128 Reviews</span>
                    </div>

                    <div className="flex items-end gap-3 mb-10">
                        <span className="text-3xl tracking-tight font-bold text-slate-900">{formatPrice(product.discountedPrice)}</span>
                        {product.originalPrice > product.discountedPrice && (
                            <span className="text-lg text-slate-400 line-through mb-1">{formatPrice(product.originalPrice)}</span>
                        )}
                        {discountPercent > 0 && (
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest pl-2 mb-2">({discountPercent}% OFF)</span>
                        )}
                        <span className="text-xs text-slate-400 mb-1 ml-auto">Inclusive of all taxes</span>
                    </div>

                    {/* Size Selector */}
                    <div className="mb-10">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold uppercase tracking-wider text-slate-900">Select Size</span>
                            <button className="text-xs text-amber-500 underline underline-offset-4 font-medium uppercase tracking-wider">Size Guide</button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-3 border text-sm font-semibold transition-all ${selectedSize === size
                                            ? 'border-slate-900 bg-slate-900 text-white'
                                            : 'border-slate-200 text-slate-700 hover:border-slate-900'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                        {!selectedSize && <p className="text-xs text-red-500 mt-2 font-medium">Please select a size to continue</p>}
                    </div>

                    <div className="h-px bg-slate-200 w-full mb-10" />

                    {/* Actions */}
                    <div className="flex gap-4 mb-10 relative z-10">
                        <div className="flex items-center border border-slate-200 text-slate-900">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-4 hover:bg-slate-50 hover:text-amber-500 transition-colors"><Minus className="w-4 h-4" /></button>
                            <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="p-4 hover:bg-slate-50 hover:text-amber-500 transition-colors"><Plus className="w-4 h-4" /></button>
                        </div>
                        <Button
                            disabled={!selectedSize}
                            className={`flex-1 text-lg py-8 uppercase tracking-widest font-bold rounded-none transition-all duration-300 ${selectedSize
                                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            Add To Cart
                        </Button>
                    </div>

                    {/* Description & Accordions */}
                    <div className="prose prose-slate max-w-none text-slate-600 mb-10 leading-relaxed">
                        <p>{product.description}</p>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-col gap-4 p-6 bg-slate-50 border border-slate-100 mt-auto">
                        <div className="flex items-center gap-3 text-slate-700">
                            <Truck className="w-5 h-5 text-amber-500" />
                            <span className="text-sm font-medium">Free express delivery on orders over ₹2,999</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                            <ShieldCheck className="w-5 h-5 text-amber-500" />
                            <span className="text-sm font-medium">100% Secure payments and easy returns</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
