import CardProducto from "@/app/components/ui/CardProducto";
import { trendingProducts } from "../data/products";

export default function TrendingProducts() {
  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tendencia</h2>
        <button className="text-campomaq hover:text-yellow-500 font-medium transition-colors duration-200">
          Ver todos
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {trendingProducts.map((product) => (
          <CardProducto
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            category={product.category}
            brand={product.brand}
            brandLogo={product.brandLogo}
            isNew={product.isNew}
            isOnSale={product.isOnSale}
            discount={product.discount}
          />
        ))}
      </div>
    </section>
  );
}
