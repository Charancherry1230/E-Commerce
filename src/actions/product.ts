'use server'

import prisma from '@/lib/prisma'

export async function getTrendingProducts(limit = 8) {
    try {
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: {
                rating: 'desc',
            },
            include: {
                images: true,
                category: true,
            }
        })
        return products
    } catch (error) {
        console.error("Error fetching trending products:", error)
        return []
    }
}

export async function getProductsByCategory(categorySlug: string) {
    try {
        const products = await prisma.product.findMany({
            where: {
                category: {
                    slug: categorySlug
                }
            },
            include: {
                images: true,
                category: true,
            }
        })
        return products
    } catch (error) {
        console.error(`Error fetching products for category ${categorySlug}:`, error)
        return []
    }
}

export async function getProductBySlug(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: {
                slug
            },
            include: {
                images: true,
                category: true,
            }
        })
        return product
    } catch (error) {
        console.error(`Error fetching product ${slug}:`, error)
        return null
    }
}
