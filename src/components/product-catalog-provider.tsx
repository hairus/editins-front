"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { productCatalog } from "@/lib/api/products";
import type { Feature } from "@/types/editins";

type ProductCatalogState = {
  error: string | null;
  isLoading: boolean;
  products: Feature[];
};

const ProductCatalogContext = createContext<ProductCatalogState>({
  error: null,
  isLoading: true,
  products: [],
});

export function ProductCatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Feature[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    productCatalog()
      .then((items) => {
        if (!isMounted) return;
        setProducts(items);
        setError(null);
      })
      .catch((caught) => {
        if (!isMounted) return;
        setError(caught instanceof Error ? caught.message : "Daftar produk belum tersedia.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(() => ({ error, isLoading, products }), [error, isLoading, products]);

  return <ProductCatalogContext.Provider value={value}>{children}</ProductCatalogContext.Provider>;
}

export function useProductCatalog() {
  return useContext(ProductCatalogContext);
}
