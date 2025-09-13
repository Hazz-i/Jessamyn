import ProductDetailsCard from '@/components/product-details';
import { Link } from '@inertiajs/react';

const DetailsHome = ({ product, auth }: any) => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-start px-2 py-6 md:px-6 lg:px-0">
            <div className="flex w-full max-w-6xl flex-col items-start">
                <Link
                    href="/all-products"
                    className="mb-6 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-gray-700 shadow-sm transition hover:bg-gray-100"
                >
                    <i className="bx bx-arrow-back text-lg"></i>
                </Link>
                <div className="w-full">
                    <ProductDetailsCard product={product} auth={auth} />
                </div>
            </div>
        </div>
    );
};

export default DetailsHome;
