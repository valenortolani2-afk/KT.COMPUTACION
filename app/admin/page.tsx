"use client";

import { FormEvent, useState } from "react";
import { PRODUCT_CATEGORIES, type ProductCategory } from "@/lib/products";

const CATEGORY_LABELS: Record<ProductCategory, string> = {
  tendencias: "Tendencias",
  novedades: "Novedades",
  restaurados: "Restaurados",
};

export default function AdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

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
      const result = payload && typeof payload === "object" ? (payload as { message?: string }) : {};

      setIsError(!response.ok);
      setMessage(response.ok ? "Producto publicado correctamente." : result.message ?? "No se pudo publicar el producto.");

      if (response.ok) {
        form.reset();
      }
    } catch (error) {
      console.error("No se pudo enviar el producto.", error);
      setIsError(true);
      setMessage("No se pudo conectar con el servidor para publicar el producto.");
    } finally {
      setIsSubmitting(false);
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
              defaultValue="tendencias"
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
