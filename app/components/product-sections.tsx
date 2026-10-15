"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product, ProductCategory } from "@/lib/products";

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "demo-trident",
    name: "MSI Trident 3",
    description: "La definitiva PC gamer de nueva generación",
    price: "$1490",
    imageUrl: "/pcgamer1.jpg",
    category: "tendencias",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const SECTIONS: { category: ProductCategory; title: string; tag: string; description: string }[] = [
  {
    category: "tendencias",
    title: "⚡ OFERTAS RELÁMPAGO ⚡",
    tag: "Tendencias",
    description: "Echa un vistazo a nuestras mejores configuraciones",
  },
  {
    category: "novedades",
    title: "Novedades",
    tag: "Novedades",
    description: "Los últimos equipos incorporados al catálogo",
  },
  {
    category: "restaurados",
    title: "Restaurados",
    tag: "Restaurados",
    description: "Equipos revisados, listos para rendir al máximo",
  },
];

export function ProductSections() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const payload: unknown = await response.json();

        if (!response.ok || !payload || typeof payload !== "object") {
          setStatus("No se pudo actualizar el catálogo.");
          return;
        }

        const data = payload as { products?: Product[]; configured?: boolean; message?: string };
        if (!data.configured) {
          setStatus(data.message ?? "Vercel Blob todavía no está configurado.");
          return;
        }

        setProducts(data.products ?? []);
      } catch (error) {
        console.error("No se pudo solicitar el catálogo.", error);
        setStatus("No se pudo conectar con el catálogo.");
      }
    }

    void loadProducts();
  }, []);

  return (
    <>
      {status && (
        <p className="border-y border-amber-400/20 bg-amber-400/10 px-6 py-3 text-center text-sm text-amber-200">
          {status}
        </p>
      )}
      {SECTIONS.map((section) => {
        const sectionProducts = products.filter((product) => product.category === section.category);

        return (
          <section key={section.category} id={section.category} className="bg-[#0b0812] px-6 py-20">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">{section.title}</h2>
              <p className="mt-2 text-zinc-400">{section.description}</p>

              {sectionProducts.length > 0 ? (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {sectionProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#120f1c] transition-colors hover:border-violet-500/50"
                    >
                      <div className="relative h-56">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <span className="rounded-full bg-violet-500/15 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-violet-300">
                          {section.tag.toUpperCase()}
                        </span>
                        <h3 className="mt-4 font-semibold text-white">{product.name}</h3>
                        <p className="mt-1 text-sm text-zinc-400">{product.description}</p>
                        <p className="mt-4 text-lg font-bold text-white">{product.price}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-8 rounded-2xl border border-dashed border-white/15 p-6 text-sm text-zinc-500">
                  Todavía no hay productos en esta sección.
                </p>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}
