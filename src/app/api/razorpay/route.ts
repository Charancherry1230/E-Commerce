import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

// Mocking the Razorpay instance. In production, keys should be verified.
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { amount } = body

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.warn("RAZORPAY KEYS NOT SET. Generating mock order for UI demonstration.")
            return NextResponse.json({
                id: `mock_order_${Math.random().toString(36).substr(2, 9)}`,
                amount: amount * 100, // in paisa
                currency: 'INR'
            })
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        })

        const options = {
            amount: amount * 100, // Razorpay works in subunits (paisa)
            currency: "INR",
            receipt: `receipt_${Math.random().toString(36).substr(2, 9)}`,
        }

        const order = await instance.orders.create(options)

        return NextResponse.json(order)
    } catch (error) {
        console.error("Razorpay Order Creation Failed:", error)
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
    }
}
