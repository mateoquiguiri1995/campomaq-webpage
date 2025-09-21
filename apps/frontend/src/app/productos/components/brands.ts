// brands.ts - Configuración de marcas disponibles
export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export const availableBrands: Brand[] = [
  {
    id: "maruyama",
    name: "Maruyama",
    logo: "/images/brands/Maruyama.png"
  },
  {
    id: "stihl",
    name: "STIHL", 
    logo: "/images/brands/stihl.png"
  },
  {
    id: "echo",
    name: "Echo",
    logo: "/images/brands/echo.png"
  },
  {
    id: "husqvarna",
    name: "Husqvarna",
    logo: "/images/brands/husqvarna.png"
  },
  {
    id: "Annovi-reberberi",
    name: "Annovi Reverberi",
    logo: "/images/brands/annovi-reberberi.png"
  },
  {
    id: "casamoto",
    name: "Casamoto",
    logo: "/images/brands/casamoto.png"
  },
  {
    id: "ducati",
    name: "Ducati",
    logo: "/images/brands/ducati.png"
  },
  {
    id: "Mitsubishi",
    name: "Mitsubishi",
    logo: "/images/brands/mitsubishi.png"
  },
  {
    id: "oleo-mac",
    name: "Oleo-Mac",
    logo: "/images/brands/oleo-mac.png"
  },
  {
    id: "shindaiwa",
    name: "Shindaiwa",
    logo: "/images/brands/shindaiwa.png"
  },
  {
    id: "whale-best",
    name: "Whale Best",
    logo: "/images/brands/whale-best.png"
  },
  
];

// Función helper para obtener solo los nombres de las marcas
export const getBrandNames = (): string[] => {
  return availableBrands.map(brand => brand.name);
};

// Función helper para obtener una marca por ID
export const getBrandById = (id: string): Brand | undefined => {
  return availableBrands.find(brand => brand.id === id);
};

// Función helper para obtener una marca por nombre
export const getBrandByName = (name: string): Brand | undefined => {
  return availableBrands.find(brand => brand.name.toLowerCase() === name.toLowerCase());
};