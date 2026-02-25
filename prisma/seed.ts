import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Curated high-quality Unsplash image IDs for Indian/Global fashion vibe
const menImageIds = [
    "47VH0ch4A", "qNF8jx8ZsFY", "AMF30EQ338", "qYqCrZDDRIs", "2bAaTFCD8ZQ", "8iOm8L2smKk", "oE0g5PycS2s", "JUoxG4sp88", "Yz2rv8CQXiQ", "YAWSHBdjdO0",
    "tFaLxWkeEnA", "tQgJ7DnLXWU", "jyVA8bQnxhY", "7I0umiKzwgc", "RpsLrvshznE", "2qGXz5A17mc", "4fkUAduhoSY", "xOeDm_gT90k", "N_dEi1iG69s", "0fnbTKv8Du8",
    "DuY4JP2M34Q", "IGwBMtsHK9A", "zZxQm6td7CY", "6__eMw1z7Sc", "cp4ucXlnhYw", "5anIARNFp7Y", "XycyFueNfBM", "w30IlJxlfZQ", "JjWTksddg3A", "uYrnatTOIGM",
    "40pJDZt9gI4", "hNoSCxPWYII", "A5nuQ2Lvg40", "U6P1lJjQgm4", "gRBP3hqIGMg", "OvgYOJausq8", "gSKQnv55TGA", "r8ug6Sk51mc", "LVJHabrJ2C4", "biszLGBBYXA",
    "1nnlj4OQ2Ck", "V2SCZCVHTME", "6wCIOax9qaY", "r62xmltDrsU", "OX4Gp2oApyY", "vS0Kya7E5V4", "vJzw1Ovj5y4", "RuBXafq461A", "Ll6ggwPpKIo", "c3mO6jMKWkA",
    "x07Cr3RlcGU", "5KyzZbonwqQ", "EqT63xeapb0", "1rfAP5hEL0o", "XMhkDGTLJqg", "ThIYQclQiR0", "I8q9M1vg0", "sc05IkcElmo", "3L3wJCkiZWw", "3YYhmZ1Ltqo"
]

const womenImageIds = [
    "wPe_57r0NCU", "K0DxxljcRv0", "IXYxqP4zejo", "uR51HXLO7G0", "UIPjy2XRoJQ", "u5TWk0wlkw0", "6Z1ZodAmLFk", "ooMvbtSZu1M", "zi5QQl26vaM", "XJt51hAa3z8",
    "oFYl4ff_UrY", "OzEiSTZlyHw", "MkqVieSpi5U", "nSmkZ4AfL2M", "nimElTcTNyY", "_3Q3tsJ01nc", "YV8kl81E95E", "BteCp6aq4GI", "wXCQCVpsRQ0", "68csPWTnafo",
    "OVS3rqXq9gg", "EFV2xswNfUQ", "wTFrasPG4d4", "QSi1msJwkpM", "NJAFmCuIx1s", "3GIpwFvPQUU", "RrOw2yodWpo", "jaZoffxg1yc", "eXWafeeBpsM", "UqT55tGBqzI",
    "RQO2DmrRJFg", "HMhRTbuSEhY", "CyhO1L56kYw", "Abm4nWU36QU", "qmyebfKk3pw", "5ycQD13aSWQ", "8Ptqsbl_saQ", "Xn7GvimQrk8", "U6a6zC3P8tM", "pwir1Mr1eMA",
    "tCDs3E8zGgA", "0X4na5XHgp4", "nqZpytF1rlQ", "0_zNOZ95Kg0", "xAlhQl1f5xY", "bQvoWquWSDk", "AyZRWubGELo", "PvcPRQgQoq0", "6W8gVEmi2qI", "KOywBUfeoV4",
    "l9DqWpbEosQ", "MBDtczhH78A", "JMIEBRdaXBU", "DvXdnu8tZpY", "eRXfaXUIM0I", "nTLcbrCUVBQ", "iiOgRYEXohI", "5Kr2EbvSmxg", "WrwAmJINKbk", "eFd132P8Qik"
]

const kidsImageIds = [
    "1VSV2oTUULQ", "du2JnmcSvX0", "GCDjllzoKLo", "4Bgt9ySOBq4", "pUEdf3FQajk", "9fafUg461o8", "frBq18la0_E", "EEN1eiUrZYY", "PVwcrzPNTpw", "gNwgPzrAqvQ",
    "jULtE1nV_P0", "xLgVze8ZxA8", "PK_SHakVl04", "N1hHqgJg58A", "TXvCcWl3nEI", "n9R0MN3XGvY", "Ci5AysW87o4", "_r_cc8rudpg", "v64tbMCW8Is", "8VG8S088EGs",
    "yAQI1YOUuXM", "jlo7Bf4tUoY", "7r1es8oXKCU", "NV_IPwv0Saw", "fwJMG9zm3dI", "DyL0KAEY70s", "e6lWMBIgNso", "OPTW9ruQPyc", "sFTbqa_ibwM", "PWcJ9t7Ne_Q",
    "wZSnRgk3VuE", "JrrWC7Qcmhs", "GvleXr4tIPk", "TgJoOJGg3TE", "KRr5QqQfoXc", "kgMGnC2vM", "l3YZXXWCZqo", "FZi4VWZUguk", "H2qrmxIsN4E", "OwPUJIDxY1E",
    "AMXGsIsXTu8", "FNLpmjV1rOY", "nTeghaUHDiU", "HjjblSSOy40", "IGGSZIa_9Z4", "LHoK1A8IXeo", "yAS082fvix8", "Olq2PpMVoi4", "n5qeLebIxpU", "FKBg2JNYFFc"
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
    const counts = { men: 50, women: 50, kids: 40, sale: 30 }

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
            const title = `${adj} ${brand} ${type} - ${i + 1}`
            const randomSuffix = Math.random().toString(36).substring(7)
            const slug = `${cat.slug}-${brand.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-')}-${randomSuffix}`

            const isSale = cat.slug === 'sale'
            const originalPrice = isSale ? Math.floor(Math.random() * 6000) + 3000 : Math.floor(Math.random() * 4000) + 1500
            const discount = isSale ? Math.floor(Math.random() * 20) + 40 : Math.floor(Math.random() * 20) + 10
            const discountedPrice = Math.floor(originalPrice * (1 - discount / 100))

            // Use modulo to ensure we rotate through the large pool of unique IDs
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
            if (i > 0 && i % 10 === 0) console.log(`  ...seeded ${i} ${cat.name} items`)
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
