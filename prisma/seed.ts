import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 100% verified working long-form IDs from Unsplash Fashion category
const verifiedFashionIds = [
    '1483985988355-763728e1935b', '1529139574466-a303027c1d8b', '1603189343302-e603f7add05a',
    '1571513800374-df1bbe650e56', '1492707892479-7bc8d5a4ee93', '1490481651871-ab68de25d43d',
    '1509631179647-0177331693ae', '1571513722275-4b41940f54b8', '1445205170230-053b83016050',
    '1596993100471-c3905dafa78e', '1601597565151-70c4020dc0e1', '1626386699888-b8865823b279',
    '1608228088998-57828365d486', '1532453288672-3a27e9be9efd', '1523297467724-f6758d7124c5',
    '1538329972958-465d6d2144ed', '1557022971-af40cfaf8f80', '1495385794356-15371f348c31',
    '1515886657613-9f3515b0c78f', '1601762603339-fd61e28b698a', '1574015974293-817f0ebebb74',
    '1539109136881-3be0616acf4b', '1485518882345-15568b007407', '1608748010899-18f300247112',
    '1562151270-c7d22ceb586a', '1612215327100-60fc5c4d7938', '1603400521630-9f2de124b33b',
    '1588117260148-b47818741c74', '1566206091558-7f218b696731', '1554412933-514a83d2f3c8'
]

const brandNames = [
    'ELARA Luxe', 'House of Pataudi', 'Royal Fabrik', 'Zivame Premium', 'Mango Elite',
    'Biba Signatures', 'W Prime', 'Raymond Luxe', 'Peter England', 'Allen Solly',
    'Manyavar', 'Mohey', 'Global Desi', 'Anita Dongre', 'Sabyasachi', 'FabIndia'
]

const productAdjectives = ['Silk', 'Cotton', 'Linen', 'Premium', 'Artisan', 'Designer', 'Limited', 'Heritage', 'Organic']
const productTypes = {
    men: ['Kurta', 'Blazer', 'Shirt', 'Trousers', 'Bandhgala', 'Sherwani'],
    women: ['Saree', 'Anarkali', 'Lehenga', 'Top', 'Dress', 'Evening Gown'],
    kids: ['Tee', 'Frock', 'Shorts', 'Jumpsuit', 'Ethnic Set', 'Sweater']
}

function getRandomEl<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function getUnsplashUrl(idWithTimestamp: string, width = 600) {
    return `https://images.unsplash.com/photo-${idWithTimestamp}?auto=format&fit=crop&q=75&w=${width}`
}

async function main() {
    console.log('Clearing existing entries...')
    await prisma.productImage.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    console.log('Creating Categories...')
    const menCat = await prisma.category.create({ data: { name: 'Men', slug: 'men' } })
    const womenCat = await prisma.category.create({ data: { name: 'Women', slug: 'women' } })
    const kidsCat = await prisma.category.create({ data: { name: 'Kids', slug: 'kids' } })
    const saleCat = await prisma.category.create({ data: { name: 'Sale', slug: 'sale' } })

    const categorySpecs = [
        { cat: menCat, key: 'men', count: 20 },
        { cat: womenCat, key: 'women', count: 20 },
        { cat: kidsCat, key: 'kids', count: 15 },
        { cat: saleCat, key: 'women', count: 10 } // Use 'women' IDs for Sale variety
    ]

    for (const spec of categorySpecs) {
        console.log(`Seeding ${spec.count} ${spec.cat.name} products...`)
        const types = productTypes[spec.key as keyof typeof productTypes]

        for (let i = 0; i < spec.count; i++) {
            const adj = getRandomEl(productAdjectives)
            const type = getRandomEl(types)
            const brand = getRandomEl(brandNames)
            const title = `${adj} ${brand} ${type} ${i + 1}`
            const randomSuffix = Math.random().toString(36).substring(7)
            const slug = `${spec.cat.slug}-${brand.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-')}-${randomSuffix}`

            const isSale = spec.cat.slug === 'sale'
            const originalPrice = isSale ? 5000 : 3000
            const discount = isSale ? 50 : 10
            const discountedPrice = originalPrice * (1 - discount / 100)

            // Distribute the 30 verified IDs across all products
            const idIdx = (i + (spec.cat.slug === 'men' ? 0 : spec.cat.slug === 'women' ? 10 : 20)) % verifiedFashionIds.length
            const firstId = verifiedFashionIds[idIdx]
            const secondId = verifiedFashionIds[(idIdx + 1) % verifiedFashionIds.length]

            await prisma.product.create({
                data: {
                    title,
                    slug,
                    description: `Premium ${adj} ${type} from the house of ${brand}. Exclusively at ELARA.`,
                    originalPrice,
                    discountedPrice,
                    brand,
                    stock: 50,
                    rating: 4.5,
                    sizes: ['S', 'M', 'L', 'XL'],
                    categoryId: spec.cat.id,
                    images: {
                        create: [
                            { url: getUnsplashUrl(firstId, 800), isDefault: true },
                            { url: getUnsplashUrl(secondId, 800), isDefault: false },
                        ]
                    }
                }
            })
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
