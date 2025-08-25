import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import heroUrl from '../../../public/jessamynHero.png';
import logoUrl from '../../../public/jessamynLogo.png';

const navbarMenu = [
    { title: 'Home', href: '/' },
    { title: 'About Us', href: '/about' },
    { title: 'Products', href: '/products' },
    { title: 'Contact', href: '/contact' },
];

const products = [
    {
        name: 'Body Massage Oil Bundle (100 ml & 250 ml)',
        price: '55.000',
        image: 'https://images.unsplash.com/photo-1602928355784-b05f7a78b842?q=80&w=835&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Body Massage Oil With Aromatherapy Kanakala',
        price: '55.000',
        image: 'https://images.unsplash.com/photo-1602928355784-b05f7a78b842?q=80&w=835&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Body Massage Oil With Aromatherapy Mr Muscle',
        price: '55.000',
        image: 'https://images.unsplash.com/photo-1709372026846-8d2fda4a7ee5?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Body Massage Oil With Aromatherapy Mr Muscle',
        price: '55.000',
        image: 'https://images.unsplash.com/photo-1627828094454-accc9a7c20e9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Body Massage Oil Bundle (100 ml & 250 ml)',
        price: '55.000',
        image: 'https://images.unsplash.com/photo-1627828094454-accc9a7c20e9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [allProduct, setAllProduct] = useState(false);

    return (
        <div className="min-h-screen bg-white text-black">
            {/* header */}
            <header className="container mx-auto flex items-center justify-between md:px-8">
                <div className="relative h-20 w-auto max-w-[220px]">
                    <img src={logoUrl} alt="Logo" className="h-full w-full object-cover" />
                </div>

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
                    <Button variant="outline" className="hidden border-gray-200 text-primary sm:inline-flex">
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
            <section className="container mx-auto grid h-[90vh] grid-cols-1 gap-4 px-4 md:grid-cols-2">
                <div className="flex flex-col items-start justify-center gap-16 rounded-3xl bg-[#F1F9F1] p-6 md:p-10">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className="text-3xl font-bold text-primary-foreground md:text-4xl">Jessamyn: Essentials for Mind, Body, and Soul</h1>
                        <p className="mt-2 text-base md:text-xl">
                            Nikmati ketenangan alami dengan rangkaian essential oil murni dari alam. Diracik dengan cinta dan kehati-hatian untuk
                            menyelaraskan tubuh dan jiwa Anda.
                        </p>
                    </div>
                    <Button className="min-w-[140px] px-6">Shop Now!</Button>
                </div>

                <div className="relative overflow-hidden rounded-3xl">
                    <img src={heroUrl} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
                </div>
            </section>

            {/* STATS */}
            <section className="container mx-auto grid gap-28 py-16">
                <div className="mx-auto grid grid-cols-1 gap-5 px-10 md:grid-cols-2">
                    <h2 className="flex items-center px-5 text-2xl md:text-5xl">JESSAMYN: Essentials for Mind, Body, and Soul</h2>
                    <p className="flex items-center justify-center text-justify text-gray-600">
                        Jessamyn adalah pilihan alami untuk menjaga kesehatan tubuh, menenangkan pikiran, dan menyegarkan jiwa. Kami menghadirkan
                        minyak herbal murni yang diracik dari bahan pilihan berkualitas tinggi, sehingga aman digunakan sehari-hari untuk relaksasi,
                        pijat, maupun aromaterapi. Setiap produk kami diciptakan untuk membantu Anda menemukan keseimbangan hidup yang sehat, alami,
                        dan penuh ketenangan.
                    </p>
                </div>

                <div className="flex items-center justify-around">
                    <span className="flex flex-col items-center justify-center gap-1">
                        <i className="bx bx-user text-5xl"></i>
                        <p className="text-sm">Produk Herbal Premium</p>
                    </span>

                    <span className="flex flex-col items-center justify-center gap-1">
                        <i className="bx bx-user text-5xl"></i>
                        <p className="text-sm">Relaksasi & Aromaterapi</p>
                    </span>

                    <span className="flex flex-col items-center justify-center gap-1">
                        <i className="bx bx-user text-5xl"></i>
                        <p className="text-sm">Konsultasi Kesehatan Alami</p>
                    </span>
                </div>
            </section>

            {/* About US */}
            <section className="container mx-auto flex h-screen flex-col items-start gap-8 px-4 py-12 md:flex-row md:gap-12 md:px-[6rem] md:py-20">
                <div className="my-auto flex max-w-xl flex-col items-start justify-center gap-2 space-y-5">
                    <span>
                        <p className="text-sm font-semibold text-primary-foreground">About Us</p>
                        <h2 className="text-3xl leading-tight font-semibold md:text-5xl">It Starts With Growers In Mind.</h2>
                    </span>

                    <p className="text-justify leading-relaxed text-gray-600">
                        Jessamyn adalah brand lokal yang berkomitmen menghadirkan kebaikan alam dalam setiap tetes minyak herbal. Kami percaya bahwa
                        kesehatan dan ketenangan dapat ditemukan dari bahan-bahan alami yang telah digunakan secara turun-temurun. Dengan memilih
                        bahan baku berkualitas tinggi dari tanaman herbal pilihan, Jessamyn menghadirkan produk minyak herbal yang murni, aman, dan
                        bermanfaat bagi tubuh maupun pikiran. Setiap produk kami diformulasikan untuk membantu menjaga keseimbangan hidup, memberikan
                        relaksasi, serta mendukung gaya hidup sehat dan alami.
                    </p>
                </div>

                <div className="flex flex-col gap-1 md:flex-1">
                    <div className="relative h-64 overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-100 md:h-[34rem]">
                        <img
                            src="https://images.unsplash.com/photo-1583505680130-b37f8049fbcf?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
                            alt="Greenhouse hydroponics"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                        <div className="relative h-40 overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-100 md:h-48">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1731942726418-1db7dc2d32fc?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
                                alt="Farmers review plants"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="relative h-40 overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-100 md:h-48">
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
            <section className="container mx-auto px-4 pb-12 md:px-[5rem] lg:px-[8rem]">
                <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-bold text-primary-foreground md:text-4xl">Explore our product</h2>
                        <p className="mt-3 text-gray-600">
                            Discover the transformative power of our farming solutions and take your farming experience to a higher level.
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Button variant="outline" className="hidden border-gray-200 text-primary sm:inline-flex">
                            Show More Products
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-5">
                    {products.map((p) => (
                        <div key={p.name} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                            <div className="relative flex h-[15rem] w-full items-center justify-center overflow-hidden rounded-t-xl">
                                <img src={p.image} alt={p.name} className="absolute h-full w-full object-cover" />
                            </div>

                            <div className="grid gap-5 p-2">
                                <h3 className="mt-2 font-semibold">{p.name}</h3>
                                <span className="font-medium text-primary-foreground">Rp. {p.price};</span>
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

            {/* CONTACT US */}
            <section className="container mx-auto grid grid-cols-1 gap-8 py-16 md:grid-cols-2 md:px-[6rem] md:py-20">
                {/* Map */}
                <div className="flex items-center justify-center">
                    <iframe
                        title="Jessamyn Store Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.726964836934!2d110.44100007501144!3d-7.819963779963219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5e2e2e2e2e2e%3A0x2e2e2e2e2e2e2e2e!2sJessamyn%20Store!5e0!3m2!1sen!2sid!4v1692950000000!5m2!1sen!2sid"
                        width="100%"
                        height="700"
                        style={{ border: '0', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col justify-center gap-6 px-2 md:px-8">
                    <span>
                        <h2 className="mb-2 text-2xl font-semibold text-primary-foreground md:text-4xl">Contact Us</h2>
                        <p className="mb-4 text-gray-700">
                            Hubungi kami untuk informasi lebih lanjut, kerja sama bisnis, atau konsultasi produk. Kami dengan senang hati akan
                            menanggapi kebutuhan Anda.
                        </p>
                    </span>

                    <div className="flex flex-col gap-5">
                        {/* Email */}
                        <div className="flex items-center gap-4">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-[#D6E3D0] text-primary-foreground">
                                <i className="bx bx-envelope text-2xl" />
                            </span>
                            <div>
                                <span className="block font-semibold text-primary-foreground">Email</span>
                                <span className="text-sm text-gray-700">jessamyncompany@gmail.com</span>
                            </div>
                        </div>
                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-[#D6E3D0] text-primary-foreground">
                                <i className="bx bx-map text-2xl" />
                            </span>
                            <div>
                                <span className="block font-semibold text-primary-foreground">Location</span>
                                <span className="text-sm text-gray-700">Tunjungan, Kabupaten Sleman, Daerah Istimewa Yogyakarta</span>
                            </div>
                        </div>
                        {/* Whatsapp */}
                        <div className="flex items-center gap-4">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-[#D6E3D0] text-primary-foreground">
                                <i className="bx bxl-whatsapp text-2xl" />
                            </span>
                            <div>
                                <span className="block font-semibold text-primary-foreground">Whatsapp</span>
                                <span className="text-sm text-gray-700">0912 42842 746</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#AFC29E] text-gray-800">
                <div className="container mx-auto px-4 py-10 md:px-12">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {/* Logo & Address */}
                        <div>
                            <img src={logoUrl} alt="Jessamyn" className="mb-2 h-16" />
                            <p className="text-xs leading-tight font-medium">
                                Tunjungan RT.03/RW.02, Gatak 2, Selomartani,
                                <br />
                                Kec. Kalasan, Kabupaten Sleman, Daerah Istimewa
                                <br />
                                Yogyakarta 55571
                            </p>
                        </div>

                        <div className="flex w-full items-start justify-between">
                            {/* Company */}
                            <div>
                                <h4 className="mb-2 font-semibold text-primary-foreground">Company</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>Home</li>
                                    <li>About Us</li>
                                    <li>Products</li>
                                    <li>Contacts</li>
                                </ul>
                            </div>
                            {/* Products */}
                            <div>
                                <h4 className="mb-2 font-semibold text-primary-foreground">Products</h4>
                                <ul className="space-y-2 text-sm">
                                    <li>Produk Herbal Premium</li>
                                    <li>Relaksasi & Aromaterapi</li>
                                    <li>Konsultasi Kesehatan Alami</li>
                                </ul>
                            </div>
                            {/* Get In Touch */}
                            <div>
                                <h4 className="mb-2 font-semibold text-primary-foreground">Get In Touch</h4>
                                <p className="mb-2 text-sm">jessamyncompany@gmail.com</p>
                                <div className="flex gap-2">
                                    <span className="bg-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded text-primary">
                                        <i className="bx bxl-tiktok text-xl" />
                                    </span>
                                    <span className="bg-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded text-primary">
                                        <i className="bx bxl-shopify text-xl" />
                                    </span>
                                    <span className="bg-primary-foreground inline-flex h-7 w-7 items-center justify-center rounded text-primary">
                                        <i className="bx bxl-instagram text-xl" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-6 h-px bg-primary-foreground" />

                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-sm text-primary-foreground">
                            <span className="mr-1">&#169;</span>
                            2025 Jessamyn, All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-primary-foreground">
                            <span>Terms & Conditions</span>
                            <span>Privacy Policy</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
