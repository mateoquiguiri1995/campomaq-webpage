"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    isActive?: boolean;
  }>;
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-campomaq transition-colors duration-200"
      >
        <Home className="w-4 h-4" />
        <span>Inicio</span>
      </Link>
      
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
