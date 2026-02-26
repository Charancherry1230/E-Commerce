import { getTrendingProducts } from '@/actions/product'
import { ProductCard } from '@/components/product/ProductCard'
import { Hero } from '@/components/home/Hero'
import Link from 'next/link'

export default async function Home() {
  const trendingProducts = await getTrendingProducts(8)

  return (
    <div className="flex flex-col">
      {/* Cinematic Hero */}
      <Hero />

      {/* Trending Section */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Trending Now</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Discover the most coveted pieces of the season. Handpicked styles blending local essence with global luxury.
            </p>
          </div>
          <Link href="/category/sale">
            <button className="text-sm font-bold uppercase tracking-widest text-slate-900 hover:text-amber-500 transition-colors pb-1 border-b-2 border-slate-900 hover:border-amber-500">
              View All Collection
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {trendingProducts.length === 0 && (
          <div className="text-center py-20 bg-slate-100 rounded-lg border border-slate-200">
            <h3 className="text-2xl font-serif text-slate-500">No products found. Please run the seed script.</h3>
          </div>
        )}
      </section>

      {/* Promise Sections */}
      <section className="bg-slate-900 text-slate-50 py-24 px-8 mt-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h4 className="font-serif text-2xl mb-4 text-amber-500">Authentic Luxury</h4>
            <p className="text-slate-400 leading-relaxed">Genuine designs curated from the best ethnic and western premium creators.</p>
          </div>
          <div>
            <h4 className="font-serif text-2xl mb-4 text-amber-500">Secure Delivery</h4>
            <p className="text-slate-400 leading-relaxed">Express insured shipping across India. From our studio straight to your doorstep.</p>
          </div>
          <div>
            <h4 className="font-serif text-2xl mb-4 text-amber-500">Seamless Returns</h4>
            <p className="text-slate-400 leading-relaxed">14-day hassle-free return policy. We stand by our quality and your satisfaction.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
