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
    category: "pc-gamer",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

const SECTIONS: { category: ProductCategory; title: string; tag: string; description: string }[] = [
  {
    category: "pc-gamer",
    title: "PC Gamer",
    tag: "PC Gamer",
    description: "Equipos gamer listos para llevar tu experiencia al máximo nivel",
  },
  {
    category: "placas-de-video",
    title: "Placas de video",
    tag: "Placas de video",
    description: "Potenciá tu equipo con las mejores tarjetas gráficas",
  },
  {
    category: "combos-actualizacion",
    title: "Combos de actualización",
    tag: "Combos",
    description: "Componentes compatibles para renovar tu PC",
  },
];

export function ProductSections() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedProduct(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProduct]);

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
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          aria-label={`Ver detalles de ${product.name}`}
                          className="absolute inset-0 h-full w-full cursor-zoom-in"
                        >
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </button>
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
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
          <button
            type="button"
            aria-label="Cerrar detalles del producto"
            onClick={() => setSelectedProduct(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-detail-title"
            className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0812] shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex justify-end bg-gradient-to-b from-[#0b0812] to-transparent p-4">
              <button
                type="button"
                autoFocus
                onClick={() => setSelectedProduct(null)}
                aria-label="Cerrar"
                className="rounded-full border border-white/20 bg-black/60 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Cerrar
              </button>
            </div>

            <div className="grid gap-6 px-5 pb-8 sm:px-8 md:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80">
                <Image
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="w-fit rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
                  {SECTIONS.find((section) => section.category === selectedProduct.category)?.tag.toUpperCase()}
                </span>
                <h2 id="product-detail-title" className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                  {selectedProduct.name}
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-zinc-300">{selectedProduct.description}</p>
                <p className="mt-6 text-2xl font-bold text-white">{selectedProduct.price}</p>
              </div>
            </div>

            {(() => {
              const sameCategoryProducts = products.filter(
                (product) => product.id !== selectedProduct.id && product.category === selectedProduct.category,
              );
              const otherProducts = sameCategoryProducts.length > 0
                ? sameCategoryProducts
                : products.filter((product) => product.id !== selectedProduct.id);

              return (
                <div className="border-t border-white/10 px-5 py-8 sm:px-8">
                  <h3 className="text-xl font-semibold text-white">Otros artículos</h3>
                  {otherProducts.length > 0 ? (
                    <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {otherProducts.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => setSelectedProduct(product)}
                          className="overflow-hidden rounded-2xl border border-white/10 bg-[#120f1c] text-left transition hover:border-violet-500/50"
                        >
                          <div className="relative h-36">
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="font-medium text-white">{product.name}</p>
                            <p className="mt-2 text-sm font-semibold text-violet-300">{product.price}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-zinc-400">Todavía no hay otros artículos publicados.</p>
                  )}
                </div>
              );
            })()}
          </section>
        </div>
      )}
    </>
  );
}
