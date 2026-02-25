'use client'

import { motion, Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function Hero() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    }

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Background Image / Overlay */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image
                    src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80"
                    alt="Premium Fashion Vibe"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-top opacity-50 parallax"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-7xl mx-auto px-8 w-full text-center flex flex-col items-center mt-20"
            >
                <motion.p variants={itemVariants} className="text-amber-500 uppercase tracking-[0.3em] font-bold text-sm mb-6">
                    The New Standard
                </motion.p>

                <motion.h1 variants={itemVariants} className="font-serif text-5xl md:text-7xl lg:text-8xl text-white max-w-4xl leading-[1.1] mb-8">
                    Redefining <br /><span className="italic font-light opacity-90">Indian Luxury</span>
                </motion.h1>

                <motion.p variants={itemVariants} className="text-slate-300 text-lg md:text-xl max-w-2xl font-light mb-12">
                    Discover a curated collection where traditional roots meet avant-garde modern design. Experience apparel crafted for distinction.
                </motion.p>

                <motion.div variants={itemVariants}>
                    <Button className="bg-white text-slate-900 hover:bg-amber-500 hover:text-white px-8 py-6 rounded-none text-lg transition-all duration-300 group">
                        Explore Collection
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    )
}
