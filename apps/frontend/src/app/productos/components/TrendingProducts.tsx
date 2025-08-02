export default function TrendingProducts() {
  return (
    <section className="my-8">
      <h2 className="font-bold text-lg mb-4">Tendencia</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Aquí irán ProductCard */}
        <div className="border rounded-lg p-4 bg-white">Producto 1</div>
        <div className="border rounded-lg p-4 bg-white">Producto 2</div>
        <div className="border rounded-lg p-4 bg-white">Producto 3</div>
        <div className="border rounded-lg p-4 bg-white">Producto 4</div>
      </div>
    </section>
  );
}
