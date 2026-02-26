'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type CartItem = {
    id: string
    title: string
    price: number
    image: string
    quantity: number
    size: string
    brand: string
}

type CartContextType = {
    items: CartItem[]
    addItem: (item: CartItem) => void
    removeItem: (id: string, size: string) => void
    updateQuantity: (id: string, size: string, quantity: number) => void
    clearCart: () => void
    totalItems: number
    totalPrice: number
    isCartOpen: boolean
    setIsCartOpen: (isOpen: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    // Load from local storage on mount
    useEffect(() => {
        setIsMounted(true)
        const saved = localStorage.getItem('zyra_cart')
        if (saved) {
            try {
                setItems(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse cart", e)
            }
        }
    }, [])

    // Save to local storage on change
    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('zyra_cart', JSON.stringify(items))
        }
    }, [items, isMounted])

    const addItem = (item: CartItem) => {
        setItems(current => {
            const existing = current.find(i => i.id === item.id && i.size === item.size)
            if (existing) {
                return current.map(i =>
                    (i.id === item.id && i.size === item.size)
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                )
            }
            return [...current, item]
        })
        setIsCartOpen(true) // Auto-open cart on add
    }

    const removeItem = (id: string, size: string) => {
        setItems(current => current.filter(i => !(i.id === id && i.size === size)))
    }

    const updateQuantity = (id: string, size: string, quantity: number) => {
        if (quantity < 1) return removeItem(id, size)

        setItems(current =>
            current.map(i =>
                (i.id === id && i.size === size) ? { ...i, quantity } : i
            )
        )
    }

    const clearCart = () => setItems([])

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const totalPrice = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
