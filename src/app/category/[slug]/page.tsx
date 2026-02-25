import { getProductsByCategory } from '@/actions/product'
import { ProductCard } from '@/components/product/ProductCard'
import { FilterSidebar } from '@/components/product/FilterSidebar'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    // Await the entire params object according to Next.js 15
    const { slug } = await params

    const products = await getProductsByCategory(slug)
    const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1)

    return (
        <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto w-full min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">{categoryTitle} Collection</h1>
                <p className="text-slate-500 text-lg">Curated essentials to elevate your wardrobe, combining comfort with signature style.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative items-start">
                {/* Sticky Filter Sidebar */}
                <FilterSidebar />

                {/* Product Grid */}
                <div className="flex-1 w-full">
                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-lg">
                            <h3 className="text-2xl font-serif text-slate-500 mb-2">No products found for {categoryTitle}</h3>
                            <p className="text-slate-400">Please check back later or run the database seeder.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
