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
      <h2>Motocultor Maruyama</h2>
      <p>El <strong>Motocultor Maruyama</strong> es una herramienta esencial para el trabajo agrícola y de jardinería. Diseñado con <strong>tecnología japonesa</strong> de alta calidad, ofrece un <em>rendimiento excepcional</em> para la preparación del suelo en jardines, huertos familiares y pequeñas parcelas agrícolas.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Motor de 4 tiempos confiable</li>
        <li>Transmisión por cadena duradera</li>
        <li>Manillar ajustable en altura</li>
        <li>Ruedas neumáticas de alta tracción</li>
        <li>Fácil arranque manual</li>
        <li>Bajo consumo de combustible</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Ideal para suelos en jardines y huertos</li>
        <li>Perfecto para terrenos de hasta 2000 m²</li>
        <li>Recomendado para uso doméstico y semi-profesional</li>
        <li>Excelente para cultivos en línea</li>
      </ul>
      
      <h3>Especificaciones técnicas</h3>
      <table>
        <tr><td><strong>Motor</strong></td><td>4 tiempos monocilíndrico, 6.5 HP</td></tr>
        <tr><td><strong>Combustible</strong></td><td>Gasolina</td></tr>
        <tr><td><strong>Ancho de trabajo</strong></td><td>60 cm</td></tr>
        <tr><td><strong>Profundidad máxima</strong></td><td>20 cm</td></tr>
        <tr><td><strong>Velocidades</strong></td><td>2 adelante, 1 atrás</td></tr>
        <tr><td><strong>Peso</strong></td><td>85 kg</td></tr>
        <tr><td><strong>Consumo</strong></td><td>1.2 L/hora</td></tr>
      </table>
      
      <p>Con el <strong>Motocultor Maruyama</strong>, tendrás una máquina confiable para la preparación del suelo con la calidad y durabilidad que caracteriza a los productos japoneses. <em>Garantía de 2 años del fabricante.</em></p>
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
      <h2>Desbrozadora Maruyama 525RX</h2>
      <p>La <strong>Desbrozadora Maruyama 525RX</strong> es una herramienta profesional diseñada para trabajos intensivos de <em>desbroce y mantenimiento</em> de áreas verdes. Con su motor de 2 tiempos de alta eficiencia y su sistema antivibración avanzado, proporciona un <strong>rendimiento superior</strong> con menor fatiga del operario.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Motor 2 tiempos de alto rendimiento</li>
        <li>Sistema antivibración avanzado</li>
        <li>Arnés ergonómico incluido</li>
        <li>Cabezal de hilo automático</li>
        <li>Fácil arranque con sistema Easy Start</li>
        <li>Filtro de aire de alta capacidad</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Ideal para mantenimiento de jardines grandes</li>
        <li>Perfecto para desbroce de maleza densa</li>
        <li>Recomendado para uso profesional diario</li>
        <li>Excelente para áreas de difícil acceso</li>
      </ul>
      
      <h3>Especificaciones técnicas</h3>
      <table>
        <tr><td><strong>Motor</strong></td><td>2 tiempos monocilíndrico</td></tr>
        <tr><td><strong>Cilindrada</strong></td><td>25.4 cc</td></tr>
        <tr><td><strong>Potencia</strong></td><td>1.1 kW</td></tr>
        <tr><td><strong>Diámetro de corte</strong></td><td>42 cm</td></tr>
        <tr><td><strong>Diámetro del hilo</strong></td><td>2.4 mm</td></tr>
        <tr><td><strong>Peso</strong></td><td>5.2 kg</td></tr>
        <tr><td><strong>Consumo</strong></td><td>0.6 L/hora</td></tr>
      </table>
      
      <p>Con la <strong>Desbrozadora Maruyama 525RX</strong>, obtendrás una herramienta profesional que combina potencia, comodidad y durabilidad para todos tus trabajos de desbroce. <em>Garantía de 2 años del fabricante.</em></p>
    `,
    tags: ["motoguadaña", "Maruyama", "desbroce", "profesional", "maruyama"],
    additionalImages: [
      "/images/prod-home/desbrozadora.jpg",
      "/images/prod-home/desbrozadora-2.jpg"
    ]
  },
  {
    id: "4",
    name: "Motosierra STIHL 240",
    image: "/images/prod-home/motosierra.jpg",
    category: "Motosierras",
    brand: "Stihl",
    brandLogo: "/images/brands/stihl.png",
    description: `
      <h2>Motosierra STIHL 240</h2>
      <p>La <strong>Motosierra STIHL 240</strong> es una herramienta versátil y potente, ideal para trabajos de poda, corte de leña y mantenimiento forestal. Su <em>diseño ergonómico</em> y tecnología avanzada la convierten en la elección perfecta tanto para <strong>usuarios domésticos como profesionales</strong>.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Motor 2 tiempos de alta potencia</li>
        <li>Sistema antivibración STIHL</li>
        <li>Bomba de aceite automática</li>
        <li>Freno de cadena de seguridad</li>
        <li>Filtro de aire lavable</li>
        <li>Arranque fácil ErgoStart</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Ideal para poda de árboles frutales</li>
        <li>Perfecto para corte de leña doméstica</li>
        <li>Recomendado para trabajos forestales ligeros</li>
        <li>Excelente para mantenimiento de jardines</li>
      </ul>
      
      <h3>Especificaciones técnicas</h3>
      <table>
        <tr><td><strong>Motor</strong></td><td>2 tiempos monocilíndrico</td></tr>
        <tr><td><strong>Cilindrada</strong></td><td>38.2 cc</td></tr>
        <tr><td><strong>Potencia</strong></td><td>2.0 kW</td></tr>
        <tr><td><strong>Longitud espada</strong></td><td>35 cm</td></tr>
        <tr><td><strong>Paso cadena</strong></td><td>3/8 pulg</td></tr>
        <tr><td><strong>Peso</strong></td><td>4.7 kg</td></tr>
        <tr><td><strong>Consumo</strong></td><td>0.8 L/hora</td></tr>
      </table>
      
      <p>Con la <strong>Motosierra STIHL 240</strong>, tendrás una herramienta de calidad alemana que combina potencia, seguridad y durabilidad para todos tus trabajos de corte. <em>Garantía de 2 años del fabricante.</em></p>
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
    brandLogo: "/images/brands/echo.png",
    isOnSale: true,
    discount: 15,
    isNew: true,
    description: `
      <h2>Desbrozadora Echo SRM-225</h2>
      <p>La <strong>Desbrozadora Echo SRM-225</strong> combina <em>potencia y versatilidad</em> para el mantenimiento profesional de áreas verdes. Su motor confiable y <strong>diseño ergonómico</strong> la hacen ideal para trabajos prolongados con máxima comodidad.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Motor 2 tiempos eficiente</li>
        <li>Cabezal de hilo semiautomático</li>
        <li>Mango ergonómico</li>
        <li>Sistema de arranque ES Start</li>
        <li>Filtro de aire de alta capacidad</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Ideal para mantenimiento de jardines medianos</li>
        <li>Perfecto para desbroce regular</li>
        <li>Recomendado para uso doméstico intensivo</li>
        <li>Excelente relación calidad-precio</li>
      </ul>
      
      <h3>Especificaciones técnicas</h3>
      <table>
        <tr><td><strong>Motor</strong></td><td>2 tiempos</td></tr>
        <tr><td><strong>Cilindrada</strong></td><td>21.2 cc</td></tr>
        <tr><td><strong>Potencia</strong></td><td>0.8 kW</td></tr>
        <tr><td><strong>Diámetro de corte</strong></td><td>40 cm</td></tr>
        <tr><td><strong>Diámetro hilo</strong></td><td>2.0 mm</td></tr>
        <tr><td><strong>Peso</strong></td><td>4.4 kg</td></tr>
      </table>
      
      <p>Con la <strong>Desbrozadora Echo SRM-225</strong>, obtendrás una herramienta confiable y eficiente para el mantenimiento de tus espacios verdes. <em>Garantía de 2 años del fabricante.</em></p>
    `,
    tags: ["desbrozadora", "echo", "hilo", "jardín", "Echo"],
    additionalImages: [
      "/images/prod-home/desbrozadora.png"
    ]
  },
  {
    id: "7",
    name: "Podadora de Setos 122HD60",
    image: "/images/prod-home/husqvarna-podadora_de_setos.jpg",
    category: "Podadoras",
    brand: "Husqvarna",
    brandLogo: "/images/brands/husqvarna.png",
    description: `
      <h2>Podadora de Setos Husqvarna 122HD60</h2>
      <p>La <strong>Podadora de Setos Husqvarna 122HD60</strong> es perfecta para trabajos de jardinería exigentes gracias a su <em>diseño robusto y eficiente</em>.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Motor eléctrico confiable</li>
        <li>Cuchillas de doble filo</li>
        <li>Mango ergonómico antideslizante</li>
        <li>Sistema de seguridad integrado</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Ideal para setos medianos y grandes</li>
        <li>Perfecto para uso profesional</li>
        <li>Mantenimiento mínimo requerido</li>
      </ul>
      
      <p><em>Garantía de 2 años del fabricante.</em></p>
    `,
    tags: ["podadora", "Husqvarna", "setos", "eléctrica", "profesional", "husqvarna"]
  },
  {
    id: "8",
    name: "Sopladora Echo PB-250",
    image: "/images/prod-home/echo-sopladora.jpeg",
    category: "Sopladoras",
    brand: "Echo",
    brandLogo: "/images/brands/echo.png",
    isOnSale: true,
    discount: 16,
    description: `
      <h2>Sopladora Echo PB-250</h2>
      <p>La <strong>Sopladora Echo PB-250</strong> está diseñada para ofrecer <em>gran potencia y portabilidad</em> en limpieza de jardines y patios.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Motor 2 tiempos potente</li>
        <li>Diseño ergonómico y liviano</li>
        <li>Fácil arranque</li>
        <li>Bajo nivel de ruido</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Ideal para limpieza de hojas</li>
        <li>Perfecto para uso doméstico</li>
        <li>Fácil manejo y transporte</li>
      </ul>
      
      <p><em>Garantía de 2 años del fabricante.</em></p>
    `,
    tags: ["sopladora", "echo", "hojas", "portátil", "Echo"]
  },
  {
    id: "9",
    name: "Motoazada Husqvarna FJ500",
    image: "/images/prod-home/motoazada.jpg",
    category: "Motoazadas",
    brand: "Husqvarna",
    brandLogo: "/images/brands/husqvarna.png",
    description: `
      <h2>Motoazada Husqvarna FJ500</h2>
      <p>La <strong>Motoazada Husqvarna FJ500</strong> está diseñada para trabajos agrícolas exigentes, con <em>gran durabilidad y eficiencia</em> en terrenos duros.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Motor robusto de alto rendimiento</li>
        <li>Cuchillas reforzadas</li>
        <li>Transmisión resistente</li>
        <li>Manillar ajustable</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Ideal para terrenos duros</li>
        <li>Perfecto para uso profesional</li>
        <li>Gran durabilidad y resistencia</li>
      </ul>
      
      <p><em>Garantía de 2 años del fabricante.</em></p>
    `,
    tags: ["motoazada", "husqvarna", "terreno", "profesional", "Husqvarna"]
  },
  {
    id: "10",
    name: "Cuchillas para Motoazada",
    image: "/images/prod-home/cuchillas.jpg",
    category: "Repuestos",
    brand: "Husqvarna",
    brandLogo: "/images/brands/husqvarna.png",
    description: `
      <h2>Cuchillas para Motoazada Husqvarna</h2>
      <p>Set de <strong>cuchillas de repuesto</strong> fabricadas en <em>acero de alta resistencia</em> para garantizar un corte duradero y eficiente.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Acero de alta resistencia</li>
        <li>Diseño optimizado para corte</li>
        <li>Compatible con múltiples modelos</li>
        <li>Fácil instalación</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Mantiene el rendimiento óptimo</li>
        <li>Larga vida útil</li>
        <li>Corte limpio y preciso</li>
      </ul>
      
      <p><em>Garantía de 1 año del fabricante.</em></p>
    `,
    tags: ["cuchillas", "motoazada", "repuestos", "set", "husqvarna", "motocultor","Husqvarna"]
  },
  {
    id: "11",
    name: "Aceite 2T STIHL",
    image: "/images/prod-home/stihl-aceite_2t.jpg",
    category: "Lubricantes",
    brand: "Stihl",
    brandLogo: "/images/brands/stihl.png",
    description: `
      <h2>Aceite 2T STIHL</h2>
      <p><strong>Aceite 2T de alta calidad</strong> especialmente formulado para motores de <em>dos tiempos</em>, garantizando un rendimiento óptimo y protección superior.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Formulación especial para motores 2T</li>
        <li>Protección contra el desgaste</li>
        <li>Combustión limpia</li>
        <li>Reduce emisiones</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Prolonga la vida del motor</li>
        <li>Mantiene el rendimiento óptimo</li>
        <li>Compatible con todas las marcas</li>
      </ul>
      
      <p><em>Garantía del fabricante.</em></p>
    `,
    tags: ["aceite", "2t", "stihl", "motor", "lubricante", "STIHL"]
  },
  {
    id: "12",
    name: "Manguera de Riego",
    image: "/images/prod-home/manguera.jpg",
    category: "Mangueras",
    brand: "Echo",
    brandLogo: "/images/brands/echo.png",
    description: `
      <h2>Manguera de Riego Echo</h2>
      <p><strong>Manguera para riego agrícola</strong> disponible en diferentes longitudes, fabricada con materiales resistentes para <em>uso intensivo</em>.</p>
      
      <h3>Características principales</h3>
      <ul>
        <li>Material resistente a la intemperie</li>
        <li>Flexible y fácil de manejar</li>
        <li>Conexiones estándar</li>
        <li>Resistente a la presión</li>
      </ul>
      
      <h3>Beneficios</h3>
      <ul>
        <li>Ideal para riego extensivo</li>
        <li>Larga durabilidad</li>
        <li>Fácil almacenamiento</li>
      </ul>
      
      <p><em>Garantía de 6 meses.</em></p>
    `,
    tags: ["manguera","riego", "100m", "echo", "Echo"]
  }
];

// Productos populares (más vendidos)
export const popularProducts = products.filter(p => 
  ["1", "2", "4", "8", "10"].includes(p.id)
);

// Productos en tendencia
export const trendingProducts = products.filter(p => 
  ["5", "7", "9", "11", "12"].includes(p.id)
);

// Productos de oferta semanal
export const weeklyOfferProducts = products.filter(p => 
  p.isOnSale && ["1", "5", "8"].includes(p.id)
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