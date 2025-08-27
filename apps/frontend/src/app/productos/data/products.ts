import { Product } from '../types';

export const products: Product[] = [
  {
    id: "1",
    name: "Motocultor Maruyama",
    image: "/images/prod-home/motocultor.jpg",
    category: "Motocultores",
    brand: "Maruyama",
    brandLogo: "/images/brands/Maruyama.png",
    isOnSale: true,
    discount: 10,
    description: `
    Motocultor compacto ideal para jardines pequeños y medianos.

    El Motocultor Maruyama es una herramienta esencial para el trabajo agrícola y de jardinería. Diseñado con tecnología japonesa de alta calidad, ofrece un rendimiento excepcional para la preparación del suelo en jardines, huertos familiares y pequeñas parcelas agrícolas.

    **Características principales:**
    - Motor de 4 tiempos confiable
    - Transmisión por cadena duradera
    - Manillar ajustable en altura
    - Ruedas neumáticas de alta tracción
    - Fácil arranque manual
    - Bajo consumo de combustible

    **Especificaciones técnicas:**
    - Ancho de trabajo: 60 cm
    - Profundidad máxima: 20 cm
    - Velocidades: 2 adelante, 1 atrás
    - Tipo de transmisión: Cadena

    **Motor:**
    - 4 tiempos monocilíndrico
    - Potencia: 6.5 HP
    - Combustible: Gasolina
    - Consumo: 1.2 L/hora

    **Dimensiones:**
    - Largo: 140 cm
    - Ancho: 60 cm
    - Alto: 95 cm
    - Peso: 85 kg

    **Recomendaciones de uso:**
    - Ideal para suelos en jardines y huertos
    - Perfecto para terrenos de hasta 2000 m²
    - Recomendado para uso doméstico y semi-profesional
    - Excelente para cultivos en línea

    Garantía: 2 años del fabricante.
    `,
    tags: ["motocultor", "Maruyama", "floricola", "agricultura", "maruyama"],
    additionalImages: [
      "/images/prod-home/motocultor.jpg",
      "/images/prod-home/motocultor-2.jpg",
      "/images/prod-home/motocultor-3.jpg"
    ]
  },
  {
    id: "2",
    name: "Desbrozadora Maruyama 525RX",
    image: "/images/prod-home/desbrozadora.jpg",
    category: "Motoguadañas",
    brand: "Maruyama",
    brandLogo: "/images/brands/Maruyama.png",
    isNew: true,
    description: `
    Desbrozadora profesional para trabajos de desbroce.

    La Desbrozadora Maruyama 525RX es una herramienta profesional diseñada para trabajos intensivos de desbroce y mantenimiento de áreas verdes. Con su motor de 2 tiempos de alta eficiencia y su sistema antivibración avanzado, proporciona un rendimiento superior con menor fatiga del operario.

    **Características principales:**
    - Motor 2 tiempos de alto rendimiento
    - Sistema antivibración
    - Arnés ergonómico incluido
    - Cabezal de hilo automático
    - Fácil arranque con sistema Easy Start

    **Especificaciones técnicas:**
    - Cilindrada: 25.4 cc
    - Diámetro de corte: 42 cm
    - Tipo de cabezal: Automático
    - Diámetro del hilo: 2.4 mm

    **Motor:**
    - 2 tiempos monocilíndrico
    - Potencia: 1.1 kW
    - Combustible: Mezcla gasolina/aceite
    - Consumo: 0.6 L/hora

    **Dimensiones:**
    - Largo: 175 cm
    - Ancho: 42 cm
    - Alto: 35 cm
    - Peso: 5.2 kg

    **Recomendaciones de uso:**
    - Ideal para mantenimiento de jardines grandes
    - Perfecto para desbroce de maleza densa
    - Recomendado para uso profesional diario
    - Excelente para áreas de difícil acceso

    Garantía: 2 años del fabricante.
    `,
    tags: ["motoguadaña", "Maruyama", "desbroce", "profesional", "maruyama"],
    additionalImages: [
      "/images/prod-home/desbrozadora.jpg",
      "/images/prod-home/desbrozadora-2.jpg"
    ]
  },
  {
    id: "3",
    name: "Bomba de Fumigar 20L",
    image: "/images/prod-home/bombaf.jpg",
    category: "Bombas",
    brand: "Echo",
    brandLogo: "/images/brands/echo.svg",
    isOnSale: true,
    discount: 20,
    description: `
    Bomba de fumigación manual de 20 litros.

    Esta bomba es ideal para aplicaciones de pesticidas, herbicidas y fertilizantes líquidos en jardines, cultivos y áreas verdes. Su diseño ergonómico y materiales resistentes a químicos garantizan durabilidad y facilidad de uso.

    **Características principales:**
    - Tanque de 20 litros de capacidad
    - Bomba manual de presión
    - Manguera de 1.5 metros
    - Lanza con regulador de caudal
    - Correa para transporte
    - Materiales resistentes a químicos

    **Especificaciones técnicas:**
    - Capacidad: 20 L
    - Presión máxima: 3 bar
    - Longitud manguera: 1.5 m
    - Material tanque: Polietileno

    **Dimensiones:**
    - Largo: 40 cm
    - Ancho: 25 cm
    - Alto: 55 cm
    - Peso: 3.2 kg

    **Recomendaciones de uso:**
    - Ideal para jardines y huertos familiares
    - Perfecto para aplicación de pesticidas orgánicos
    - Recomendado para áreas de hasta 1000 m²

    Garantía: 1 año del fabricante.
    `,
    tags: ["bomba", "fumigación", "manual", "20l", "echo","Echo"],
    additionalImages: [
      "/images/prod-home/bombaf.jpg"
    ]
  },
  {
    id: "4",
    name: "Motosierra STIHL 240",
    image: "/images/prod-home/motosierra.jpg",
    category: "Motosierras",
    brand: "Stihl",
    brandLogo: "/images/brands/STIHL.jpg",
    description: `
    Motosierra ligera para uso doméstico y profesional.

    La Motosierra STIHL 240 es una herramienta versátil y potente, ideal para trabajos de poda, corte de leña y mantenimiento forestal. Su diseño ergonómico y tecnología avanzada la convierten en la elección perfecta tanto para usuarios domésticos como profesionales.

    **Características principales:**
    - Motor 2 tiempos de alta potencia
    - Sistema antivibración STIHL
    - Bomba de aceite automática
    - Freno de cadena de seguridad
    - Filtro de aire lavable
    - Arranque fácil ErgoStart

    **Especificaciones técnicas:**
    - Cilindrada: 38.2 cc
    - Longitud espada: 35 cm
    - Paso cadena: 3/8 pulg
    - Grosor eslabón: 1.3 mm

    **Motor:**
    - 2 tiempos monocilíndrico
    - Potencia: 2.0 kW
    - Combustible: Mezcla gasolina/aceite
    - Consumo: 0.8 L/hora

    **Dimensiones:**
    - Largo: 70 cm
    - Ancho: 24 cm
    - Alto: 28 cm
    - Peso: 4.7 kg

    **Recomendaciones de uso:**
    - Ideal para poda de árboles frutales
    - Perfecto para corte de leña doméstica
    - Recomendado para trabajos forestales ligeros
    - Excelente para mantenimiento de jardines

    Garantía: 2 años del fabricante.
    `,
    tags: ["motosierra", "STIHL", "madera", "corte", "profesional", "stihl"],
    additionalImages: [
      "/images/prod-home/motosierra.jpg",
      "/images/prod-home/motosierra-2.jpg",
      "/images/prod-home/motosierra-3.jpg"
    ]
  },
  {
    id: "5",
    name: "Desbrozadora Echo SRM-225",
    image: "/images/prod-home/desbrozadora.png",
    category: "Desbrozadoras",
    brand: "Echo",
    brandLogo: "/images/brands/echo.svg",
    isOnSale: true,
    discount: 15,
    description: `
    Desbrozadora de hilo para jardines y terrenos.

    La Desbrozadora Echo SRM-225 combina potencia y versatilidad para el mantenimiento profesional de áreas verdes. Su motor confiable y diseño ergonómico la hacen ideal para trabajos prolongados con máxima comodidad.

    **Características principales:**
    - Motor 2 tiempos eficiente
    - Cabezal de hilo semiautomático
    - Mango ergonómico
    - Sistema de arranque ES Start
    - Filtro de aire de alta capacidad

    **Especificaciones técnicas:**
    - Cilindrada: 21.2 cc
    - Diámetro de corte: 40 cm
    - Diámetro hilo: 2.0 mm

    **Motor:**
    - 2 tiempos
    - Potencia: 0.8 kW
    - Combustible: Mezcla gasolina/aceite

    **Peso:** 4.4 kg

    Garantía: 2 años del fabricante.
    `,
    tags: ["desbrozadora", "echo", "hilo", "jardín", "Echo"],
    additionalImages: [
      "/images/prod-home/desbrozadora.png"
    ]
  },
  {
    id: "6",
    name: "Generador Subaru 3000W",
    image: "/images/prod-home/generador-subaru.jpeg",
    category: "Generadores",
    brand: "Subaru",
    brandLogo: "/images/brands/subaru.jpeg",
    isNew: true,
    description: `
    Generador portátil de 3000W para emergencias.

    El Generador Subaru de 3000W es la solución perfecta para tener energía confiable en cualquier momento. Con tecnología japonesa de primer nivel, ofrece energía limpia y estable para sus equipos más sensibles.

    **Características principales:**
    - Motor Subaru confiable
    - Salida de 3000W
    - Arranque eléctrico y manual
    - Panel de control digital
    - Protección contra sobrecarga
    - Muy silencioso

    **Especificaciones técnicas:**
    - Potencia máxima: 3000 W
    - Potencia continua: 2600 W
    - Combustible: Gasolina
    - Autonomía: 8 horas

    **Motor:**
    - 4 tiempos OHV
    - Potencia: 6.5 HP
    - Combustible: Gasolina
    - Consumo: 1.8 L/hora

    **Recomendaciones de uso:**
    - Ideal para emergencias domésticas
    - Perfecto para eventos al aire libre
    - Recomendado para herramientas eléctricas

    Garantía: 3 años del fabricante.
    `,
    tags: ["generador", "subaru", "3000w", "emergencia","Subaru"],
    additionalImages: [
      "/images/prod-home/generador-subaru.jpeg"
    ]
  },
  {
    id: "7",
    name: "Podadora de Setos 122HD60",
    image: "/images/prod-home/husqvarna-podadora_de_setos.jpg",
    category: "Podadoras",
    brand: "Husqvarna",
    brandLogo: "/images/brands/Husqvarna.jpg",
    description: `
    Podadora de setos eléctrica profesional.

    La Podadora de Setos Husqvarna 122HD60 es perfecta para trabajos de jardinería exigentes gracias a su diseño robusto y eficiente.

    Garantía: 2 años del fabricante.
    `,
    tags: ["podadora", "Husqvarna", "setos", "eléctrica", "profesional", "husqvarna"]
  },
  {
    id: "8",
    name: "Sopladora Echo PB-250",
    image: "/images/prod-home/echo-sopladora.jpeg",
    category: "Sopladoras",
    brand: "Echo",
    brandLogo: "/images/brands/echo.svg",
    isOnSale: true,
    discount: 16,
    description: `
    Sopladora de hojas portátil.

    Diseñada para ofrecer gran potencia y portabilidad en limpieza de jardines y patios.

    Garantía: 2 años del fabricante.
    `,
    tags: ["sopladora", "echo", "hojas", "portátil", "Echo"]
  },
  {
    id: "9",
    name: "Motoazada Husqvarna FJ500",
    image: "/images/prod-home/motoazada.jpg",
    category: "Motoazadas",
    brand: "Husqvarna",
    brandLogo: "/images/brands/Husqvarna.jpg",
    description: `
    Motoazada profesional para terrenos duros.

    Diseñada para trabajos agrícolas exigentes, con gran durabilidad y eficiencia.

    Garantía: 2 años del fabricante.
    `,
    tags: ["motoazada", "husqvarna", "terreno", "profesional", "Husqvarna"]
  },
  {
    id: "10",
    name: "Cuchillas para Motoazada",
    image: "/images/prod-home/cuchillas.jpg",
    category: "Repuestos",
    brand: "Husqvarna",
    brandLogo: "/images/brands/Husqvarna.jpg",
    description: `
    Set de cuchillas para motoazada.

    Fabricadas en acero de alta resistencia para garantizar un corte duradero.

    Garantía: 1 año del fabricante.
    `,
    tags: ["cuchillas", "motoazada", "repuestos", "set", "husqvarna", "motocultor","Husqvarna"]
  },
  {
    id: "11",
    name: "Aceite 2T STIHL",
    image: "/images/prod-home/stihl-aceite_2t.jpg",
    category: "Lubricantes",
    brand: "Stihl",
    brandLogo: "/images/brands/STIHL.jpg",
    description: `
    Aceite 2T de alta calidad para motores.

    Garantía: del fabricante.
    `,
    tags: ["aceite", "2t", "stihl", "motor", "lubricante", "STIHL"]
  },
  {
    id: "12",
    name: "Manguera de Riego",
    image: "/images/prod-home/manguera.jpg",
    category: "Mangueras",
    brand: "Echo",
    brandLogo: "/images/brands/echo.svg",
    description: `
    Manguera para el riego agrícola disponible en diferentes longitudes.

    Garantía: 6 meses.
    `,
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
    (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
    (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
  );
};

// Función para obtener productos relacionados
export const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
  const product = products.find(p => p.id === productId);
  if (!product) return [];

  return products
    .filter(p =>
      p.id !== productId &&
      (p.category === product.category || p.brand === product.brand)
    )
    .slice(0, limit);
};

// Función para obtener un producto por ID
export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id);
};
