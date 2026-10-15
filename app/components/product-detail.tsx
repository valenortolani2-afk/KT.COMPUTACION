"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_PRODUCTS, PRODUCT_CATEGORY_LABELS, type Product } from "@/lib/products";

type ProductsResponse = {
  products?: Product[];
  configured?: boolean;
  message?: string;
};

export function ProductDetail({ productId }: { productId: string }) {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const payload: unknown = await response.json();
        if (!response.ok || !payload || typeof payload !== "object") {
          throw new Error("No se pudo cargar el catálogo.");
        }

        const data = payload as ProductsResponse;
        if (data.configured && Array.isArray(data.products)) {
          if (!cancelled) {
            setProducts(data.products);
          }
        }

        if (!cancelled) {
          setStatus("ready");
        }
      } catch (error) {
        console.error("No se pudo solicitar el catálogo.", error);
        if (!cancelled) {
          setErrorMessage("No se pudo cargar el catálogo. Intentá nuevamente más tarde.");
          setStatus("error");
        }
      }
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const product = products.find((item) => item.id === productId);
  const relatedProducts = product
    ? products.filter((item) => item.id !== product.id && item.category === product.category)
    : [];
  const suggestions = product && relatedProducts.length === 0
    ? products.filter((item) => item.id !== product.id)
    : relatedProducts;

  return (
    <main className="min-h-screen bg-[#0b0812] px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href={product ? `/#${product.category}` : "/"}
          className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Volver a productos
        </Link>

        {status === "loading" && (
          <p className="py-24 text-center text-zinc-400" role="status">Cargando producto...</p>
        )}

        {status === "error" && (
          <p className="py-24 text-center text-amber-200" role="alert">{errorMessage}</p>
        )}

        {status === "ready" && !product && (
          <div className="py-24 text-center">
            <h1 className="text-2xl font-bold">No encontramos este producto</h1>
            <p className="mt-3 text-zinc-400">Puede que ya no esté disponible en el catálogo.</p>
          </div>
        )}

        {status === "ready" && product && (
          <>
            <section className="mt-8 grid gap-8 rounded-3xl border border-white/10 bg-[#120f1c] p-5 sm:p-8 md:grid-cols-2 md:items-center">
              <div className="relative min-h-72 overflow-hidden rounded-2xl bg-black/40 sm:min-h-[28rem]">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="py-3">
                <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-semibold text-violet-300">
                  {PRODUCT_CATEGORY_LABELS[product.category]}
                </span>
                <h1 className="mt-5 text-3xl font-bold sm:text-4xl">{product.name}</h1>
                <p className="mt-5 whitespace-pre-wrap leading-7 text-zinc-300">{product.description}</p>
                <p className="mt-7 text-3xl font-bold text-white">{product.price}</p>
              </div>
            </section>

            <section className="py-12 sm:py-16">
              <h2 className="text-2xl font-semibold sm:text-3xl">Productos relacionados</h2>
              <p className="mt-2 text-zinc-400">
                {relatedProducts.length > 0
                  ? `Más opciones de ${PRODUCT_CATEGORY_LABELS[product.category]}.`
                  : "Descubrí otros productos de nuestro catálogo."}
              </p>

              {suggestions.length > 0 ? (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {suggestions.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      href={`/productos/${encodeURIComponent(relatedProduct.id)}`}
                      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#120f1c] transition-colors hover:border-violet-500/50"
                    >
                      <div className="relative h-52">
                        <Image
                          src={relatedProduct.imageUrl}
                          alt={relatedProduct.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs font-semibold text-violet-300">
                          {PRODUCT_CATEGORY_LABELS[relatedProduct.category]}
                        </span>
                        <h3 className="mt-2 font-semibold">{relatedProduct.name}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{relatedProduct.description}</p>
                        <p className="mt-4 font-bold">{relatedProduct.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-6 rounded-2xl border border-dashed border-white/15 p-6 text-sm text-zinc-400">
                  Todavía no hay otros productos publicados.
                </p>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
