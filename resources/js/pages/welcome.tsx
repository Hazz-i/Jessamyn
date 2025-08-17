import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import logoUrl from '../../../public/jessamyn_logo.png';

const navbarMenu = [
    { title: 'Home', href: '/' },
    { title: 'Resources', href: '/resources' },
    { title: 'Products', href: '/products' },
    { title: 'Company', href: '/company' },
    { title: 'About Us', href: '/about' },
];

const products = [
    {
        name: 'LIVING ORGANIC',
        price: 21,
        rating: '4.6',
        image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'PERFECT START',
        price: 16,
        rating: '4.8',
        image: 'https://images.unsplash.com/photo-1589035981032-0b3b9d7a4f3f?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'ORGANIC BOOSTER',
        price: 18,
        rating: '4.5',
        image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=800&auto=format&fit=crop',
    },
    {
        name: 'PENNINGTON',
        price: 24,
        rating: '4.6',
        image: 'https://images.unsplash.com/photo-1604335399104-9b3b8c9b2bfa?q=80&w=800&auto=format&fit=crop',
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-black">
            {/* header */}
            <header className="flex items-center justify-between p-4 md:px-8">
                <span className="flex items-center gap-2">
                    <img src={logoUrl} alt="Logo" className="h-8" />
                    <h1 className="font-medium">Jessamyn</h1>
                </span>

                <nav className="hidden md:block">
                    <ul className="flex space-x-4">
                        {navbarMenu.map((item) => (
                            <li key={item.title}>
                                <Link href={item.href} className="hover:underline">
                                    {item.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="hidden border-gray-200 bg-white sm:inline-flex">
                        Get Started
                    </Button>

                    <button
                        className="inline-flex items-center justify-center rounded-md p-2 md:hidden"
                        onClick={() => setMobileOpen((s) => !s)}
                        aria-label="Toggle menu"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                            />
                        </svg>
                    </button>
                </div>
            </header>

            {/* mobile menu */}
            <div className={`${mobileOpen ? 'block' : 'hidden'} px-4 pb-4 md:hidden`}>
                <ul className="flex flex-col space-y-2">
                    {navbarMenu.map((item) => (
                        <li key={item.title}>
                            <Link href={item.href} className="block rounded-md px-3 py-2 hover:bg-gray-100">
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* HERO */}
            <section className="grid grid-cols-1 gap-4 px-4 py-6 md:grid-cols-2 md:px-[6rem] md:py-12">
                <div className="flex flex-col items-start justify-center gap-8 rounded-3xl bg-green-500/20 p-6 md:p-10">
                    <div>
                        <h1 className="text-3xl font-bold md:text-4xl">Jessamyn</h1>
                        <p className="mt-2 text-justify text-base md:text-lg">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi accusantium nulla, facere voluptatibus officiis ipsa
                            exercitationem sunt, fugit sed ex non, cum quidem quis. Eius, rem omnis. Iusto, recusandae minus?
                        </p>
                    </div>

                    <div className="flex w-full flex-wrap gap-3">
                        <Button className="min-w-[140px] flex-1 px-6">Explore</Button>
                        <Button className="min-w-[140px] flex-1 px-6">Learn More</Button>
                    </div>
                </div>

                <div className="relative h-64 overflow-hidden rounded-3xl md:h-[34rem]">
                    <img
                        src="https://images.unsplash.com/photo-1662467191303-d1010dfbb89c?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
                        alt="Hero"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </section>

            {/* STATS */}
            <section className="grid gap-5 px-4 py-14 md:px-[5rem]">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <h2 className="text-2xl font-bold md:text-4xl">Discover More</h2>
                    <p className="max-w-2xl text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora tenetur voluptatem quae maiores modi quam facere
                        reprehenderit rem porro laudantium, cum, ipsum blanditiis, adipisci libero expedita quisquam? Recusandae, omnis cumque.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                    <div className="grid gap-2">
                        <p className="text-sm font-medium">Performs</p>
                        <hr />
                        <h3 className="text-2xl font-bold">200,000+</h3>
                        <p className="text-sm text-gray-600">Monthly Active Users</p>
                    </div>
                    <div className="grid gap-2">
                        <p className="text-sm font-medium">Performs</p>
                        <hr />
                        <h3 className="text-2xl font-bold">200,000+</h3>
                        <p className="text-sm text-gray-600">Monthly Active Users</p>
                    </div>
                    <div className="grid gap-2">
                        <p className="text-sm font-medium">Performs</p>
                        <hr />
                        <h3 className="text-2xl font-bold">200,000+</h3>
                        <p className="text-sm text-gray-600">Monthly Active Users</p>
                    </div>
                    <div className="grid gap-2">
                        <p className="text-sm font-medium">Performs</p>
                        <hr />
                        <h3 className="text-2xl font-bold">200,000+</h3>
                        <p className="text-sm text-gray-600">Monthly Active Users</p>
                    </div>
                </div>
            </section>

            {/* OBJECTIVE (consolidated) */}
            <section className="flex flex-col items-start gap-8 px-4 py-12 md:flex-row md:gap-12 md:px-[6rem] md:py-20">
                <div className="max-w-xl space-y-5 pt-4">
                    <p className="text-sm font-semibold text-green-600">Our solution</p>
                    <h2 className="text-3xl leading-tight font-semibold md:text-5xl">It Starts With Growers In Mind.</h2>
                    <p className="leading-relaxed text-gray-600">
                        IFDC believes that the key to global food security starts with the soil and ends in the supermarket. We seek to develop better
                        fertilizer and production technologies, transfer these improved technologies to small farmers, and connect these farmers to
                        efficient and profitable markets. By working with strategic partners, we build local capacity and ensure sustainable impact.
                    </p>
                    <Button variant="outline" className="mt-4 w-fit rounded-xl border-gray-200 px-6 py-3">
                        Other Solutions
                    </Button>
                </div>

                <div className="flex flex-col gap-6 md:flex-1">
                    <div className="relative h-64 overflow-hidden rounded-3xl shadow-sm ring-1 ring-gray-100 md:h-[34rem]">
                        <img
                            src="https://images.unsplash.com/photo-1583505680130-b37f8049fbcf?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
                            alt="Greenhouse hydroponics"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="relative h-40 overflow-hidden rounded-3xl shadow-sm ring-1 ring-gray-100 md:h-48">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1731942726418-1db7dc2d32fc?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
                                alt="Farmers review plants"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="relative h-40 overflow-hidden rounded-3xl shadow-sm ring-1 ring-gray-100 md:h-48">
                            <img
                                src="https://images.unsplash.com/photo-1709372026846-8d2fda4a7ee5?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
                                alt="Farmer in the field with laptop"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* PRODUCTS */}
            <section className="px-4 py-12 md:px-[5rem] md:py-20 lg:px-[8rem]">
                <div className="mb-8 flex flex-col items-start justify-between md:flex-row">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-bold md:text-4xl">Explore our range of agricultural products</h2>
                        <p className="mt-3 text-gray-600">
                            Discover the transformative power of our farming solutions and take your farming experience to a higher level.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button variant="outline" className="h-10 self-start">
                            Show More Products
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    {products.map((p) => (
                        <div key={p.name} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 md:p-6">
                            <div className="flex items-center justify-center">
                                <img src={p.image} alt={p.name} className="h-40 object-contain md:h-48" />
                            </div>
                            <h3 className="mt-4 font-semibold md:mt-6">{p.name}</h3>
                            <div className="mt-2 flex items-center gap-4">
                                <span className="text-lg font-semibold">${p.price}</span>
                                <span className="text-green-600">
                                    ( <span className="mr-1 inline-block">★</span> {p.rating}/5 )
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-emerald-950 text-white">
                <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-6 px-4 py-12 md:flex-row md:px-12 md:py-20">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-semibold md:text-4xl">Your First Steps Toward Agricultural Innovation.</h2>
                        <p className="mt-4 text-sm text-emerald-200 md:text-lg">
                            Take the first step towards developing excellence. Explore our premium products, take advantage of cutting-edge solutions,
                            and join us in shaping the future of agriculture.
                        </p>
                    </div>

                    <div className="flex w-full justify-center gap-4 md:w-auto md:justify-end">
                        <Button className="bg-emerald-500 px-6 py-3 text-white hover:bg-emerald-600">Browse Products</Button>
                        <Button variant="outline" className="border-gray-200 bg-transparent px-6 py-3 text-white">
                            More About Us
                        </Button>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-100 text-gray-800">
                <div className="mx-auto max-w-7xl px-4 py-10 md:px-12 md:py-14">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        <div>
                            <div className="flex items-center gap-3">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-black">
                                    <circle cx="8.5" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="15.5" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                <span className="text-xl font-medium">EverGreen</span>
                            </div>
                            <p className="mt-6 max-w-xs">Cultivating Strength, Unity, and Growth.</p>
                        </div>

                        <div>
                            <h4 className="mb-4 font-medium">Company</h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li>Careers</li>
                                <li>News &amp; Media</li>
                                <li>Store</li>
                                <li>About Us</li>
                                <li>Our Leadership Team</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 font-medium">Learn More</h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li>Investor Relations</li>
                                <li>Government Services</li>
                                <li>Continuing Education</li>
                                <li>Sitemap</li>
                                <li>Contact Us</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="mb-4 font-medium">General Info</h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li>Global Locations</li>
                                <li>Terms</li>
                                <li>Privacy</li>
                                <li>Partners</li>
                            </ul>
                        </div>
                    </div>

                    <div className="my-6 h-px bg-gray-200" />

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-6">
                            <span className="text-sm">Social Media</span>
                            <div className="flex items-center gap-3 text-gray-500">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.877v-6.99H8.898v-2.887h1.54V9.797c0-1.523.907-2.364 2.295-2.364.665 0 1.36.119 1.36.119v1.497h-.767c-.757 0-.994.47-.994.953v1.147h1.686l-.269 2.887h-1.417v6.99C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9.06 9.06 0 0 1-2.88 1.1A4.52 4.52 0 0 0 12.07 5.5c0 .35.04.69.11 1.02A12.91 12.91 0 0 1 1.64 1.15a4.5 4.5 0 0 0 1.4 6.02 4.48 4.48 0 0 1-2.05-.57v.06a4.51 4.51 0 0 0 3.62 4.42 4.5 4.5 0 0 1-2.04.08 4.52 4.52 0 0 0 4.21 3.13A9.05 9.05 0 0 1 1 19.54 12.78 12.78 0 0 0 7 21c8.29 0 12.83-6.87 12.83-12.83 0-.2 0-.39-.02-.58A9.22 9.22 0 0 0 23 3z" />
                                </svg>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 4.41 2.86 8.16 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.45-1.1-1.45-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.02-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.11 2.51.32 1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.63.7 1.02 1.6 1.02 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A9.96 9.96 0 0 0 22 12c0-5.5-4.46-9.96-9.96-9.96z" />
                                </svg>
                            </div>
                        </div>

                        <div className="text-sm text-gray-500">&copy; 2023 EverGreen. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
