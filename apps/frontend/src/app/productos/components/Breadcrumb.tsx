"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
  onProductsClick?: () => void; // Nueva prop para manejar click en "Productos"
}

export default function Breadcrumb({ items, onProductsClick }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      {/* Botón "Productos" que siempre resetea a todos los productos */}
      <button
        onClick={() => {
          if (onProductsClick) {
            onProductsClick();
          }
        }}
        className="flex items-center gap-1 hover:text-campomaq transition-colors duration-200 cursor-pointer"
      >
        <Home className="w-4 h-4" />
        <span>Productos</span>
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4" />
          {item.href && !item.isActive ? (
            <Link
              href={item.href}
              className="hover:text-campomaq transition-colors duration-200"
            >
              {item.label}
            </Link>
          ) : (
            <span className={item.isActive ? "text-gray-900 font-medium" : ""}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}