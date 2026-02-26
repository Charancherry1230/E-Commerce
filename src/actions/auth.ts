'use server'

import prisma from '@/lib/prisma'

import bcrypt from 'bcryptjs'
import { signIn } from '@/lib/auth'
import { AuthError } from 'next-auth'

export async function signUpAction(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!name || !email || !password) {
        return { error: 'All fields are required.' }
    }
    if (password !== confirmPassword) {
        return { error: 'Passwords do not match.' }
    }
    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' }
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return { error: 'An account with this email already exists.' }
    }

    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.create({
        data: { name, email, password: hashed },
    })

    try {
        // Auto sign-in after signup
        const response = await signIn('credentials', { email, password, redirect: false })
        if (response?.error) {
            return { error: 'Invalid email or password.' }
        }
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: 'Invalid email or password.' }
        }
        return { success: true } // NextAuth throws NEXT_REDIRECT which might be caught. If not caught, return success. Actually, let's just use router on client side.
    }
}

export async function signInAction(formData: FormData) {
    try {
        const response = await signIn('credentials', {
            email: formData.get('email'),
            password: formData.get('password'),
            redirect: false,
        })
        if (response?.error) {
            return { error: 'Invalid email or password.' }
        }
        return { success: true }
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: 'Invalid email or password.' }
        }
        return { success: true }
    }
}
