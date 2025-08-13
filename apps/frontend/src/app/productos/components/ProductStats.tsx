"use client";

import { useMemo } from "react";
import { products } from "../data/products";
import { Package, TrendingUp, Tag } from "lucide-react";

interface ProductStatsProps {
  filteredProducts?: typeof products;
}

export default function ProductStats({ filteredProducts }: ProductStatsProps) {
  const stats = useMemo(() => {
    const productsToAnalyze = filteredProducts || products;
    
    const totalProducts = productsToAnalyze.length;
    const newProducts = productsToAnalyze.filter(p => p.isNew).length;
    const onSaleProducts = productsToAnalyze.filter(p => p.isOnSale).length;
    
    // Calcular precio promedio
    const averagePrice = productsToAnalyze.length > 0 
      ? Math.round(productsToAnalyze.reduce((sum, p) => sum + p.price, 0) / productsToAnalyze.length)
      : 0;

    // Obtener categorías únicas
    const uniqueCategories = [...new Set(productsToAnalyze.map(p => p.category))].length;

    return {
      totalProducts,
      newProducts,
      onSaleProducts,
      averagePrice,
      uniqueCategories
    };
  }, [filteredProducts]);

  const statItems = [
    {
      icon: Package,
      label: "Total Productos",
      value: stats.totalProducts,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Tag,
      label: "En Oferta",
      value: stats.onSaleProducts,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: TrendingUp,
      label: "Categorías",
      value: stats.uniqueCategories,
      color: "text-green-600",
      bgColor: "bg-green-50"
    }
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`${item.bgColor} rounded-lg p-4 border border-gray-200`}
            >
              <div className="flex items-center gap-3">
                <div className={`${item.color} p-2 rounded-lg bg-white`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {item.label}
                  </p>
                  <p className={`text-xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      {stats.averagePrice > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Precio promedio:</span> ${stats.averagePrice.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
