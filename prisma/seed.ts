import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Curated high-quality Unsplash image IDs for Indian/Global fashion vibe
const menImages = [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80', // Mens ethnic/suit
    'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80', // Mens casual
    'https://images.unsplash.com/photo-1594938298596-70f5820045f9?w=800&q=80', // Mens formal
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80', // Mens modern
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', // Mens casual wear
]

const womenImages = [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80', // Womens wear
    'https://images.unsplash.com/photo-1583391733958-650fac5ecfec?w=800&q=80', // Womens formal/ethnic
    'https://images.unsplash.com/photo-1550614000-4b95dd2db1eb?w=800&q=80', // Womens traditional
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&q=80', // Womens chic
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', // Womens editorial
]

const kidsImages = [
    'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80', // Kids wear
    'https://images.unsplash.com/photo-1519238263530-99abc11edfc6?w=800&q=80', // Kids casual
    'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&q=80', // Kids styling
]

const brands = ['Zaraa', 'House of Pataudi', 'FabIndia', 'H&M', 'Mango', 'Biba', 'W for Woman']

function getRandomEl<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomPrice(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function generateSlug(name: string, id: number) {
    return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`
}

async function main() {
    console.log('Seeding Database...')

    // CREATE CATEGORIES
    const menCat = await prisma.category.upsert({
        where: { slug: 'men' },
        update: {},
        create: { name: 'Men', slug: 'men', description: 'Premium menswear collection' },
    })

    const womenCat = await prisma.category.upsert({
        where: { slug: 'women' },
        update: {},
        create: { name: 'Women', slug: 'women', description: 'Elegant womenswear collection' },
    })

    const kidsCat = await prisma.category.upsert({
        where: { slug: 'kids' },
        update: {},
        create: { name: 'Kids', slug: 'kids', description: 'Playful kidswear collection' },
    })

    const categories = [menCat, womenCat, kidsCat]

    // GENERATE PRODUCTS (50 Men, 50 Women, 30 Kids)
    const productCount = {
        men: 50,
        women: 50,
        kids: 30,
    }

    let globalCounter = 0

    for (const cat of categories) {
        let countToGen = productCount[cat.slug as keyof typeof productCount] || 10
        let imgArray = cat.slug === 'men' ? menImages : cat.slug === 'women' ? womenImages : kidsImages

        for (let i = 0; i < countToGen; i++) {
            globalCounter++

            const originalPrice = getRandomPrice(1500, 5000)
            const discountPercent = getRandomPrice(10, 40)
            const discountedPrice = Math.floor(originalPrice * (1 - discountPercent / 100))

            const title = `Premium ${cat.name} Apparel ${i + 1}`
            const slug = generateSlug(title, globalCounter)

            const product = await prisma.product.upsert({
                where: { slug },
                update: {},
                create: {
                    title,
                    slug,
                    description: `Experience the finest quality with our ${title}. Perfect for every occasion, this piece brings together comfort and luxury. Crafted with premium materials for the modern Indian wardrobe.`,
                    originalPrice,
                    discountedPrice,
                    brand: getRandomEl(brands),
                    stock: getRandomPrice(10, 100),
                    rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
                    sizes: ['S', 'M', 'L', 'XL'],
                    categoryId: cat.id,
                    images: {
                        create: [
                            { url: getRandomEl(imgArray), isDefault: true },
                            { url: getRandomEl(imgArray), isDefault: false },
                            { url: getRandomEl(imgArray), isDefault: false }
                        ]
                    }
                }
            })
            console.log(`Created: ${product.title}`)
        }
    }

    console.log('Seeding Complete! 🎉')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
