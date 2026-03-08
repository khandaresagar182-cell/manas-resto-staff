"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
    Menu,
    X,
    ArrowRight,
    ChevronRight,
    MapPin,
    Phone,
    Instagram,
    Facebook,
    Youtube,
    ArrowUpRight,
    UtensilsCrossed,
    Flame,
    Clock,
    Star,
    Users,
    Leaf,
    MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
}

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
}

export function ManasRestaurant() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${scrollY > 50 ? "shadow-md" : ""}`}
            >
                <div className="container flex h-16 items-center justify-between border-x border-muted">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="relative h-12 w-12 overflow-hidden rounded-full"
                            >
                                <Image src="/logo.png" alt="Manas Resto Logo" fill className="object-cover" />
                            </motion.div>
                            <span className="font-bold text-xl">Manas Resto</span>
                        </Link>
                    </div>
                    <nav className="hidden md:flex gap-3">
                        <Link href="#menu" className="text-sm font-medium transition-colors hover:text-primary">Menu</Link>
                        <Link href="#gallery" className="text-sm font-medium transition-colors hover:text-primary">Gallery</Link>
                        <Link href="#about" className="text-sm font-medium transition-colors hover:text-primary">About</Link>
                        <Link href="#reviews" className="text-sm font-medium transition-colors hover:text-primary">Reviews</Link>
                        <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">Contact</Link>
                    </nav>
                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="outline" size="sm" className="rounded-3xl">Reserve Table</Button>
                        <Button size="sm" className="rounded-3xl">Order Now</Button>
                    </div>
                    <button className="flex md:hidden" onClick={toggleMenu}>
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle menu</span>
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-background md:hidden"
                >
                    <div className="container flex h-16 items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                    <Image src="/logo.png" alt="Manas Resto Logo" fill className="object-cover" />
                                </div>
                                <span className="font-bold text-xl">Manas Resto</span>
                            </Link>
                        </div>
                        <button onClick={toggleMenu}>
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close menu</span>
                        </button>
                    </div>
                    <motion.nav variants={staggerContainer} initial="hidden" animate="visible" className="container grid gap-3 pb-8 pt-6">
                        {["Menu", "Gallery", "About", "Reviews", "Contact"].map((item, index) => (
                            <motion.div key={index} variants={itemFadeIn}>
                                <Link
                                    href={`#${item.toLowerCase()}`}
                                    className="flex items-center justify-between rounded-3xl px-3 py-2 text-lg font-medium hover:bg-accent"
                                    onClick={toggleMenu}
                                >
                                    {item}
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </motion.div>
                        ))}
                        <motion.div variants={itemFadeIn} className="flex flex-col gap-3 pt-4">
                            <Button variant="outline" className="w-full rounded-3xl">Reserve Table</Button>
                            <Button className="w-full rounded-3xl">Order Now</Button>
                        </motion.div>
                    </motion.nav>
                </motion.div>
            )}

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-10 md:py-16 lg:py-20 xl:py-20 overflow-hidden">
                    <div className="container px-4 md:px-6 border border-muted rounded-3xl bg-gradient-to-br from-background to-muted/30">
                        <div className="grid gap-3 lg:grid-cols-[1fr_400px] lg:gap-3 xl:grid-cols-[1fr_600px]">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                className="flex flex-col justify-center space-y-4 py-10"
                            >
                                <div className="space-y-3">
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="inline-flex items-center rounded-3xl bg-muted px-3 py-1 text-sm"
                                    >
                                        <Flame className="mr-1 h-3 w-3" />
                                        Authentic Maharashtrian Cuisine
                                    </motion.div>
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, delay: 0.2 }}
                                        className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                                    >
                                        Experience the authentic taste of{" "}
                                        <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                                            Maharashtra
                                        </span>
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.7, delay: 0.4 }}
                                        className="max-w-[600px] text-muted-foreground md:text-xl"
                                    >
                                        Savor our legendary Tambda-Pandhra Rassa, unlimited Mutton Thali, and
                                        traditional Kolhapuri flavors — crafted from family recipes by an Army
                                        veteran since 2004.
                                    </motion.p>
                                </div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.6 }}
                                    className="flex flex-col gap-3 sm:flex-row"
                                >
                                    <Button size="lg" className="rounded-3xl group">
                                        View Menu
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                    <Button variant="outline" size="lg" className="rounded-3xl">
                                        Reserve a Table
                                    </Button>
                                </motion.div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 100 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="flex items-center justify-center"
                            >
                                <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px] xl:h-[550px] overflow-hidden rounded-3xl">
                                    <Image
                                        src="/hero-thali.png"
                                        alt="Manas Resto - Authentic Maharashtrian Thali with Tambda Rassa, Pandhra Rassa and Bhakri"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section id="highlights" className="w-full py-12 md:py-16 lg:py-20">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/20"
                    >
                        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
                            <div className="space-y-3">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                                >
                                    Why Choose Us
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                                >
                                    The Manas Experience
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                                >
                                    What makes Manas Resto Lounge a must-visit destination on the Pune-Kolhapur Highway
                                </motion.p>
                            </div>
                        </div>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="mx-auto grid grid-cols-2 items-center gap-3 py-8 md:grid-cols-3 lg:grid-cols-6"
                        >
                            {[
                                { icon: "⭐", title: "4.5★ Rating", subtitle: "1176+ Reviews" },
                                { icon: "🕐", title: "Since 2004", subtitle: "20+ Years Legacy" },
                                { icon: "🍖", title: "Unlimited Thali", subtitle: "Mutton & Chicken" },
                                { icon: "🪖", title: "Army Veteran", subtitle: "Owned & Operated" },
                                { icon: "📍", title: "NH48 Highway", subtitle: "Easy Access" },
                                { icon: "🌿", title: "Fresh & Hygienic", subtitle: "Quality First" },
                            ].map((item, i) => (
                                <motion.div key={i} variants={itemFadeIn} whileHover={{ scale: 1.05 }} className="flex items-center justify-center">
                                    <div className="rounded-3xl border p-6 bg-background/80 hover:shadow-md transition-all text-center w-full">
                                        <span className="text-3xl">{item.icon}</span>
                                        <h3 className="mt-2 font-bold text-sm">{item.title}</h3>
                                        <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                {/* Menu Section */}
                <section id="menu" className="w-full py-12 md:py-24 lg:py-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="container px-4 md:px-6 border border-muted rounded-3xl"
                    >
                        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
                            <div className="space-y-3">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                                >
                                    Our Menu
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                                >
                                    Our Signature Menu
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                                >
                                    Traditional Maharashtrian delicacies prepared with authentic family recipes and the freshest ingredients
                                </motion.p>
                            </div>
                        </div>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="mx-auto grid max-w-5xl items-center gap-3 py-12 md:grid-cols-2 lg:grid-cols-3"
                        >
                            {[
                                { icon: <Flame className="h-10 w-10 text-primary" />, title: "Tambda Rassa", description: "Our iconic spicy red mutton curry — a fiery Kolhapuri classic bursting with bold spices and tender meat." },
                                { icon: <UtensilsCrossed className="h-10 w-10 text-primary" />, title: "Pandhra Rassa", description: "A soothing coconut-based white curry with aromatic spices. The perfect companion to our Tambda Rassa." },
                                { icon: <Star className="h-10 w-10 text-primary" />, title: "Unlimited Mutton Thali", description: "Our signature thali with mutton curry, rice, bhakri, chapati, solkadhi, thecha, and unlimited refills." },
                                { icon: <Users className="h-10 w-10 text-primary" />, title: "Chicken Thali", description: "Tender chicken prepared Kolhapuri style with aromatic gravy, served with rice, bhakri, and all accompaniments." },
                                { icon: <Leaf className="h-10 w-10 text-primary" />, title: "Veg Maharashtrian", description: "Pure vegetarian Maharashtrian thali with daily changing preparations — Malvani veggies, dal, rice, and bhakri." },
                                { icon: <MessageSquare className="h-10 w-10 text-primary" />, title: "Specials & Biryani", description: "Kala Mutton, Gaavran Jatra Mutton, Keema, Chicken Dum Biryani, Misal Pav, and seasonal specials." },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    variants={itemFadeIn}
                                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                    className="group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md bg-background/80"
                                >
                                    <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"></div>
                                    <div className="relative space-y-3">
                                        <div className="mb-4">{item.icon}</div>
                                        <h3 className="text-xl font-bold">{item.title}</h3>
                                        <p className="text-muted-foreground">{item.description}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <Link href="#contact" className="text-sm font-medium text-primary underline-offset-4 hover:underline">Order now</Link>
                                        <motion.div whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                                            <ArrowRight className="h-4 w-4 text-primary" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                {/* Gallery Section */}
                <section id="gallery" className="w-full py-12 md:py-24 lg:py-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/10"
                    >
                        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
                            <div className="space-y-3">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm"
                                >
                                    Gallery
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
                                >
                                    Our Gallery
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
                                >
                                    A glimpse into our food, ambiance, and the Manas dining experience
                                </motion.p>
                            </div>
                        </div>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="mx-auto grid max-w-7xl gap-3 py-12 md:grid-cols-4 md:grid-rows-2 lg:gap-3"
                        >
                            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="group relative overflow-hidden rounded-3xl md:col-span-2 md:row-span-2 h-[400px] md:h-auto">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <Image src="https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=1200&h=800&fit=crop" alt="Unlimited Mutton Thali" fill className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                    <h3 className="text-xl font-bold">Unlimited Mutton Thali</h3>
                                    <p className="text-sm">Our legendary thali with Tambda-Pandhra Rassa, bhakri & more</p>
                                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-3">
                                        <Button variant="outline" size="sm" className="rounded-3xl bg-white/20 backdrop-blur-sm border-white/40 text-white hover:bg-white/30">
                                            View Details <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="group relative overflow-hidden rounded-3xl h-[200px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <Image src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=600&fit=crop" alt="Restaurant Ambiance" fill className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                    <h3 className="text-xl font-bold">Restaurant Ambiance</h3>
                                    <p className="text-sm">Elegant interiors with artistic mood lighting</p>
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="group relative overflow-hidden rounded-3xl h-[200px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <Image src="https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=600&fit=crop" alt="Tambda Rassa - Spicy red mutton curry" fill className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                    <h3 className="text-xl font-bold">Tambda Rassa</h3>
                                    <p className="text-sm">Our fiery signature red mutton curry</p>
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="group relative overflow-hidden rounded-3xl h-[200px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop" alt="Outdoor Seating" fill className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                    <h3 className="text-xl font-bold">Outdoor Seating</h3>
                                    <p className="text-sm">Spacious open-air dining with scenic views</p>
                                </div>
                            </motion.div>
                            <motion.div variants={itemFadeIn} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }} className="group relative overflow-hidden rounded-3xl md:col-span-2 h-[200px]">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                                <Image src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop" alt="Traditional Maharashtrian food spread" fill className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                    <h3 className="text-xl font-bold">Traditional Spread</h3>
                                    <p className="text-sm">Authentic Maharashtrian feast with all the trimmings</p>
                                </div>
                            </motion.div>
                        </motion.div>
                        <div className="flex justify-center pb-10">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" className="rounded-3xl group">
                                    View Full Gallery
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* About Section */}
                <section id="about" className="w-full py-12 md:py-24 lg:py-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="container px-4 md:px-6 border border-muted rounded-3xl"
                    >
                        <div className="grid gap-3 lg:grid-cols-2 lg:gap-3">
                            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-4 p-6">
                                <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">Our Story</div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">From Army to Kitchen</h2>
                                <p className="text-muted-foreground md:text-xl/relaxed">
                                    Manas Resto Lounge was founded in 2004 by <strong>Sanjay Shirsagar</strong>, a retired
                                    Indian Army veteran. After years of disciplined service to the nation, he pursued his
                                    passion for cooking and decided to bring his family&apos;s treasured Maharashtrian recipes
                                    to the world.
                                </p>
                                <p className="text-muted-foreground md:text-xl/relaxed">
                                    Today, Manas has become a landmark on the Pune-Kolhapur Highway, beloved by travelers
                                    and food enthusiasts alike for its authentic Kolhapuri flavors, generous portions,
                                    and the warm hospitality that comes from a tradition of service.
                                </p>
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Button variant="outline" size="lg" className="rounded-3xl">Our Journey</Button>
                                    <Button variant="outline" size="lg" className="rounded-3xl">Visit Us</Button>
                                </div>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center justify-center">
                                <div className="relative h-[350px] w-full md:h-[450px] lg:h-[500px] overflow-hidden rounded-3xl">
                                    <Image src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&h=1080&fit=crop" alt="Manas Resto Lounge - Warm restaurant interior" fill className="object-cover" />
                                </div>
                            </motion.div>
                        </div>
                        <div className="mt-16 px-6 pb-10">
                            <motion.h3 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-2xl font-bold tracking-tighter sm:text-3xl">
                                By the Numbers
                            </motion.h3>
                            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                                {[
                                    { number: "20+", label: "Years of Service", icon: <Clock className="h-6 w-6 text-primary" /> },
                                    { number: "4.5★", label: "Google Rating", icon: <Star className="h-6 w-6 text-primary" /> },
                                    { number: "1176+", label: "Happy Reviews", icon: <MessageSquare className="h-6 w-6 text-primary" /> },
                                    { number: "1000+", label: "Daily Guests", icon: <Users className="h-6 w-6 text-primary" /> },
                                ].map((stat, index) => (
                                    <motion.div key={index} variants={itemFadeIn} whileHover={{ y: -10 }} className="rounded-3xl border bg-background/80 p-6 text-center shadow-sm hover:shadow-md transition-all">
                                        <div className="flex justify-center mb-3">{stat.icon}</div>
                                        <h4 className="text-3xl font-bold text-primary">{stat.number}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Reviews */}
                <section id="reviews" className="w-full py-12 md:py-24 lg:py-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="container px-4 md:px-6 border border-muted rounded-3xl bg-muted/20"
                    >
                        <div className="flex flex-col items-center justify-center space-y-4 text-center py-10">
                            <div className="space-y-3">
                                <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-block rounded-3xl bg-background px-3 py-1 text-sm">Reviews</motion.div>
                                <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Guests Say</motion.h2>
                                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mx-auto max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Hear from our guests who keep coming back for the authentic Maharashtrian experience
                                </motion.p>
                            </div>
                        </div>
                        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mx-auto grid max-w-5xl gap-3 py-12 lg:grid-cols-2">
                            {[
                                { quote: "The Tambda-Pandhra Rassa here is absolutely incredible. Best I've had on the entire Pune-Kolhapur route. The unlimited mutton thali is worth every rupee!", author: "Rajesh Patil", company: "Food Enthusiast, Pune" },
                                { quote: "We stop at Manas every time we travel to Satara. The Kala Mutton is to die for, and the staff is always welcoming. The complimentary masala paan is a lovely touch.", author: "Priya Kulkarni", company: "Travel Blogger" },
                                { quote: "Cleanest restaurant on the highway! The food is fresh, portions are generous, and the bhakri with thecha is simply outstanding. A true Maharashtrian gem.", author: "Amit Deshmukh", company: "Regular Customer, Mumbai" },
                                { quote: "Visited with family and everyone loved the food. The veg thali was equally fantastic. Great ambiance, especially the outdoor seating area. Highly recommended!", author: "Sneha Joshi", company: "Family Dining, Kolhapur" },
                            ].map((testimonial, index) => (
                                <motion.div key={index} variants={itemFadeIn} whileHover={{ y: -10 }} className="flex flex-col justify-between rounded-3xl border bg-background p-6 shadow-sm">
                                    <div>
                                        <div className="flex gap-0.5 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <blockquote className="mt-4 text-lg font-medium leading-relaxed">&quot;{testimonial.quote}&quot;</blockquote>
                                    </div>
                                    <div className="mt-6 flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                            <span className="text-sm font-bold text-primary">{testimonial.author[0]}</span>
                                        </div>
                                        <div className="ml-4">
                                            <p className="font-medium">{testimonial.author}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="w-full py-12 md:py-24 lg:py-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="container grid items-center gap-3 px-4 md:px-6 lg:grid-cols-2 border border-muted rounded-3xl"
                    >
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-3 p-6">
                            <div className="inline-block rounded-3xl bg-muted px-3 py-1 text-sm">Contact</div>
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Visit Us Today</h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Come experience the authentic taste of Maharashtra. We&apos;re conveniently located on the
                                Pune-Kolhapur Highway. Walk-ins welcome, reservations recommended for large groups.
                            </p>
                            <div className="mt-8 space-y-4">
                                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                                    <div className="rounded-3xl bg-muted p-2"><MapPin className="h-5 w-5 text-primary" /></div>
                                    <div>
                                        <h3 className="font-medium">Our Location</h3>
                                        <p className="text-sm text-muted-foreground">Kolhapur-Pune Highway (NH48), Opp. DSK Toyota, Varye, Satara, Maharashtra 415011</p>
                                    </div>
                                </motion.div>
                                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                                    <div className="rounded-3xl bg-muted p-2"><Phone className="h-5 w-5 text-primary" /></div>
                                    <div>
                                        <h3 className="font-medium">Call Us</h3>
                                        <p className="text-sm text-muted-foreground">+91 99238 87001</p>
                                    </div>
                                </motion.div>
                                <motion.div whileHover={{ x: 5 }} className="flex items-start gap-3">
                                    <div className="rounded-3xl bg-muted p-2"><Clock className="h-5 w-5 text-primary" /></div>
                                    <div>
                                        <h3 className="font-medium">Opening Hours</h3>
                                        <p className="text-sm text-muted-foreground">11:00 AM – 11:00 PM, 7 days a week</p>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="mt-8 flex space-x-3">
                                {[
                                    { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                                    { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                                    { icon: <Youtube className="h-5 w-5" />, label: "YouTube" },
                                ].map((social, index) => (
                                    <motion.div key={index} whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                        <Link href="#" className="rounded-3xl border p-2 text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                                            {social.icon}
                                            <span className="sr-only">{social.label}</span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="rounded-3xl border bg-background p-6 shadow-sm">
                            <h3 className="text-xl font-bold">Make a Reservation</h3>
                            <p className="text-sm text-muted-foreground">Book your table and we&apos;ll have everything ready for you.</p>
                            <form className="mt-6 space-y-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="guest-name" className="text-sm font-medium leading-none">Full Name</label>
                                        <Input id="guest-name" placeholder="Enter your name" className="rounded-3xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="guest-phone" className="text-sm font-medium leading-none">Phone Number</label>
                                        <Input id="guest-phone" type="tel" placeholder="+91 XXXXX XXXXX" className="rounded-3xl" />
                                    </div>
                                </div>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="visit-date" className="text-sm font-medium leading-none">Date</label>
                                        <Input id="visit-date" type="date" className="rounded-3xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="party-size" className="text-sm font-medium leading-none">Party Size</label>
                                        <Input id="party-size" type="number" placeholder="Number of guests" className="rounded-3xl" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="special-request" className="text-sm font-medium leading-none">Special Requests</label>
                                    <Textarea id="special-request" placeholder="Any special requirements or preferences..." className="min-h-[100px] rounded-3xl" />
                                </div>
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button type="submit" className="w-full rounded-3xl">Reserve Table</Button>
                                </motion.div>
                            </form>
                        </motion.div>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="container grid gap-3 px-4 py-10 md:px-6 lg:grid-cols-4 border-x border-muted">
                    <div className="space-y-3">
                        <Link href="/" className="flex items-center space-x-3">
                            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="relative h-12 w-12 overflow-hidden rounded-full">
                                <Image src="/logo.png" alt="Manas Resto Logo" fill className="object-cover" />
                            </motion.div>
                            <span className="font-bold text-xl">Manas Resto</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">Serving authentic Maharashtrian flavors since 2004. Experience the legendary Tambda-Pandhra Rassa and unlimited thali on the Pune-Kolhapur Highway.</p>
                        <div className="flex space-x-3">
                            {[
                                { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
                                { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
                                { icon: <Youtube className="h-5 w-5" />, label: "YouTube" },
                            ].map((social, index) => (
                                <motion.div key={index} whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Link href="#" className="text-muted-foreground hover:text-foreground">{social.icon}<span className="sr-only">{social.label}</span></Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div>
                            <h3 className="text-lg font-medium">Quick Links</h3>
                            <nav className="mt-4 flex flex-col space-y-2 text-sm">
                                <Link href="#menu" className="text-muted-foreground hover:text-foreground">Our Menu</Link>
                                <Link href="#gallery" className="text-muted-foreground hover:text-foreground">Gallery</Link>
                                <Link href="#about" className="text-muted-foreground hover:text-foreground">About Us</Link>
                                <Link href="#reviews" className="text-muted-foreground hover:text-foreground">Reviews</Link>
                            </nav>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Popular Dishes</h3>
                            <nav className="mt-4 flex flex-col space-y-2 text-sm">
                                <Link href="#menu" className="text-muted-foreground hover:text-foreground">Tambda Rassa</Link>
                                <Link href="#menu" className="text-muted-foreground hover:text-foreground">Pandhra Rassa</Link>
                                <Link href="#menu" className="text-muted-foreground hover:text-foreground">Unlimited Mutton Thali</Link>
                                <Link href="#menu" className="text-muted-foreground hover:text-foreground">Kala Mutton</Link>
                            </nav>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <div>
                            <h3 className="text-lg font-medium">Visit Us</h3>
                            <nav className="mt-4 flex flex-col space-y-2 text-sm">
                                <span className="text-muted-foreground">NH48, Opp. DSK Toyota, Varye, Satara 415011</span>
                                <span className="text-muted-foreground">📞 +91 99238 87001</span>
                                <span className="text-muted-foreground">🕐 11:00 AM – 11:00 PM</span>
                                <span className="text-muted-foreground">Open 7 days a week</span>
                            </nav>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium">Directions</h3>
                            <nav className="mt-4 flex flex-col space-y-2 text-sm">
                                <Link href="#" className="text-muted-foreground hover:text-foreground">From Pune (via NH48)</Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">From Kolhapur (via NH48)</Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">Near Sajjangad</Link>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">Google Maps</Link>
                            </nav>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-lg font-medium">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground">Get updates on special thali offers, festive menus, and new dishes.</p>
                        <form className="flex space-x-3">
                            <Input type="tel" placeholder="Enter your phone number" className="max-w-lg flex-1 rounded-3xl" />
                            <Button type="submit" className="rounded-3xl">Subscribe</Button>
                        </form>
                    </div>
                </motion.div>
                <div className="border-t">
                    <div className="container flex flex-col items-center justify-between gap-3 py-6 md:h-16 md:flex-row md:py-0">
                        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Manas Resto Lounge. All rights reserved.</p>
                        <p className="text-xs text-muted-foreground">Serving authentic Maharashtrian flavors since 2004 — Satara, Maharashtra</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
