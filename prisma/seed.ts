import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Category-specific verified Unsplash IDs
const verifiedMenIds = [
    '1512413807212-0051e89b8cc5', '1617137984095-74e4e5e361add', '1480455450282-e1f4dd45a16d',
    '1492288991661-058aa541ff43', '1560241070-5dbfccc3076f', '1504593811411-9b17094d1ece',
    '1488161628813-04466f872507', '1507003211169-0a1dd7228f2d', '1484515555198-46765da74e1e',
    '1535044431057-bd7ef33f52a7'
]

const verifiedWomenIds = [
    '1483985988355-763728e1935b', '1529139574466-a303027c1d8b', '1603189343302-e603f7add05a',
    '1571513800374-df1bbe650e56', '1492707892479-7bc8d5a4ee93', '1490481651871-ab68de25d43d',
    '1509631179647-0177331693ae', '1571513722275-4b41940f54b8', '1445205170230-053b83016050',
    '1596993100471-c3905dafa78e'
]

const verifiedKidsIds = [
    '1513258496038-59423b3f2334', '1519689680058-324335c77eba', '1471286174890-9c1122df39cb',
    '1622290204634-2e91500f135b', '1503945438517-f65904a52ce6', '1540479859555-17af45c78602',
    '1519340333755-56e9c1d04579', '1434389670869-c4e933c0bd46', '1504051771394-dd2ea012bd84',
    '1473280025148-643f5b0cd93a'
]

function getIdsForCategory(slug: string) {
    if (slug === 'men') return verifiedMenIds;
    if (slug === 'kids') return verifiedKidsIds;
    return verifiedWomenIds; // Default and for women/sale
}

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

            const categoryIds = getIdsForCategory(spec.cat.slug)
            const idIdx = i % categoryIds.length
            const firstId = categoryIds[idIdx]
            const secondId = categoryIds[(idIdx + 1) % categoryIds.length]

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
