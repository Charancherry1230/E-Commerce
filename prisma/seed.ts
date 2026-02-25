import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Verified long-form IDs that work 100% with images.unsplash.com/photo-
const menImageIds = [
    '1617137968427-85924c800a22', '1593030761757-71fae45fa0e7', '1618355272234-1b40ce32836b',
    '1539248449284-7d2d10ade77c', '1500648767791-00dcc994a43e', '1488161628813-f4460fb572ed',
    '1492562080023-ab3db95bfbce', '1504593811403-5114948ba3a1', '1519085188583-8af53e4828df',
    '1531427186611-ecfd6d936c79', '1506794778202-cad84cf45f1d', '1507679799987-c7cf77747eda',
    '1490114538077-0a7f8cb49891', '1552519507-da3b142c6e3d', '1602810318383-e386cc2a3ccf',
    '1552642986-ccb41e7059e7', '1550246140-5119ae4790b8', '1496302662897-471602ed3aaf',
    '1516257988835-0525ebf73e2b', '1539248449284-7d2d10ade77c'
]

const womenImageIds = [
    '1485462535030-d3c33368c73a', '1525507119028-ed4c629a60a3', '1515886657613-9f3515b0c78f',
    '1539106602058-717fc3c38b24', '1509631179647-0177331693ae', '1494790108377-be9c29b29330',
    '1503342217505-b0a15ec3261c', '1492706602009-4a35cf0ceaf2', '1503341452395-eee2340026b0',
    '1610030469983-98e550d6193c', '1583391733958-650fac5ecfec', '1550614000-4b95dd2db1eb',
    '1504198453319-5ce911baf5ea', '1506667523932-e919e73c9517', '1511130547748-0ca50693d2b2',
    '1496747611176-843222e1e57c', '1502716119720-b23a93e5fe1b', '1495995424756-6a5a3f9e7543',
    '1501710172774-ad1883fe18bc', '1517841905240-472988babdf9'
]

const kidsImageIds = [
    '1622290291468-a28f7a7dc6a8', '1519238263530-99abc11edfc6', '1503919545889-aef636e10ad4',
    '1475711400044-2701f278306e', '1514090458221-65bb69af63e6', '1513977055326-8ae6272d90a7',
    '1537673156262-9989dab8b200', '1510255333410-45a98d303a39', '1519340241574-246a77d8cb21',
    '1519457431-7ad298ebde78', '1520206183501-b80af970d8cb', '1533512930330-4ac257c8bfbc',
    '1444858291040-583b167523d8', '1503454537195-0df99d2b6913', '1516627145497-ae6968895b74'
]

const brandNames = [
    'ELARA Luxe', 'House of Pataudi', 'Royal Fabrik', 'Zivame Premium', 'Mango Elite',
    'Biba Signatures', 'W Prime', 'Raymond Luxe', 'Peter England', 'Allen Solly',
    'Manyavar', 'Mohey', 'Global Desi', 'Anita Dongre', 'Sabyasachi', 'FabIndia',
    'Ritu Kumar', 'Manish Malhotra', 'Tarun Tahiliani', 'Anita Dongre', 'Neeta Lulla'
]

const productAdjectives = ['Silk', 'Cotton', 'Linen', 'Premium', 'Artisan', 'Designer', 'Limited', 'Heritage', 'Organic', 'Handcrafted']
const productTypes = {
    men: ['Kurta', 'Blazer', 'Shirt', 'Trousers', 'Bandhgala', 'Sherwani', 'Polo', 'Jeans'],
    women: ['Saree', 'Anarkali', 'Lehenga', 'Top', 'Dress', 'Evening Gown', 'Tunic', 'Skirt'],
    kids: ['Tee', 'Frock', 'Shorts', 'Jumpsuit', 'Ethnic Set', 'Sweater', 'Tracksuit', 'Leggings']
}

function getRandomEl<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
}

function getUnsplashUrl(id: string, width = 600) {
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${width}`
}

async function main() {
    console.log('Clearing existing entries...')
    try {
        await prisma.productImage.deleteMany()
        await prisma.orderItem.deleteMany()
        await prisma.product.deleteMany()
        await prisma.category.deleteMany()
    } catch (e) {
        console.log('No existing products to clear.')
    }

    console.log('Creating Categories...')
    const menCat = await prisma.category.create({
        data: { name: 'Men', slug: 'men', description: 'Premium menswear collection' },
    })
    const womenCat = await prisma.category.create({
        data: { name: 'Women', slug: 'women', description: 'Elegant womenswear collection' },
    })
    const kidsCat = await prisma.category.create({
        data: { name: 'Kids', slug: 'kids', description: 'Playful kidswear collection' },
    })
    const saleCat = await prisma.category.create({
        data: { name: 'Sale', slug: 'sale', description: 'Limited time offers and discounts' },
    })

    const categories = [menCat, womenCat, kidsCat, saleCat]
    const counts = { men: 20, women: 20, kids: 15, sale: 10 }

    for (const cat of categories) {
        const count = counts[cat.slug as keyof typeof counts] || 10
        const catKey = cat.slug === 'sale' ? getRandomEl(['men', 'women', 'kids']) : cat.slug
        const ids = catKey === 'men' ? menImageIds : catKey === 'women' ? womenImageIds : kidsImageIds
        const types = productTypes[catKey as keyof typeof productTypes]

        console.log(`Seeding ${count} ${cat.name} products...`)

        for (let i = 0; i < count; i++) {
            const adj = getRandomEl(productAdjectives)
            const type = getRandomEl(types)
            const brand = getRandomEl(brandNames)
            const title = `${adj} ${brand} ${type} ${i + 1}`
            const randomSuffix = Math.random().toString(36).substring(7)
            const slug = `${cat.slug}-${brand.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-')}-${randomSuffix}`

            const isSale = cat.slug === 'sale'
            const originalPrice = isSale ? Math.floor(Math.random() * 6000) + 3000 : Math.floor(Math.random() * 4000) + 1500
            const discount = isSale ? Math.floor(Math.random() * 20) + 40 : Math.floor(Math.random() * 20) + 10
            const discountedPrice = Math.floor(originalPrice * (1 - discount / 100))

            const mainImgId = ids[i % ids.length]
            const altImg1Id = ids[(i + 1) % ids.length]
            const altImg2Id = ids[(i + 2) % ids.length]

            await prisma.product.create({
                data: {
                    title,
                    slug,
                    description: `This ${adj} ${type} from ${brand} represents the peak of modern Indian craftsmanship. Exclusive to ELARA.`,
                    originalPrice,
                    discountedPrice,
                    brand,
                    stock: Math.floor(Math.random() * 50) + 5,
                    rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)),
                    sizes: ['S', 'M', 'L', 'XL'],
                    categoryId: cat.id,
                    images: {
                        create: [
                            { url: getUnsplashUrl(mainImgId, 600), isDefault: true },
                            { url: getUnsplashUrl(altImg1Id, 800), isDefault: false },
                            { url: getUnsplashUrl(altImg2Id, 800), isDefault: false },
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
