"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "@/lib/products";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  "pc-gamer": "PC Gamer",
  "placas-de-video": "Placas de video",
  "combos-actualizacion": "Combos de actualización",
};

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("/api/products");
        const payload: unknown = await response.json();
        const result = payload && typeof payload === "object"
          ? (payload as { products?: Product[]; configured?: boolean; message?: string })
          : {};

        if (!response.ok || !result.configured) {
          setIsError(true);
          setMessage(result.message ?? "No se pudo cargar la lista de publicaciones.");
          return;
        }

        setProducts(result.products ?? []);
      } catch (error) {
        console.error("No se pudieron cargar las publicaciones del administrador.", error);
        setIsError(true);
        setMessage("No se pudo conectar con el catálogo para cargar las publicaciones.");
      } finally {
        setIsLoadingProducts(false);
      }
    }

    void loadProducts();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const form = event.currentTarget;
      const response = await fetch("/api/products", {
        method: "POST",
        body: new FormData(form),
      });
      const payload: unknown = await response.json();
      const result = payload && typeof payload === "object"
        ? (payload as { message?: string; product?: Product })
        : {};
      const product = result.product;

      if (!response.ok || !product) {
        setIsError(true);
        setMessage(result.message ?? "No se pudo publicar el producto.");
        return;
      }

      setProducts((currentProducts) => [product, ...currentProducts]);
      setIsError(false);
      setMessage("Producto publicado correctamente.");
      form.reset();
    } catch (error) {
      console.error("No se pudo enviar el producto.", error);
      setIsError(true);
      setMessage("No se pudo conectar con el servidor para publicar el producto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(productId: string, productName: string) {
    if (!window.confirm(`¿Eliminar "${productName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingProductId(productId);
    setMessage(null);

    try {
      const response = await fetch(`/api/products?id=${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });
      const payload: unknown = await response.json();
      const result = payload && typeof payload === "object" ? (payload as { message?: string }) : {};

      if (!response.ok) {
        setIsError(true);
        setMessage(result.message ?? "No se pudo eliminar el producto.");
        return;
      }

      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
      setIsError(false);
      setMessage("Producto y foto eliminados correctamente.");
    } catch (error) {
      console.error("No se pudo eliminar el producto.", error);
      setIsError(true);
      setMessage("No se pudo conectar con el servidor para eliminar el producto.");
    } finally {
      setDeletingProductId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#0b0812] px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="text-sm font-medium text-violet-300 transition-colors hover:text-violet-200">
          ← Volver a la tienda
        </a>
        <h1 className="mt-8 text-3xl font-bold sm:text-4xl">Administración del catálogo</h1>
        <p className="mt-3 text-zinc-400">
          Cargá una foto, precio y descripción. La publicación aparecerá automáticamente en la sección seleccionada.
        </p>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Publicaciones actuales</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Eliminá una publicación y su foto desde aquí.
          </p>

          {isLoadingProducts ? (
            <p className="mt-6 text-sm text-zinc-400">Cargando publicaciones...</p>
          ) : products.length > 0 ? (
            <ul className="mt-6 space-y-4">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#120f1c] p-4 sm:flex-row sm:items-center"
                >
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl sm:w-28">
                    <Image src={product.imageUrl} alt={product.name} fill sizes="112px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="mt-1 text-sm text-violet-300">{CATEGORY_LABELS[product.category]}</p>
                    <p className="mt-1 text-sm text-zinc-400">{product.price}</p>
                  </div>
                  <button
                    type="button"
                    disabled={deletingProductId !== null}
                    onClick={() => void handleDelete(product.id, product.name)}
                    className="rounded-xl border border-red-400/30 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingProductId === product.id ? "Eliminando..." : "Eliminar foto y publicación"}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-white/15 p-6 text-sm text-zinc-500">
              Todavía no hay publicaciones para administrar.
            </p>
          )}
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-[#120f1c] p-6 sm:p-8"
        >
          <label className="block text-sm font-medium text-zinc-200">
            Nombre del producto
            <input
              required
              name="name"
              maxLength={100}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-violet-400"
              placeholder="Ej.: RTX Gamer Pro"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-200">
            Precio
            <input
              required
              name="price"
              maxLength={40}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-violet-400"
              placeholder="Ej.: $1.490.000"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-200">
            Descripción
            <textarea
              required
              name="description"
              maxLength={500}
              rows={4}
              className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-violet-400"
              placeholder="Características principales del equipo"
            />
          </label>

          <label className="block text-sm font-medium text-zinc-200">
            Sección
            <select
              required
              name="category"
              defaultValue="pc-gamer"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition focus:border-violet-400"
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category} value={category} className="bg-[#120f1c]">
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium text-zinc-200">
            Foto del producto
            <input
              required
              name="photo"
              type="file"
              accept="image/*"
              className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-white/20 bg-black/20 px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-600 file:px-3 file:py-2 file:font-semibold file:text-white hover:file:bg-violet-500"
            />
            <span className="mt-2 block text-xs text-zinc-500">JPG, PNG, WebP u otra imagen de hasta 5 MB.</span>
          </label>

          {message && (
            <p className={`rounded-xl px-4 py-3 text-sm ${isError ? "bg-red-500/15 text-red-200" : "bg-emerald-500/15 text-emerald-200"}`}>
              {message}
            </p>
          )}

          <button
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 font-semibold text-white transition hover:from-violet-500 hover:to-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Publicando..." : "Publicar producto"}
          </button>
        </form>

      </div>
    </main>
  );
}
