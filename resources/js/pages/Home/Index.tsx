import AppFooter from '@/components/app-footer';
import AppNavbar from '@/components/app-navbar';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/product-card';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import heroUrl from '../../../../public/jessamynHero.png';

const Welcome = () => {
    const { auth, products } = usePage().props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-black">
            {/* Navbar */}
            <AppNavbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

            {/* Mobile: bg image with overlay text */}
            <div className="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden shadow-sm md:hidden">
                <img src={heroUrl} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
                <div className="relative z-10 flex h-full w-full flex-col items-start justify-center bg-black/30 px-6 py-10">
                    <h1 className="text-3xl font-bold text-white drop-shadow-lg">Jessamyn: Essentials for Mind, Body, and Soul</h1>
                    <p className="mt-6 text-base text-white drop-shadow-md">
                        Nikmati ketenangan alami dengan rangkaian essential oil murni dari alam. Diracik dengan cinta dan kehati-hatian untuk
                        menyelaraskan tubuh dan jiwa Anda.
                    </p>
                    <Button className="mt-8 min-w-[140px] bg-emerald-500 px-6 text-white">Shop Now!</Button>
                </div>
            </div>
            {/* HERO */}
            <section className="container mx-auto hidden h-[90vh] px-4 md:grid md:grid-cols-2 md:gap-4">
                {/* Desktop: split layout */}
                <div className="hidden flex-col items-start justify-center gap-5 rounded-3xl bg-[#F1F9F1] p-10 shadow-sm md:flex">
                    <div className="flex flex-col items-start justify-center">
                        <h1 className="text-4xl font-bold text-primary-foreground">Jessamyn: Essentials for Mind, Body, and Soul</h1>
                        <p className="mt-10 text-xl">
                            Nikmati ketenangan alami dengan rangkaian essential oil murni dari alam. Diracik dengan cinta dan kehati-hatian untuk
                            menyelaraskan tubuh dan jiwa Anda.
                        </p>
                    </div>
                    <Button className="min-w-[140px] px-6">Shop Now!</Button>
                </div>
                <div className="relative hidden overflow-hidden rounded-3xl shadow-sm md:block">
                    <img src={heroUrl} alt="Hero" className="absolute inset-0 h-full w-full object-cover" />
                </div>
            </section>

            {/* STATS */}
            <section className="container mx-auto grid gap-5 py-5 sm:gap-20 sm:py-16">
                <div className="mx-auto grid grid-cols-1 gap-5 px-4 sm:px-10 md:grid-cols-2">
                    <h2 className="flex items-center text-2xl sm:px-5 md:text-5xl">JESSAMYN: Essentials for Mind, Body, and Soul</h2>
                    <p className="flex items-center justify-center text-justify text-base text-gray-600 sm:text-lg">
                        Jessamyn adalah pilihan alami untuk menjaga kesehatan tubuh, menenangkan pikiran, dan menyegarkan jiwa. Kami menghadirkan
                        minyak herbal murni yang diracik dari bahan pilihan berkualitas tinggi, sehingga aman digunakan sehari-hari untuk relaksasi,
                        pijat, maupun aromaterapi. Setiap produk kami diciptakan untuk membantu Anda menemukan keseimbangan hidup yang sehat, alami,
                        dan penuh ketenangan.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 px-2 sm:grid-cols-3 sm:gap-8 sm:px-0">
                    <span className="flex items-center gap-2 rounded-sm border px-2 py-3 shadow sm:flex-col sm:justify-center sm:rounded-none sm:border-none sm:px-0 sm:py-0 sm:shadow-none">
                        <i className="bx bx-user text-2xl sm:text-5xl"></i>
                        <p className="text-sm sm:text-base">Produk Herbal Premium</p>
                    </span>

                    <span className="flex items-center gap-2 rounded-sm border px-2 py-3 shadow sm:flex-col sm:justify-center sm:rounded-none sm:border-none sm:px-0 sm:py-0 sm:shadow-none">
                        <i className="bx bx-user text-2xl sm:text-5xl"></i>
                        <p className="text-sm sm:text-base">Relaksasi & Aromaterapi</p>
                    </span>

                    <span className="flex items-center gap-2 rounded-sm border px-2 py-3 shadow sm:flex-col sm:justify-center sm:rounded-none sm:border-none sm:px-0 sm:py-0 sm:shadow-none">
                        <i className="bx bx-user text-2xl sm:text-5xl"></i>
                        <p className="text-sm sm:text-base">Konsultasi Kesehatan Alami</p>
                    </span>
                </div>
            </section>

            {/* About US */}
            <section
                id="about-section"
                className="container mx-auto flex flex-col items-start gap-8 px-4 py-10 sm:py-16 md:flex-row md:gap-12 md:px-[6rem] md:py-20"
            >
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

                <div className="flex w-full flex-col gap-3 md:flex-1">
                    <div className="relative h-56 overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-100 sm:h-72 md:h-[34rem]">
                        <img
                            src="https://images.unsplash.com/photo-1583505680130-b37f8049fbcf?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
                            alt="Greenhouse hydroponics"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="relative h-56 overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-100 sm:h-48">
                            <img
                                src="https://plus.unsplash.com/premium_photo-1731942726418-1db7dc2d32fc?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.1.0"
                                alt="Farmers review plants"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="relative h-56 overflow-hidden rounded-lg shadow-sm ring-1 ring-gray-100 sm:h-48">
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
            <section id="products-section" className="container mx-auto px-4 pb-12 md:px-[5rem] lg:px-[8rem]">
                <div className="mb-8 flex flex-col items-center justify-between md:flex-row">
                    <div className="max-w-3xl">
                        <h2 className="text-2xl font-bold text-primary-foreground md:text-4xl">Explore our product</h2>
                        <p className="mt-3 text-gray-600">
                            Discover the transformative power of our farming solutions and take your farming experience to a higher level.
                        </p>
                    </div>
                    {Array.isArray(products) && products.length > 0 && (
                        <div className="mt-4 md:mt-0">
                            <Button variant="outline" className="hidden border-gray-200 text-primary sm:inline-flex">
                                <Link href="/all-products">Show More Products</Link>
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((p) => <ProductCard key={p.id} product={p} />)
                    ) : (
                        <div className="col-span-full flex min-h-[40vh] w-full items-center justify-center">
                            <p className="text-gray-400">No products available.</p>
                        </div>
                    )}
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
            <section
                id="contact-section"
                className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:px-[6rem] md:py-20"
            >
                {/* Map */}
                <div className="order-1 flex items-center justify-center sm:order-0">
                    <iframe
                        title="Jessamyn Store Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.726964836934!2d110.44100007501144!3d-7.819963779963219!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a5e2e2e2e2e2e%3A0x2e2e2e2e2e2e2e2e!2sJessamyn%20Store!5e0!3m2!1sen!2sid!4v1692950000000!5m2!1sen!2sid"
                        width="100%"
                        height="350"
                        className="max-h-[350px] min-h-[220px] w-full rounded-2xl shadow-md md:max-h-[700px] md:min-h-[400px]"
                        style={{ border: '0', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

                {/* Contact Info */}
                <div className="order-0 flex flex-col justify-center gap-6 px-2 sm:order-1 sm:px-6 md:px-8">
                    <span>
                        <h2 className="mb-2 text-2xl font-semibold text-primary-foreground md:text-4xl">Contact Us</h2>
                        <p className="mb-4 text-gray-700">
                            Hubungi kami untuk informasi lebih lanjut, kerja sama bisnis, atau konsultasi produk. Kami dengan senang hati akan
                            menanggapi kebutuhan Anda.
                        </p>
                    </span>

                    <div className="flex flex-col gap-5">
                        {/* Email */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-[#D6E3D0] text-primary-foreground">
                                <i className="bx bx-envelope text-2xl" />
                            </span>
                            <div>
                                <span className="block font-semibold text-primary-foreground">Email</span>
                                <span className="text-sm text-gray-700">jessamyncompany@gmail.com</span>
                            </div>
                        </div>
                        {/* Location */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded bg-[#D6E3D0] text-primary-foreground">
                                <i className="bx bx-map text-2xl" />
                            </span>
                            <div>
                                <span className="block font-semibold text-primary-foreground">Location</span>
                                <span className="text-sm text-gray-700">Tunjungan, Kabupaten Sleman, Daerah Istimewa Yogyakarta</span>
                            </div>
                        </div>
                        {/* Whatsapp */}
                        <div className="flex items-center gap-2 sm:gap-4">
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

            {/* Footer */}
            <AppFooter />

            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed right-8 bottom-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary-foreground hover:text-primary"
                    aria-label="Scroll to top"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Welcome;
