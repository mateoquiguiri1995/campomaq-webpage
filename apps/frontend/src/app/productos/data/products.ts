export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand?: string;
  brandLogo?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  discount?: number;
  description?: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Motocultor Maruyama",
    price: 850,
    originalPrice: 950,
    image: "/images/prod-home/motocultor.jpg",
    category: "Motocultores",
    brand: "Maruyama",
    brandLogo: "/images/brands/Maruyama.png",
    isOnSale: true,
    discount: 10,
    description: "Motocultor compacto ideal para jardines pequeños y medianos",
    tags: ["motocultor", "Maruyama", "jardín", "agricultura", "maruyama"]
  },
  {
    id: "2",
    name: "Desbrozadora Maruyama 525RX",
    price: 300,
    image: "/images/prod-home/desbrozadora.jpg",
    category: "Motoguadañas",
    brand: "Maruyama",
    brandLogo: "/images/brands/Maruyama.png",
    isNew: true,
    description: "Desbrozadora profesional para trabajos de desbroce",
    tags: ["motoguadaña", "Maruyama", "desbroce", "profesional", "maruyama"]
  },
  {
    id: "3",
    name: "Bomba de Fumigar 20L",
    price: 100,
    originalPrice: 150,
    image: "/images/prod-home/bombaf.jpg",
    category: "Bombas",
    brand: "Echo",
    brandLogo: "/images/brands/echo.svg",
    isOnSale: true,
    discount: 20,
    description: "Bomba de fumigación manual de 20 litros",
    tags: ["bomba", "fumigación", "manual", "20l", "echo","Echo"]
  },
  {
    id: "4",
    name: "Motosierra STIHL 240",
    price: 400,
    image: "/images/prod-home/motosierra.jpg",
    category: "Motosierras",
    brand: "Stihl",
    brandLogo: "/images/brands/STIHL.jpg",
    description: "Motosierra ligera para uso doméstico y profesional",
    tags: ["motosierra", "STIHL", "madera", "corte", "profesional", "stihl"]
  },
  {
    id: "5",
    name: "Desbrozadora Echo SRM-225",
    price: 380,
    originalPrice: 400,
    image: "/images/prod-home/desbrozadora.png",
    category: "Desbrozadoras",
    brand: "Echo",
    brandLogo: "/images/brands/echo.svg",
    isOnSale: true,
    discount: 15,
    description: "Desbrozadora de hilo para jardines y terrenos",
    tags: ["desbrozadora", "echo", "hilo", "jardín", "Echo"]
  },
  {
    id: "6",
    name: "Generador Subaru 3000W",
    price: 400,
    image: "/images/prod-home/generador-subaru.jpeg",
    category: "Generadores",
    brand: "Subaru",
    brandLogo: "/images/brands/subaru.jpeg",
    isNew: true,
    description: "Generador portátil de 3000W para emergencias",
    tags: ["generador", "subaru", "3000w", "emergencia","Subaru"]
  },
  {
    id: "7",
    name: "Podadora de Setos 122HD60",
    price: 220,
    image: "/images/prod-home/husqvarna-podadora_de_setos.jpg",
    category: "Podadoras",
    brand: "Husqvarna",
    brandLogo: "/images/brands/Husqvarna.jpg",
    description: "Podadora de setos eléctrica profesional",
    tags: ["podadora", "Husqvarna", "setos", "eléctrica", "profesional", "husqvarna"]
  },
  {
    id: "8",
    name: "Sopladora Echo PB-250",
    price: 95,
    originalPrice: 130,
    image: "/images/prod-home/echo-sopladora.jpeg",
    category: "Sopladoras",
    brand: "Echo",
    brandLogo: "/images/brands/echo.svg",
    isOnSale: true,
    discount: 16,
    description: "Sopladora de hojas portátil",
    tags: ["sopladora", "echo", "hojas", "portátil", "Echo"]
  },
  {
    id: "9",
    name: "Motoazada Husqvarna FJ500",
    price: 920,
    image: "/images/prod-home/motoazada.jpg",
    category: "Motoazadas",
    brand: "Husqvarna",
    brandLogo: "/images/brands/Husqvarna.jpg",
    description: "Motoazada profesional para terrenos duros",
    tags: ["motoazada", "husqvarna", "terreno", "profesional", "Husqvarna"]
  },
  {
    id: "10",
    name: "Cuchillas para Motoazada",
    price: 50,
    image: "/images/prod-home/cuchillas.jpg",
    category: "Repuestos",
    brand: "Husqvarna",
    brandLogo: "/images/brands/Husqvarna.jpg",
    description: "Set de cuchillas para motoazada",
    tags: ["cuchillas", "motoazada", "repuestos", "set", "husqvarna", "motocultor","Husqvarna"]
  },
  {
    id: "11",
    name: "Aceite 2T STIHL",
    price: 25,
    image: "/images/prod-home/stihl-aceite_2t.jpg",
    category: "Lubricantes",
    brand: "Stihl",
    brandLogo: "/images/brands/STIHL.jpg",
    description: "Aceite 2T de alta calidad para motores",
    tags: ["aceite", "2t", "stihl", "motor", "lubricante", "STIHL"]
  },
  {
    id: "12",
    name: "Manguera de Riego",
    price: 15,
    image: "/images/prod-home/manguera.jpg",
    category: "Mangueras",
    brand: "Echo",
    brandLogo: "/images/brands/echo.svg",
    description: "manguera para el riego agricola disponible en diferentes longitudes",
    tags: ["manguera","riego", "100m", "echo", "Echo"]
  }
];

// Productos populares (más vendidos)
export const popularProducts = products.filter(p => 
  ["1", "2", "4", "6", "8", "10"].includes(p.id)
);

// Productos en tendencia
export const trendingProducts = products.filter(p => 
  ["3", "5", "7", "9", "11", "12"].includes(p.id)
);

// Productos de oferta semanal
export const weeklyOfferProducts = products.filter(p => 
  p.isOnSale && ["1", "3", "5", "8"].includes(p.id)
);

// Función para buscar productos
export const searchProducts = (query: string): Product[] => {
  const searchTerm = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) ||
    product.category.toLowerCase().includes(searchTerm) ||
    product.brand?.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Función para obtener productos relacionados
export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const product = products.find(p => p.id === productId);
  if (!product) return [];

  return products
    .filter(p => 
      p.id !== productId && 
      (p.category === product.category || 
       p.brand === product.brand ||
       p.tags.some(tag => product.tags.includes(tag)))
    )
    .slice(0, limit);
};
