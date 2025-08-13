"use client";

import { useState } from "react";
import { TrendingUp, Star, Grid, Clock } from "lucide-react";

interface ProductTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProductTabs({ activeTab, onTabChange }: ProductTabsProps) {
  const tabs = [
    {
      id: "weekly-offer",
      label: "Oferta Semanal",
      icon: Clock,
      description: "Ofertas especiales"
    },
    {
      id: "popular",
      label: "Populares",
      icon: Star,
      description: "Más vendidos"
    },
    {
      id: "trending",
      label: "Tendencia",
      icon: TrendingUp,
      description: "En tendencia"
    },
    {
      id: "all",
      label: "Todos",
      icon: Grid,
      description: "Catálogo completo"
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-campomaq text-black shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
