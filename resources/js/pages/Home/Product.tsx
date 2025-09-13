import AppFooter from '@/components/app-footer';
import AppNavbar from '@/components/app-navbar';
import ProductCard from '@/components/ui/product-card';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type ProductType = {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    product_variants: { id: number; product_id: number; variant: string; price: number; stock_qty: number }[];
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
};

const carouselImages = [
    'https://picsum.photos/seed/1/900/250',
    'https://picsum.photos/seed/2/900/250',
    'https://picsum.photos/seed/3/900/250',
    'https://picsum.photos/seed/4/900/250',
    'https://picsum.photos/seed/5/900/250',
];

const Product = () => {
    const { products } = usePage().props as any;
    const paginated = products?.data || [];
    const currentPage = products?.current_page || 1;
    const lastPage = products?.last_page || 1;
    const [carouselIndex, setCarouselIndex] = useState(0);

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCarouselIndex((i) => (i + 1) % carouselImages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <div className="container mx-auto min-h-screen">
                {/* Navbar */}
                <AppNavbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

                {/* Carousel */}
                <div className="relative w-full overflow-hidden rounded-lg bg-gray-200" style={{ height: 250 }}>
                    <img src={carouselImages[carouselIndex]} alt="carousel" className="h-full w-full object-cover transition-all duration-500" />
                    <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
                        {carouselImages.map((_, idx) => (
                            <span
                                key={idx}
                                className={`inline-block h-2 w-2 rounded-full ${carouselIndex === idx ? 'bg-gray-800' : 'bg-gray-400'}`}
                            />
                        ))}
                    </div>
                </div>

                <h2 className="mt-8 text-center text-2xl font-bold text-gray-800">Our Product</h2>

                {/* Product Grid */}
                <div className="grid min-h-screen grid-cols-1 gap-8 px-8 py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {paginated.map((p: ProductType) => (
                        <Link key={p.id} href={route('products.show', p.id)} preserveScroll>
                            <ProductCard product={p} />
                        </Link>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="mb-8 flex justify-center gap-2">
                    <Link
                        href={products?.prev_page_url || '#'}
                        className={`rounded border border-gray-300 bg-white px-3 py-1 text-primary-foreground ${
                            currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                        }`}
                        preserveScroll
                    >
                        Previous
                    </Link>
                    <span className="px-3 py-1">
                        Page {currentPage} of {lastPage}
                    </span>
                    <Link
                        href={products?.next_page_url || '#'}
                        className={`rounded border border-gray-300 bg-white px-3 py-1 text-primary-foreground ${
                            currentPage === lastPage ? 'pointer-events-none opacity-50' : ''
                        }`}
                        preserveScroll
                    >
                        Next
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <AppFooter />
        </>
    );
};

export default Product;
