type ProductType = {
    id: number;
    name: string;
    price: number;
    image: string;
};

const ProductCard = ({ product }: { product: ProductType }) => {
    return (
        <div key={product.id} className="rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="relative flex h-[15rem] w-full items-center justify-center overflow-hidden rounded-t-xl">
                <img src={product.image} alt={product.name} className="absolute h-full w-full object-cover" />
            </div>
            <div className="grid gap-5 p-2">
                <h3 className="mt-2 font-semibold text-primary">{product.name}</h3>
                <span className="font-bold text-primary-foreground">Rp. {product.price}</span>
            </div>
        </div>
    )
}


export default ProductCard;