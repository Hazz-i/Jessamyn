import { Link } from '@inertiajs/react';

type ProductType = {
    id: number;
    name: string;
    price: number;
    image: string;
    category: string;
    product_variants: {
        id: number;
        product_id: number;
        variant: string;
        price: number;
        stock_qty: number;
    }[];
};

const ProductCard = ({ product }: { product: ProductType }) => {

    return (
        <Link href={`/product-show/${product.id}`} className="block" key={product.id}>
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 cursor-pointer hover:ring-primary transition">
                <div className="relative flex h-48 sm:h-56 md:h-64 lg:h-80 w-full items-center justify-center overflow-hidden rounded-t-xl">
                    <img src={product.image} alt={product.name} className="absolute h-full w-full object-cover" />
                </div>
                <div className="grid gap-3 sm:gap-4 md:gap-5 p-2 sm:p-3 md:p-4">
                    <span className="space-y-2">
                        <h3 className="mt-2 font-semibold text-base sm:text-lg md:text-xl text-primary-foreground line-clamp-2">{product.name}</h3>
                        <div className="border px-2 py-0.5 sm:px-3 rounded-sm border-primary max-w-fit">
                            <p className="text-primary-foreground text-xs sm:text-sm md:text-base whitespace-nowrap">
                                {product?.category}
                            </p>
                        </div>
                    </span>
                    <span className="font-bold text-primary-foreground text-sm sm:text-base md:text-lg">Rp. {Number(product?.product_variants[0]?.price).toLocaleString('id-ID')}</span>
                </div>
            </div>
        </Link>
    )
}


export default ProductCard;